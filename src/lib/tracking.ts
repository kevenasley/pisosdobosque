type DL = { dataLayer?: unknown[] };

function push(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as DL;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

export function trackContactClick(opts: {
  method: "whatsapp" | "phone" | "maps" | "email";
  ctaOrigin: string;
  label?: string;
}) {
  push({ event: "contact_click", ...opts });
}

export function trackLeadSubmit(payload: Record<string, unknown>) {
  push({ event: "lead_submit", ...payload });
}

export function trackLeadDirect(ctaOrigin: string) {
  push({ event: "lead_direct", cta_origin: ctaOrigin });
}
