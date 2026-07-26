// Central configuration constants for tracking, lead capture and integrations.
// Substitua os placeholders quando os IDs reais estiverem disponíveis.

export const GTM_ID = "GTM-XXXXXXX";
export const WHATSAPP_NUMBER = "5551984905782";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vi o site de vocês e gostaria de um atendimento.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE,
)}`;
export const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/XXX/exec";
