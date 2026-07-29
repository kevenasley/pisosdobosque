import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const RECAPTCHA_SITE_KEY = "6LfQpWotAAAAAOtWaIQSL8FUnCFo0kQAPdqGQ23t";

const inputSchema = z.object({
  token: z.string().min(10).max(4000),
  action: z.string().max(64).optional(),
});

export type RecaptchaResult = {
  success: boolean;
  score: number;
  action?: string;
  reason?: string;
};

export const verifyRecaptcha = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<RecaptchaResult> => {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      // fail-open em dev sem chave; em produção a chave estará presente
      return { success: true, score: 0.9, reason: "no_secret_configured" };
    }
    try {
      const body = new URLSearchParams({ secret, response: data.token });
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
        action?: string;
        "error-codes"?: string[];
      };
      const score = typeof json.score === "number" ? json.score : 0;
      const ok = json.success && score >= 0.5 &&
        (!data.action || !json.action || json.action === data.action);
      return {
        success: ok,
        score,
        action: json.action,
        reason: ok ? undefined : (json["error-codes"]?.join(",") || "low_score"),
      };
    } catch {
      // fail-open para não bloquear leads em caso de falha de rede
      return { success: true, score: 0.5, reason: "verify_error" };
    }
  });
