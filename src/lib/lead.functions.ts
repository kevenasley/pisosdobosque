import { createServerFn } from "@tanstack/react-start";
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
    .record(z.string().max(64), z.string().max(500))
    .optional()
    .default({}),
});

export type LeadResult = { success: boolean; reason?: string };

async function verifyRecaptchaToken(token: string | undefined) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, score: 0.9, reason: "no_secret_configured" };
  if (!token) return { ok: false, score: 0, reason: "missing_token" };
  try {
    const body = new URLSearchParams({ secret, response: token });
    const res = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    const json = (await res.json()) as {
      success: boolean;
      score?: number;
      "error-codes"?: string[];
    };
    const score = typeof json.score === "number" ? json.score : 0;
    const ok = json.success && score >= 0.5;
    return {
      ok,
      score,
      reason: ok ? undefined : (json["error-codes"]?.join(",") || "low_score"),
    };
  } catch {
    // fail-open: não bloqueia lead se o Google estiver fora
    return { ok: true, score: 0.5, reason: "verify_error" };
  }
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }): Promise<LeadResult> => {
    const rc = await verifyRecaptchaToken(data.recaptcha_token);
    if (!rc.ok) return { success: false, reason: rc.reason || "recaptcha" };

    const webhook = process.env.SHEETS_WEBHOOK_URL;
    if (!webhook) {
      console.error("SHEETS_WEBHOOK_URL not configured");
      // não bloqueia UX; lead segue para WhatsApp
      return { success: true, reason: "no_webhook_configured" };
    }

    const payload = {
      name: data.name,
      phone: data.phone,
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
      cidade_uf:
        data.city && data.region ? `${data.city} - ${data.region.toUpperCase()}` : "",
      recaptcha_score: rc.score,
      timestamp: new Date().toISOString(),
      ...data.attribution,
    };

    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Sheets webhook error:", err);
      // fail-open — não bloqueia o redirecionamento pro WhatsApp
    }
    return { success: true };
  });
