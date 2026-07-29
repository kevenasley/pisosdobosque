// Geolocalização aproximada do usuário via ipapi.co, com cache em sessionStorage.
// Fail-open: qualquer erro resulta em campos vazios, sem travar a página.

export type ClientGeo = {
  user_city: string;
  user_state: string;
  user_country: string;
  /** Sigla do país (ex.: "br") — útil para normalização de eventos. */
  country_code: string;
};

const STORAGE_KEY = "pisosdobosque_geo";

const EMPTY: ClientGeo = {
  user_city: "",
  user_state: "",
  user_country: "",
  country_code: "",
};

let cache: ClientGeo | null = null;
let inflight: Promise<ClientGeo> | null = null;

function readStorage(): ClientGeo | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ClientGeo>;
    return { ...EMPTY, ...parsed };
  } catch {
    return null;
  }
}

function writeStorage(geo: ClientGeo) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(geo));
  } catch {
    // ignore (modo privado / cota)
  }
}

/** Retorna a geo já conhecida (cache em memória ou sessionStorage), sem rede. */
export function getClientGeo(): ClientGeo {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  const stored = readStorage();
  if (stored) {
    cache = stored;
    return stored;
  }
  return EMPTY;
}

/** Busca a geo uma única vez por sessão. Nunca rejeita. */
export function initClientGeo(): Promise<ClientGeo> {
  if (typeof window === "undefined") return Promise.resolve(EMPTY);
  if (cache) return Promise.resolve(cache);
  const stored = readStorage();
  if (stored) {
    cache = stored;
    return Promise.resolve(stored);
  }
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timer);
      if (!res.ok) return EMPTY;
      const j = (await res.json()) as {
        city?: string;
        region?: string;
        country_name?: string;
        country_code?: string;
        error?: boolean;
      };
      if (j?.error) return EMPTY;
      const geo: ClientGeo = {
        user_city: j.city || "",
        user_state: j.region || "",
        user_country: j.country_name || "",
        country_code: (j.country_code || "").toLowerCase(),
      };
      cache = geo;
      writeStorage(geo);
      return geo;
    } catch {
      return EMPTY;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
