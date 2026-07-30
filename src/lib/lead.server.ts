import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^\(\d{2}\) \d{5}-\d{4}$/),
  email: z.string().trim().max(160).optional().default(""),
  reason: z.string().trim().max(500).optional().default(""),
  hashed_phone: z.string().trim().max(128).optional().default(""),
  cta_origin: z.string().trim().max(64).optional().default("unknown"),
  page_url: z.string().trim().max(2000).optional().default(""),
  user_agent: z.string().trim().max(500).optional().default(""),
  recaptcha_token: z.string().trim().min(10).max(4000).optional(),
  city: z.string().trim().max(80).optional().default(""),
  region: z.string().trim().max(40).optional().default(""),
  country: z.string().trim().max(4).optional().default(""),
  ip: z.string().trim().max(64).optional().default(""),
  attribution: z
    .record(
      z.string().max(64),
      z
        .union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])
        .transform((v) => (v === null || v === undefined ? "" : String(v)).slice(0, 500)),
    )
    .optional()
    .default({}),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadResult = { success: boolean; reason?: string };

export function parseLead(input: unknown): LeadInput {
  return leadSchema.parse(input);
}

async function verifyRecaptchaToken(token: string | undefined) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, score: 0.9, reason: "no_secret_configured" };
  if (!token) return { ok: false, score: 0, reason: "missing_token" };

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const json = (await response.json()) as {
      success: boolean;
      score?: number;
      "error-codes"?: string[];
    };
    const score = typeof json.score === "number" ? json.score : 0;
    const ok = json.success && score >= 0.5;
    return { ok, score, reason: ok ? undefined : json["error-codes"]?.join(",") || "low_score" };
  } catch (error) {
    console.error("reCAPTCHA verification unavailable:", error);
    return { ok: true, score: 0.5, reason: "verify_error" };
  }
}

export async function processLead(data: LeadInput): Promise<LeadResult> {
  const recaptcha = await verifyRecaptchaToken(data.recaptcha_token);
  if (!recaptcha.ok) {
    return { success: false, reason: recaptcha.reason || "recaptcha_failed" };
  }

  const webhook = process.env.SHEETS_WEBHOOK_URL_V2 || process.env.SHEETS_WEBHOOK_URL;
  if (!webhook) {
    console.error("Sheets webhook URL is not configured");
    return { success: false, reason: "missing_webhook_url" };
  }

  const attr = data.attribution ?? {};
  const payload = {
    ...attr,
    name: data.name,
    phone: data.phone,
    utm_source: attr.utm_source ?? "",
    utm_medium: attr.utm_medium ?? "",
    utm_campaign: attr.utm_campaign ?? "",
    gclid: attr.gclid ?? "",
    email: data.email,
    hashed_phone: data.hashed_phone,
    reason: data.reason,
    cta_origin: data.cta_origin,
    page_url: data.page_url,
    user_agent: data.user_agent,
    city: data.city,
    region: data.region,
    country: data.country,
    ip: data.ip,
    cidade_uf: data.city && data.region ? `${data.city} - ${data.region.toUpperCase()}` : "",
    recaptcha_score: recaptcha.score,
    timestamp: new Date().toISOString(),
  };

  let lastReason = "webhook_failed";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });
      const text = (await response.text().catch(() => "")).slice(0, 500);
      if (!response.ok) {
        console.error(`Sheets webhook HTTP ${response.status} (try ${attempt}):`, text);
        lastReason = "webhook_failed";
      } else if (/"?(ok|success)"?\s*:\s*false|"?error"?\s*:/i.test(text)) {
        console.error(`Sheets webhook rejected lead (try ${attempt}):`, text);
        lastReason = "webhook_rejected";
      } else {
        console.info(`Lead saved successfully by Sheets webhook (try ${attempt})`);
        return { success: true };
      }
    } catch (error) {
      console.error(`Sheets webhook network error (try ${attempt}):`, error);
      lastReason = "network_error";
    }

    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 400));
  }

  return { success: false, reason: lastReason };
}