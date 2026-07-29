const STORAGE_KEY = "pisosdobosque_attribution";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type Attribution = {
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  msclkid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  landing_page: string;
  referrer: string;
  first_seen: string;
};
type StoredAttribution = Attribution & { saved_at: number };

const EMPTY: Attribution = {
  gclid: "",
  gbraid: "",
  wbraid: "",
  fbclid: "",
  msclkid: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  landing_page: "",
  referrer: "",
  first_seen: "",
};

const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const;
const UTMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

function readStored(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<StoredAttribution>;
    if (!p || typeof p !== "object" || typeof p.saved_at !== "number") return null;
    if (Date.now() - p.saved_at > TTL_MS) return null;
    return { ...EMPTY, ...p, saved_at: p.saved_at } as StoredAttribution;
  } catch {
    return null;
  }
}

function save(data: Attribution) {
  try {
    const payload: StoredAttribution = { ...data, saved_at: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function inferSourceMedium(c: Attribution): Attribution {
  const n = { ...c };
  if (!n.utm_source || !n.utm_medium) {
    if (n.gclid || n.gbraid || n.wbraid) {
      n.utm_source ||= "google";
      n.utm_medium ||= "cpc";
    } else if (n.fbclid) {
      n.utm_source ||= "facebook";
      n.utm_medium ||= "paid_social";
    } else if (n.msclkid) {
      n.utm_source ||= "bing";
      n.utm_medium ||= "cpc";
    }
  }
  return n;
}

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  const stored = readStored();
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return stored ?? EMPTY;
  }
  const fresh: Attribution = { ...EMPTY };
  let hasNew = false;
  for (const k of CLICK_IDS) {
    const v = (params.get(k) ?? "").trim();
    if (v) {
      fresh[k] = v;
      hasNew = true;
    }
  }
  for (const k of UTMS) {
    const v = (params.get(k) ?? "").trim();
    if (v) {
      fresh[k] = v;
      hasNew = true;
    }
  }
  if (!hasNew) return stored ?? EMPTY;
  fresh.landing_page = `${window.location.pathname}${window.location.search}`;
  fresh.referrer =
    typeof document !== "undefined" ? (document.referrer || "").slice(0, 300) : "";
  fresh.first_seen = new Date().toISOString();
  const resolved = inferSourceMedium(fresh);
  save(resolved);
  return resolved;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  const s = readStored();
  return s ? inferSourceMedium(s) : EMPTY;
}

// Alias mantido para compatibilidade com código existente
export function readAttribution(): Attribution | null {
  const s = readStored();
  return s ? inferSourceMedium(s) : null;
}

export function attributionForSheet(d: Attribution): Record<string, string> {
  return {
    gclid: d.gclid || "-",
    gbraid: d.gbraid || "-",
    wbraid: d.wbraid || "-",
    fbclid: d.fbclid || "-",
    msclkid: d.msclkid || "-",
    utm_source: d.utm_source || "-",
    utm_medium: d.utm_medium || "-",
    utm_campaign: d.utm_campaign || "-",
    utm_term: d.utm_term || "-",
    utm_content: d.utm_content || "-",
    landing_page: d.landing_page || "-",
    referrer: d.referrer || "-",
    primeiro_contato: d.first_seen || "-",
  };
}

export function trafficType(d: Attribution): string {
  if (d.gclid || d.gbraid || d.wbraid) return "Google Ads";
  if (d.fbclid) return "Meta Ads";
  if (d.msclkid) return "Microsoft Ads";
  if (d.utm_source) return `${d.utm_source} / ${d.utm_medium || "-"}`;
  return "Orgânico / Direto";
}
