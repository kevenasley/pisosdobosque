const KEY = "pisosdobosque_consent";
const TTL_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 meses

export type ConsentState = {
  analytics: "granted" | "denied";
  ads: "granted" | "denied";
  decided_at: number;
};

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;

export const CONSENT_OPEN_EVENT = "pisosdobosque:consent-open";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as ConsentState;
    if (Date.now() - d.decided_at > TTL_MS) return null;
    return d;
  } catch {
    return null;
  }
}

export function saveConsent(state: Omit<ConsentState, "decided_at">) {
  if (typeof window === "undefined") return;
  const full: ConsentState = { ...state, decided_at: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    // ignore
  }
  applyConsent(full);
}

export function applyConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    fbq?: FbqFn;
  };
  w.dataLayer = w.dataLayer || [];
  const gtag: GtagFn =
    w.gtag ||
    function (...args: unknown[]) {
      (w.dataLayer as unknown[]).push(args);
    };
  gtag("consent", "update", {
    ad_storage: state.ads,
    ad_user_data: state.ads,
    ad_personalization: state.ads,
    analytics_storage: state.analytics,
  });
  if (typeof w.fbq === "function") {
    w.fbq("consent", state.ads === "granted" ? "grant" : "revoke");
  }
}

export function openConsentPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
