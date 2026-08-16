import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { readAttribution } from "@/lib/attribution";
import { trackGenerateLead, pushDataLayer } from "@/lib/tracking";
import { initClientGeo, ensureClientGeo } from "@/lib/geo-client";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_DEFAULT_MESSAGE,
} from "@/lib/config";
import { RECAPTCHA_SITE_KEY } from "@/config/api";
import { submitLeadClient } from "@/lib/lead-client";

type GeoResult = { ip: string; city: string; region: string; country: string };

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let recaptchaScriptPromise: Promise<void> | null = null;
function loadRecaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (recaptchaScriptPromise) return recaptchaScriptPromise;
  recaptchaScriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // fail-open
    document.head.appendChild(s);
  });
  return recaptchaScriptPromise;
}

async function getRecaptchaToken(action: string): Promise<string | null> {
  try {
    await loadRecaptcha();
    if (!window.grecaptcha) return null;
    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action })
          .then(resolve, reject);
      });
    });
  } catch {
    return null;
  }
}

export const LEAD_OPEN_EVENT = "pisosdobosque:lead-open";

type OpenDetail = { ctaOrigin?: string; message?: string; reason?: string };

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(80, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe seu WhatsApp")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Informe um celular válido com DDD"),
  reason: z.string().trim().max(500).optional(),
});

async function sha256Hex(input: string) {
  if (typeof window === "undefined" || !window.crypto?.subtle) return "";
  const normalized = input.replace(/\D/g, "");
  const buf = new TextEncoder().encode(normalized);
  const digest = await window.crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function buildWhatsAppUrl(message?: string) {
  const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function openLeadCapture(detail: OpenDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LEAD_OPEN_EVENT, { detail }));
}

/** Geo do cliente (ipwho.is) — sem servidor, nunca quebra o envio. */
async function resolveGeo(): Promise<GeoResult> {
  const c = await ensureClientGeo();
  return {
    ip: "",
    city: c.user_city || "",
    region: c.user_state_code || c.user_state || "",
    country: c.country_code || "",
  };
}


