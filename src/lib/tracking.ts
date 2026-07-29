import { getAttribution, trafficType, type Attribution } from "@/lib/attribution";

type DL = { dataLayer?: unknown[]; fbq?: (...args: unknown[]) => void };

function push(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as DL;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

function attrPayload(attr: Attribution) {
  return {
    trafego_tipo: trafficType(attr),
    gclid: attr.gclid,
    gbraid: attr.gbraid,
    wbraid: attr.wbraid,
    fbclid: attr.fbclid,
    msclkid: attr.msclkid,
    utm_source: attr.utm_source,
    utm_medium: attr.utm_medium,
    utm_campaign: attr.utm_campaign,
    utm_term: attr.utm_term,
    utm_content: attr.utm_content,
    landing_page: attr.landing_page,
  };
}

const EVENT_BY_METHOD: Record<string, string> = {
  phone: "contact_phone_click",
  email: "contact_email_click",
  whatsapp: "contact_whatsapp_click",
  maps: "contact_maps_click",
};

export function trackContactClick(opts: {
  method: "whatsapp" | "phone" | "maps" | "email";
  ctaOrigin: string;
  label?: string;
}) {
  if (typeof window === "undefined") return;
  const attr = getAttribution();
  const payload = {
    event: EVENT_BY_METHOD[opts.method] || "contact_click",
    contact_method: opts.method,
    cta_origem: opts.ctaOrigin,
    cta_origin: opts.ctaOrigin,
    contact_label: opts.label || "-",
    pagina_origem: window.location.pathname,
    lead_quality: "micro_conversao",
    ...attrPayload(attr),
  };
  push(payload);
  const w = window as unknown as DL;
  try {
    w.fbq?.("trackCustom", "ContactClick", {
      content_name: opts.ctaOrigin,
      content_category: opts.method,
    });
  } catch {
    // ignore
  }
}

// --- Normalização para Enhanced Conversions (Google Ads) e CAPI (Meta) ---

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function splitName(full: string): { first_name: string; last_name: string } {
  const parts = stripAccents(full.trim().toLowerCase()).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

export function normalizePhoneBR(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return `+${digits}`;
  return `+55${digits}`;
}

export function normalizeRegion(uf: string): string {
  return uf.trim().toLowerCase().slice(0, 2);
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

export function readFbp(): string {
  return readCookie("_fbp");
}

export function readFbc(): string {
  const cookie = readCookie("_fbc");
  if (cookie) return cookie;
  try {
    const p = new URLSearchParams(window.location.search);
    const fbclid = p.get("fbclid");
    if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  } catch {
    // ignore
  }
  return "";
}

export type LeadUserInput = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
};

export function trackGenerateLead(args: {
  input: LeadUserInput;
  ctaOrigin: string;
  status: "qualificado" | "sem_dados";
  eventName?: "generate_lead" | "lead_direct";
  extra?: Record<string, unknown>;
}) {
  if (typeof window === "undefined") return;
  const attr = getAttribution();
  const { first_name, last_name } = splitName(args.input.name || "");
  const phoneE164 = normalizePhoneBR(args.input.phone || "");
  const email = (args.input.email || "").trim().toLowerCase();
  const city = stripAccents((args.input.city || "").trim().toLowerCase());
  const region = normalizeRegion(args.input.region || "");
  const country = (args.input.country || "br").trim().toLowerCase();
  const cidadeUf =
    args.input.city && args.input.region
      ? `${args.input.city} - ${args.input.region.toUpperCase()}`
      : "";

  const payload: Record<string, unknown> = {
    event: args.eventName || "generate_lead",
    lead_quality: args.status,
    lead_source: "whatsapp_modal",
    lead_nome: args.input.name || "",
    lead_whatsapp: args.input.phone || "",
    lead_email: email || "",
    cidade_uf: cidadeUf || "",
    cta_origem: args.ctaOrigin,
    cta_origin: args.ctaOrigin,
    pagina_origem: window.location.pathname,
    status_acao:
      args.eventName === "lead_direct"
        ? "Pulou Formulário"
        : "Preencheu e Continuou",
    ...attrPayload(attr),
    user_data: {
      email: email || undefined,
      phone_number: phoneE164 || undefined,
      address: {
        first_name: first_name || undefined,
        last_name: last_name || undefined,
        city: city || undefined,
        region: region || undefined,
        country: country || undefined,
      },
    },
    client_ip_address: args.input.ip || "",
    client_user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : "",
    fbp: readFbp(),
    fbc: readFbc(),
    ...(args.extra || {}),
  };
  push(payload);

  const w = window as unknown as DL;
  try {
    w.fbq?.("track", "Lead", {
      content_name: args.ctaOrigin,
    });
  } catch {
    // ignore
  }
}

// Compat: mantém APIs antigas usadas em outros pontos do código.
export function trackLeadSubmit(payload: Record<string, unknown>) {
  push({ event: "lead_submit", ...payload });
}

export function trackLeadDirect(ctaOrigin: string) {
  push({ event: "lead_direct", cta_origem: ctaOrigin, cta_origin: ctaOrigin });
}
