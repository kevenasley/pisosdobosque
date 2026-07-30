/**
 * Configuração centralizada de endpoints externos.
 *
 * Regra arquitetural (Cloudflare Pages + GitHub):
 * - No frontend use SEMPRE `import.meta.env.VITE_*` (nunca `process.env`).
 * - Todo endpoint externo fica declarado aqui, com fallback fixo para o
 *   build estático caso a variável não seja detectada.
 */

/** Web App público do Google Apps Script (planilha de leads) — URL fixa. */
export const SHEETS_WEBHOOK_URL_FALLBACK =
  "https://script.google.com/macros/s/AKfycbycJwWdUzopbiVd-IKt-yvvjySGmaYdxSmhzcFpy-i_qW6EEGhby0hmmC4SSykx4Mj_/exec";

/** URL efetiva do webhook de leads (fixa, sem variáveis de ambiente). */
export const SHEETS_WEBHOOK_URL = SHEETS_WEBHOOK_URL_FALLBACK;

/** Endpoint público de geolocalização por IP usado no enriquecimento de leads. */
export const GEO_IP_URL =
  import.meta.env.VITE_GEO_IP_URL || "https://ipwho.is/";