export function LeadCapture() {
  const [open, setOpen] = useState(false);
  const [ctaOrigin, setCtaOrigin] = useState("unknown");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(ev: Event) {
      const detail = (ev as CustomEvent<OpenDetail>).detail || {};
      setCtaOrigin(detail.ctaOrigin || "unknown");
      setMessage(detail.message);
      setReason(typeof detail.reason === "string" ? detail.reason : "");
      setErrors({});
      setSendError(null);
      setSent(false);

      setOpen(true);
    }
    window.addEventListener(LEAD_OPEN_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(LEAD_OPEN_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
      void loadRecaptcha();
      // Pré-carrega geo (fail-open — não bloqueia envio)
      void initClientGeo();
      // Sinaliza abertura do formulário no dataLayer
      pushDataLayer({
        event: "formulario_aberto",
        cta_origem: ctaOrigin,
        cta_origin: ctaOrigin,
        pagina_origem: window.location.pathname,
      });
      return () => clearTimeout(t);
    }
  }, [open, ctaOrigin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, phone, reason });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[String(issue.path[0])] = issue.message;
      }
      setErrors(map);
      return;
    }
    setErrors({});
    setSendError(null);
    setSubmitting(true);
    try {
      // 1. Gerar lead_id único para esta submissão lógica
      const leadId = (() => {
        if (typeof crypto !== 'undefined') {
          if (crypto.randomUUID) return crypto.randomUUID();
          if (crypto.getRandomValues) {
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);
            return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
          }
        }
        return `id-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      })();

      const token = await getRecaptchaToken("lead_submit");
      const rawAttribution = (readAttribution() || {}) as Record<string, unknown>;
      // Normaliza tudo para string (o servidor só aceita string) e remove campos internos.
      const attribution = Object.fromEntries(
        Object.entries(rawAttribution)
          .filter(([k]) => k !== "saved_at")
          .map(([k, v]) => [k, v === null || v === undefined ? "" : String(v)]),
      ) as Record<string, string>;
      const hashed_phone = await sha256Hex(parsed.data.phone);
      const geo = await resolveGeo();

      try {
        const result = await submitLeadClient({
            lead_id: leadId,
            name: parsed.data.name,
            phone: parsed.data.phone,
            reason: parsed.data.reason || "",
            hashed_phone,
            cta_origin: ctaOrigin,
            page_url: typeof window !== "undefined" ? window.location.href : "",
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            recaptcha_token: token || undefined,
            city: geo.city,
            region: geo.region,
            country: geo.country,
            ip: geo.ip,
            attribution,
        });
        // Fail-closed: só seguimos quando o servidor confirma a gravação do lead.
        if (!result.success) {
          console.error("[LeadCapture] Falha no envio do lead:", result.reason);
          setSendError(
            result.reason === "recaptcha_failed" ||
              result.reason === "missing_token" ||
              result.reason === "low_score"
              ? "Não conseguimos validar seu envio. Recarregue a página e tente novamente."
              : "Não conseguimos registrar seus dados agora. Tente novamente em alguns segundos ou fale direto no WhatsApp.",
          );
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("[LeadCapture] Erro de rede no envio do lead:", err);
        setSendError(
          "Falha de conexão ao enviar seus dados. Tente novamente ou fale direto no WhatsApp.",
        );
        setSubmitting(false);
        return;
      }


      // Evento principal de conversão — com user_data normalizado para
      // Enhanced Conversions (Google Ads) e CAPI (Meta).
      trackGenerateLead({
        input: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          city: geo.city,
          region: geo.region,
          country: geo.country || "br",
          ip: geo.ip,
        },
        ctaOrigin,
        status: "qualificado",
        eventName: "generate_lead",
        extra: { 
          hashed_phone,
          lead_id: leadId,
          transaction_id: leadId
        },
      });

      const msg =
        message ||
        `Olá! Sou ${parsed.data.name}. ${
          parsed.data.reason ? parsed.data.reason + " " : ""
        }Gostaria de um atendimento.`;

      // Feedback de sucesso + limpeza dos campos antes do redirecionamento
      setSent(true);
      setName("");
      setPhone("");
      setReason("");

      window.open(buildWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
      window.setTimeout(() => {
        window.location.href = "/obrigado?src=form";
      }, 900);
    } finally {
      setSubmitting(false);
    }
  }

  async function goDirect() {
    if (submitting) return;
    setSubmitting(true);
    
    // Abrir WhatsApp imediatamente para não prejudicar UX (percepção de velocidade)
    // Usamos window.open antes da navegação local para garantir abertura da aba.
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");

    try {
      const leadId = crypto.randomUUID();
      const geo = await resolveGeo();
      const rawAttribution = (readAttribution() || {}) as Record<string, unknown>;
      const attribution = Object.fromEntries(
        Object.entries(rawAttribution)
          .filter(([k]) => k !== "saved_at")
          .map(([k, v]) => [k, v === null || v === undefined ? "" : String(v)]),
      ) as Record<string, string>;

      // Dispara o evento dataLayer IMEDIATAMENTE
      trackGenerateLead({
        input: {
          name: "",
          phone: "",
          city: geo.city,
          region: geo.region,
          country: geo.country || "br",
          ip: geo.ip,
        },
        ctaOrigin,
        status: "sem_dados",
        eventName: "lead_direct",
        extra: {
          lead_id: leadId,
          transaction_id: leadId,
        }
      });

      // Registro na planilha usando keepalive: true para sobreviver à navegação iminente.
      // mode: 'no-cors' é usado internamente em submitLeadClient quando keepalive é true.
      void submitLeadClient(
        {
          lead_id: leadId,
          tipo_lead: "Lead direto WhatsApp",
          evento: "lead_direct",
          status: "Clique no WhatsApp — não identificado",
          valor_conversao: "30",
          cta_origin: ctaOrigin,
          page_url: typeof window !== "undefined" ? window.location.href : "",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          city: geo.city,
          region: geo.region,
          country: geo.country,
          ip: geo.ip,
          attribution,
        },
        { keepalive: true }
      );

      // Navegação para /obrigado acontece quase instantaneamente
      window.location.href = "/obrigado?src=direct";
    } catch (err) {
      console.error("[LeadCapture] Erro silencioso goDirect:", err);
      // Se algo falhar no JS, ainda assim tentamos levar para a página de obrigado
      window.location.href = "/obrigado?src=direct";
    } finally {
      // Submitting não precisa ser resetado se a página vai navegar
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fale com um consultor</DialogTitle>
          <DialogDescription>
            Preencha rapidinho e te levamos direto para o WhatsApp com o consultor certo.
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={onSubmit} className="space-y-4">
          {sendError && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {sendError}{" "}
              <button
                type="button"
                onClick={goDirect}
                className="underline font-medium"
              >
                Falar agora no WhatsApp
              </button>
            </div>
          )}
          {sent && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-brand-green/30 bg-brand-green/10 px-3 py-2 text-sm text-brand-green"
            >
              Dados enviados! Abrindo o WhatsApp...
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="lead-name">Nome</Label>
            <Input
              id="lead-name"
              ref={firstFieldRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className="focus-visible:ring-brand-green focus-visible:border-brand-green"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-phone">WhatsApp</Label>
            <Input
              id="lead-phone"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              placeholder="(51) 99999-9999"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              className="focus-visible:ring-brand-green focus-visible:border-brand-green"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-reason">Motivo do contato (opcional)</Label>
            <Textarea
              id="lead-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: procuro porcelanato para sala 30m²"
              rows={3}
              className="focus-visible:ring-brand-green focus-visible:border-brand-green"
            />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={submitting || sent}
              className="w-full gap-2 bg-brand-green text-white hover:bg-brand-green/90 focus-visible:ring-brand-green"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {sent ? "Enviado!" : submitting ? "Enviando..." : "Falar no WhatsApp"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={goDirect}
              className="w-full text-xs text-muted-foreground"
            >
              Prefiro ir direto, sem preencher
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] leading-snug text-muted-foreground">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 shrink-0 text-brand-green"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>
              Protegido por reCAPTCHA ·{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-green"
              >
                Privacidade
              </a>{" "}
              ·{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-green"
              >
                Termos
              </a>
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
