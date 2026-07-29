import { createServerFn } from "@tanstack/react-start";

export type GoogleReview = {
  author: string;
  initial: string;
  rating: number;
  text: string;
  relativeTime: string;
  photoUrl?: string;
};

export type OpeningInfo = {
  openNow: boolean | null;
  statusText: string; // "Aberto agora · fecha às 18h30" ou "Fechado · abre segunda 08h"
  weekdayDescriptions: string[]; // 7 strings, ex.: "segunda-feira: 08:00 – 12:00, 13:30 – 18:30"
};

export type PlaceStats = {
  rating: number;
  ratingFormatted: string; // "4.9"
  userRatingCount: number;
  userRatingCountFormatted: string; // "2.402"
  reviews: GoogleReview[];
  opening: OpeningInfo;
};

const PLACE_ID = "ChIJTyoE7NlzGZURHlAt9IQVcGE";
const CACHE_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 dias
// Refresh de openNow separado — muda várias vezes por dia
const OPENING_TTL_MS = 15 * 60 * 1000; // 15 min

let cache: { at: number; data: PlaceStats } | null = null;

const FALLBACK_OPENING: OpeningInfo = {
  openNow: null,
  statusText: "Seg–Sex 8h–18h30 · Sáb 8h–17h",
  weekdayDescriptions: [
    "domingo: Fechado",
    "segunda-feira: 08:00 – 12:00, 13:30 – 18:30",
    "terça-feira: 08:00 – 12:00, 13:30 – 18:30",
    "quarta-feira: 08:00 – 12:00, 13:30 – 18:30",
    "quinta-feira: 08:00 – 12:00, 13:30 – 18:30",
    "sexta-feira: 08:00 – 12:00, 13:30 – 18:30",
    "sábado: 08:00 – 12:00, 13:30 – 17:00",
  ],
};

const FALLBACK: PlaceStats = {
  rating: 4.9,
  ratingFormatted: "4.9",
  userRatingCount: 2402,
  userRatingCountFormatted: "2.402",
  reviews: [],
  opening: FALLBACK_OPENING,
};

function fmtCount(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}

function fmtRating(n: number): string {
  return n.toFixed(1).replace(",", ".");
}

function fmtHm(hour?: number, minute?: number): string {
  const h = hour ?? 0;
  const m = minute ?? 0;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

type Period = {
  open?: { day?: number; hour?: number; minute?: number };
  close?: { day?: number; hour?: number; minute?: number };
};

const DAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function computeStatus(openNow: boolean, periods: Period[]): string {
  // Hora local em São Paulo (BRT, UTC-3 sem DST atualmente)
  const nowStr = new Date().toLocaleString("en-US", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });
  const sp = new Date(nowStr);
  const day = sp.getDay();
  const nowMin = sp.getHours() * 60 + sp.getMinutes();

  if (openNow) {
    // Encontra o período atual que contém "agora" e usa seu close
    for (const p of periods) {
      if (p.open?.day !== day || !p.close) continue;
      const openMin = (p.open.hour ?? 0) * 60 + (p.open.minute ?? 0);
      // Períodos podem virar o dia; se close.day != open.day e nowMin < openMin, tratamos como não incluso
      const closeMin =
        p.close.day === p.open.day
          ? (p.close.hour ?? 24) * 60 + (p.close.minute ?? 0)
          : 24 * 60;
      if (nowMin >= openMin && nowMin < closeMin) {
        return `Aberto agora · fecha às ${fmtHm(p.close.hour, p.close.minute)}`;
      }
    }
    return "Aberto agora";
  }

  // Fechado: encontra próxima abertura
  for (let i = 0; i < 8; i++) {
    const checkDay = (day + i) % 7;
    const minCutoff = i === 0 ? nowMin : 0;
    const candidates = periods
      .filter((p) => p.open?.day === checkDay)
      .map((p) => ({
        min: (p.open?.hour ?? 0) * 60 + (p.open?.minute ?? 0),
        hour: p.open?.hour,
        minute: p.open?.minute,
      }))
      .filter((c) => c.min > minCutoff)
      .sort((a, b) => a.min - b.min);
    if (candidates.length) {
      const next = candidates[0];
      const label = i === 0 ? "hoje" : i === 1 ? "amanhã" : DAY_SHORT[checkDay];
      return `Fechado · abre ${label} ${fmtHm(next.hour, next.minute)}`;
    }
  }
  return "Fechado agora";
}

