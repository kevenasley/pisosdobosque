// Central configuration constants for tracking, lead capture and integrations.
// Substitua os placeholders quando os IDs reais estiverem disponíveis.

export const GTM_ID = "GTM-K9QMMX9N";
export const WHATSAPP_NUMBER = "5551984905782";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vi o site de vocês e gostaria de um atendimento.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE,
)}`;
// SHEETS_WEBHOOK_URL foi movido para o server (env SHEETS_WEBHOOK_URL) e é
// consumido apenas em src/lib/lead.functions.ts para evitar POSTs anônimos
// diretos ao Apps Script a partir do cliente.
