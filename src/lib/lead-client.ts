/**
 * Envio de leads 100% no navegador (build estático — sem SSR/Edge).
 *
 * O endpoint é o Web App público do Google Apps Script, declarado em
 * src/config/api.ts. Content-Type text/plain mantém a requisição "simples"
 * (sem preflight CORS).
 */
import { SHEETS_WEBHOOK_URL } from "@/config/api";

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  reason?: string;
  hashed_phone?: string;
  cta_origin?: string;
  page_url?: string;
  user_agent?: string;
  recaptcha_token?: string;
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  attribution?: Record<string, string>;
};

export type LeadResult = { success: boolean; reason?: string };

function buildBody(data: LeadPayload) {
  const attr = data.attribution ?? {};
  return {
    ...attr,
    name: data.name,
    phone: data.phone,
    utm_source: attr.utm_source ?? "",
    utm_medium: attr.utm_medium ?? "",
    utm_campaign: attr.utm_campaign ?? "",
    gclid: attr.gclid ?? "",
    email: data.email ?? "",
    hashed_phone: data.hashed_phone ?? "",
    reason: data.reason ?? "",
    cta_origin: data.cta_origin ?? "unknown",
    page_url: data.page_url ?? "",
    user_agent: data.user_agent ?? "",
    city: data.city ?? "",
    region: data.region ?? "",
    country: data.country ?? "",
    ip: data.ip ?? "",
    cidade_uf:
      data.city && data.region ? `${data.city} - ${data.region.toUpperCase()}` : "",
    recaptcha_token: data.recaptcha_token ?? "",
    timestamp: new Date().toISOString(),
  };
}

/** Envia o lead com até 3 tentativas. Nunca lança. */
export async function submitLeadClient(data: LeadPayload): Promise<LeadResult> {
  const body = JSON.stringify(buildBody(data));
  let lastReason = "webhook_failed";

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
        redirect: "follow",
      });
      const text = (await response.text().catch(() => "")).slice(0, 500);
      if (!response.ok) {
        console.error(`[lead] webhook HTTP ${response.status} (try ${attempt}):`, text);
        lastReason = "webhook_failed";
      } else if (/"?(ok|success)"?\s*:\s*false|"?error"?\s*:/i.test(text)) {
        console.error(`[lead] webhook rejeitou o lead (try ${attempt}):`, text);
        lastReason = "webhook_rejected";
      } else {
        return { success: true };
      }
    } catch (error) {
      console.error(`[lead] erro de rede (try ${attempt}):`, error);
      lastReason = "network_error";
    }

    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }

  // Última tentativa opaca (no-cors): não conseguimos ler a resposta, mas o
  // Apps Script recebe e grava o lead. Melhor gravar do que perder o lead.
  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    return { success: true, reason: "opaque_fallback" };
  } catch (error) {
    console.error("[lead] fallback no-cors falhou:", error);
  }

  return { success: false, reason: lastReason };
}
