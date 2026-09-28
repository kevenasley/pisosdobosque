import { GOOGLE_PLACE_STATS } from "./place-stats.generated";

/**
 * Dados do Google Business Profile (avaliações / horários).
 *
 * Rating e quantidade de avaliações vêm de um arquivo gerado automaticamente
 * pela Google Places API uma vez por semana via GitHub Actions.
 */

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
  statusText: string;
  weekdayDescriptions: string[];
};

export type PlaceStats = {
  rating: number;
  ratingFormatted: string;
  userRatingCount: number;
  userRatingCountFormatted: string;
  reviews: GoogleReview[];
  opening: OpeningInfo;
};

export const PLACE_ID = "ChIJTyoE7NlzGZURHlAt9IQVcGE";

export const PLACE_STATS: PlaceStats = {
  rating: GOOGLE_PLACE_STATS.rating,
  ratingFormatted: GOOGLE_PLACE_STATS.rating.toLocaleString("pt-BR"),
  userRatingCount: GOOGLE_PLACE_STATS.userRatingCount,
  userRatingCountFormatted: GOOGLE_PLACE_STATS.userRatingCount.toLocaleString("pt-BR"),
  reviews: [],
  opening: {
    openNow: null,
    statusText: "Seg–Sex 8h–12h e 13h30–18h30 · Sáb 8h–12h e 13h30–17h",
    weekdayDescriptions: [
      "domingo: Fechado",
      "segunda-feira: 08:00–12:00, 13:30–18:30",
      "terça-feira: 08:00–12:00, 13:30–18:30",
      "quarta-feira: 08:00–12:00, 13:30–18:30",
      "quinta-feira: 08:00–12:00, 13:30–18:30",
      "sexta-feira: 08:00–12:00, 13:30–18:30",
      "sábado: 08:00–12:00, 13:30–17:00",
    ],
  },
};
