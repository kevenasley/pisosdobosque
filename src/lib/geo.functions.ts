import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type GeoResult = {
  ip: string;
  city: string;
  region: string;
  country: string;
};

const EMPTY: GeoResult = { ip: "", city: "", region: "", country: "" };

/**
 * Retorna cidade/UF/país a partir do IP do cliente.
 * Usa ipinfo.io se IPINFO_TOKEN estiver configurado; caso contrário, tenta
 * headers do Cloudflare (CF-IPCountry) e retorna vazio em campos ausentes.
 */
export const getGeoFromIP = createServerFn({ method: "GET" }).handler(
  async (): Promise<GeoResult> => {
    try {
      const req = getRequest();
      const h = req?.headers;
      const ip =
        (h?.get("cf-connecting-ip") ||
          h?.get("x-forwarded-for")?.split(",")[0].trim() ||
          h?.get("x-real-ip") ||
          "") as string;

      const token = process.env.IPINFO_TOKEN;
      if (token && ip) {
        try {
          const res = await fetch(
            `https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${token}`,
            { headers: { Accept: "application/json" } },
          );
          if (res.ok) {
            const j = (await res.json()) as {
              ip?: string;
              city?: string;
              region?: string;
              country?: string;
            };
            return {
              ip: j.ip || ip,
              city: j.city || "",
              region: j.region || "",
              country: (j.country || "").toLowerCase(),
            };
          }
        } catch {
          // fall-through
        }
      }

      return {
        ip,
        city: "",
        region: "",
        country: (h?.get("cf-ipcountry") || "").toLowerCase(),
      };
    } catch {
      return EMPTY;
    }
  },
);
