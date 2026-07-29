// Geolocalização aproximada do usuário via ipwho.is (fallback: freeipapi.com),
// com cache em sessionStorage.
// Fail-open: qualquer erro resulta em campos vazios, sem travar a página.

export type ClientGeo = {
  user_city: string;
  /** Nome da região/estado (ex.: "Rio Grande do Sul"). */
  user_state: string;
  /** Sigla da região/estado (ex.: "RS") quando disponível. */
  user_state_code: string;
  user_country: string;
  /** Sigla do país em caixa baixa (ex.: "br"). */
  country_code: string;
};

const STORAGE_KEY = "pisosdobosque_geo";

const EMPTY: ClientGeo = {
  user_city: "",
  user_state: "",
  user_state_code: "",
  user_country: "",
  country_code: "",
};

let cache: ClientGeo | null = null;
let inflight: Promise<ClientGeo> | null = null;

function hasData(g: ClientGeo) {
  return Boolean(g.user_city || g.user_state || g.country_code);
}

function readStorage(): ClientGeo | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ClientGeo>;
    const geo = { ...EMPTY, ...parsed };
    return hasData(geo) ? geo : null;
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

async function fetchJson(url: string, timeoutMs = 4000): Promise<unknown | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Provedor principal: https://ipwho.is/ */
async function fromIpWhoIs(): Promise<ClientGeo | null> {
  const j = (await fetchJson("https://ipwho.is/")) as
    | {
        success?: boolean;
        city?: string;
        region?: string;
        region_code?: string;
        country?: string;
        country_code?: string;
      }
    | null;
  if (!j || j.success === false) return null;
  const geo: ClientGeo = {
    user_city: j.city || "",
    user_state: j.region || "",
    user_state_code: (j.region_code || "").toUpperCase(),
    user_country: j.country || "",
    country_code: (j.country_code || "").toLowerCase(),
  };
  return hasData(geo) ? geo : null;
}

/** Fallback: https://freeipapi.com/api/json */
async function fromFreeIpApi(): Promise<ClientGeo | null> {
  const j = (await fetchJson("https://freeipapi.com/api/json")) as
    | {
        cityName?: string;
        regionName?: string;
        countryName?: string;
        countryCode?: string;
      }
    | null;
  if (!j) return null;
  const geo: ClientGeo = {
    user_city: j.cityName && j.cityName !== "-" ? j.cityName : "",
    user_state: j.regionName && j.regionName !== "-" ? j.regionName : "",
    user_state_code: "",
    user_country: j.countryName || "",
    country_code: (j.countryCode || "").toLowerCase(),
  };
  return hasData(geo) ? geo : null;
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
      const geo = (await fromIpWhoIs()) || (await fromFreeIpApi());
      if (!geo) return EMPTY;
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

/**
 * Garante que a geo esteja resolvida antes de montar payloads (formulário).
 * Nunca rejeita e nunca trava por mais que o timeout do fetch.
 */
export function ensureClientGeo(): Promise<ClientGeo> {
  const known = getClientGeo();
  if (hasData(known)) return Promise.resolve(known);
  return initClientGeo();
}