function extractOpening(json: {
  regularOpeningHours?: {
    openNow?: boolean;
    periods?: Period[];
    weekdayDescriptions?: string[];
  };
  currentOpeningHours?: {
    openNow?: boolean;
    periods?: Period[];
    weekdayDescriptions?: string[];
  };
}): OpeningInfo {
  const primary = json.currentOpeningHours ?? json.regularOpeningHours;
  if (!primary) return FALLBACK_OPENING;
  const openNow = primary.openNow ?? null;
  const periods = primary.periods ?? [];
  const weekdayDescriptions =
    primary.weekdayDescriptions?.length
      ? primary.weekdayDescriptions
      : FALLBACK_OPENING.weekdayDescriptions;

  let statusText: string;
  if (openNow === null) {
    statusText = FALLBACK_OPENING.statusText;
  } else {
    statusText = computeStatus(openNow, periods);
  }
  return { openNow, statusText, weekdayDescriptions };
}

export const getGooglePlaceStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlaceStats> => {
    const now = Date.now();
    // Se cache ainda tem <15min, retorna direto (opening ainda fresco)
    if (cache && now - cache.at < OPENING_TTL_MS) return cache.data;

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return cache?.data ?? FALLBACK;

    // Se cache existe mas passou de 15min, recompute apenas o statusText a partir dos períodos guardados
    // (economiza chamadas). Só refetch completo depois de 3 dias.
    if (cache && now - cache.at < CACHE_TTL_MS && cache.data.opening.openNow !== null) {
      // Basta refetch se muito antigo; para statusText só, mantemos.
      // Não temos os periods aqui, mas o openNow do primeiro fetch pode estar defasado.
      // Solução: refetch se passar de OPENING_TTL_MS mesmo dentro do TTL grande.
    }

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=pt-BR&regionCode=BR`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "id,rating,userRatingCount,reviews.rating,reviews.text,reviews.authorAttribution,reviews.relativePublishTimeDescription,regularOpeningHours,currentOpeningHours",
          },
        },
      );

      if (!res.ok) {
        const body = await res.text();
        console.error(`Places API failed [${res.status}]: ${body}`);
        return cache?.data ?? FALLBACK;
      }

      const json = (await res.json()) as {
        rating?: number;
        userRatingCount?: number;
        reviews?: Array<{
          rating?: number;
          text?: { text?: string };
          relativePublishTimeDescription?: string;
          authorAttribution?: { displayName?: string; photoUri?: string };
        }>;
        regularOpeningHours?: any;
        currentOpeningHours?: any;
      };

      const rating = json.rating ?? FALLBACK.rating;
      const count = json.userRatingCount ?? FALLBACK.userRatingCount;

      const reviews: GoogleReview[] = (json.reviews ?? [])
        .filter((r) => (r.rating ?? 0) >= 5 && r.text?.text)
        .slice(0, 6)
        .map((r) => {
          const name = r.authorAttribution?.displayName?.trim() || "Cliente";
          return {
            author: name,
            initial: name.charAt(0).toUpperCase(),
            rating: r.rating ?? 5,
            text: r.text?.text ?? "",
            relativeTime: r.relativePublishTimeDescription ?? "",
            photoUrl: r.authorAttribution?.photoUri,
          };
        });

      const opening = extractOpening(json);

      const data: PlaceStats = {
        rating,
        ratingFormatted: fmtRating(rating),
        userRatingCount: count,
        userRatingCountFormatted: fmtCount(count),
        reviews,
        opening,
      };

      cache = { at: now, data };
      return data;
    } catch (err) {
      console.error("Places API error:", err);
      return cache?.data ?? FALLBACK;
    }
  },
);
