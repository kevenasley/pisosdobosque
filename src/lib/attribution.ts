const KEY = "attribution_v1";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page: string;
  referrer: string;
  captured_at: number;
};

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    const hasNew = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "gclid",
      "fbclid",
    ].some((k) => p.get(k));
    const existing = readAttribution();
    if (!hasNew && existing) return;
    const data: Attribution = {
      utm_source: p.get("utm_source") || undefined,
      utm_medium: p.get("utm_medium") || undefined,
      utm_campaign: p.get("utm_campaign") || undefined,
      utm_term: p.get("utm_term") || undefined,
      utm_content: p.get("utm_content") || undefined,
      gclid: p.get("gclid") || undefined,
      fbclid: p.get("fbclid") || undefined,
      landing_page: url.pathname,
      referrer: document.referrer,
      captured_at: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // silencioso — storage indisponível ou bloqueado
  }
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Attribution;
    if (Date.now() - d.captured_at > TTL_MS) return null;
    return d;
  } catch {
    return null;
  }
}
