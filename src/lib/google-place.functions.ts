import { createServerFn } from "@tanstack/react-start";

export type GoogleReview = {
  author: string;
  initial: string;
  rating: number;
  text: string;
  relativeTime: string;
  photoUrl?: string;
};

export type PlaceStats = {
  rating: number;
  ratingFormatted: string; // "4.9"
  userRatingCount: number;
  userRatingCountFormatted: string; // "2.402"
  reviews: GoogleReview[];
};

const PLACE_ID = "ChIJTyoE7NlzGZURHlAt9IQVcGE";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

let cache: { at: number; data: PlaceStats } | null = null;

const FALLBACK: PlaceStats = {
  rating: 4.9,
  ratingFormatted: "4.9",
  userRatingCount: 2402,
  userRatingCountFormatted: "2.402",
  reviews: [],
};

function fmtCount(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}

function fmtRating(n: number): string {
  return n.toFixed(1).replace(".", ",").replace(",", "."); // keep dot
}

export const getGooglePlaceStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlaceStats> => {
    const now = Date.now();
    if (cache && now - cache.at < CACHE_TTL_MS) return cache.data;

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return cache?.data ?? FALLBACK;

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=pt-BR&regionCode=BR`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "id,rating,userRatingCount,reviews.rating,reviews.text,reviews.authorAttribution,reviews.relativePublishTimeDescription",
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

      const data: PlaceStats = {
        rating,
        ratingFormatted: fmtRating(rating),
        userRatingCount: count,
        userRatingCountFormatted: fmtCount(count),
        reviews,
      };

      cache = { at: now, data };
      return data;
    } catch (err) {
      console.error("Places API error:", err);
      return cache?.data ?? FALLBACK;
    }
  },
);
