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
import { trackLeadDirect, trackLeadSubmit } from "@/lib/tracking";
import {
  SHEETS_WEBHOOK_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_DEFAULT_MESSAGE,
} from "@/lib/config";
import { verifyRecaptcha, RECAPTCHA_SITE_KEY } from "@/lib/recaptcha.functions";

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

type OpenDetail = { ctaOrigin?: string; message?: string };

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(80, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d[\d\s()-]{8,20}$/u, "Telefone inválido"),
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

function buildWhatsAppUrl(message?: string) {
  const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function openLeadCapture(detail: OpenDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LEAD_OPEN_EVENT, { detail }));
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
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(ev: Event) {
      const detail = (ev as CustomEvent<OpenDetail>).detail || {};
      setCtaOrigin(detail.ctaOrigin || "unknown");
      setMessage(detail.message);
      setErrors({});
      setOpen(true);
    }
    window.addEventListener(LEAD_OPEN_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(LEAD_OPEN_EVENT, handler as EventListener);
  }, []);

    useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
      // Pré-carrega o reCAPTCHA quando o modal abre para não atrasar o submit
      void loadRecaptcha();
      return () => clearTimeout(t);
    }
  }, [open]);

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
    setSubmitting(true);
    try {
      // reCAPTCHA v3 — verifica antes de gravar o lead
      const token = await getRecaptchaToken("lead_submit");
      if (token) {
        try {
          const result = await verifyRecaptcha({
            data: { token, action: "lead_submit" },
          });
          if (!result.success) {
            setErrors({
              phone:
                "Não conseguimos validar sua sessão. Recarregue a página e tente novamente.",
            });
            setSubmitting(false);
            return;
          }
        } catch {
          // fail-open em caso de falha de rede na verificação
        }
      }
      const attribution = readAttribution() || {};
      const hashed_phone = await sha256Hex(parsed.data.phone);
      const payload = {
        name: parsed.data.name,
        phone: parsed.data.phone,
        hashed_phone,
        reason: parsed.data.reason || "",
        ...attribution,
        cta_origin: ctaOrigin,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      // fire-and-forget com keepalive para sobreviver ao redirect
      try {
        fetch(SHEETS_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } catch {
        // não bloqueia o redirecionamento — o lead é priorizado
      }
      trackLeadSubmit({
        cta_origin: ctaOrigin,
        hashed_phone,
        utm_source: attribution && "utm_source" in attribution ? attribution.utm_source : undefined,
        utm_medium: attribution && "utm_medium" in attribution ? attribution.utm_medium : undefined,
        utm_campaign: attribution && "utm_campaign" in attribution ? attribution.utm_campaign : undefined,
        gclid: attribution && "gclid" in attribution ? attribution.gclid : undefined,
        fbclid: attribution && "fbclid" in attribution ? attribution.fbclid : undefined,
      });
      const msg =
        message ||
        `Olá! Sou ${parsed.data.name}. ${
          parsed.data.reason ? parsed.data.reason + " " : ""
        }Gostaria de um atendimento.`;
      // Abre WhatsApp em nova aba e leva o usuário para a página de obrigado
      window.open(buildWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
      window.location.href = "/obrigado?src=form";
    } finally {
      setSubmitting(false);
    }
  }

  function goDirect() {
    trackLeadDirect(ctaOrigin);
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    window.location.href = "/obrigado?src=direct";
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
              onChange={(e) => setPhone(e.target.value)}
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
              disabled={submitting}
              className="w-full gap-2 bg-brand-green text-white hover:bg-brand-green/90 focus-visible:ring-brand-green"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {submitting ? "Enviando..." : "Falar no WhatsApp"}
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
          <p className="text-[11px] leading-snug text-muted-foreground">
            Ao enviar você concorda em receber contato via WhatsApp. Seus dados
            são usados apenas para atendimento.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
