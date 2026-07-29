import { createServerFn } from "@tanstack/react-start";

export type MapsConfig = {
  apiKey: string | null;
  lat: number;
  lng: number;
  placeId: string;
};

const PLACE_ID = "ChIJTyoE7NlzGZURHlAt9IQVcGE";
// Fallback coords: Av. Capitão Garibaldi Pinto dos Santos, 488 - Cachoeirinha/RS
const FALLBACK_LAT = -29.9481;
const FALLBACK_LNG = -51.094;

let cache: { at: number; lat: number; lng: number } | null = null;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export const getMapsConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<MapsConfig> => {
    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      null;

    let lat = FALLBACK_LAT;
    let lng = FALLBACK_LNG;

    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      lat = cache.lat;
      lng = cache.lng;
    } else if (apiKey) {
      try {
        const res = await fetch(
          `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=pt-BR&regionCode=BR`,
          {
            headers: {
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask": "location",
            },
          },
        );
        if (res.ok) {
          const json = (await res.json()) as {
            location?: { latitude?: number; longitude?: number };
          };
          if (json.location?.latitude && json.location?.longitude) {
            lat = json.location.latitude;
            lng = json.location.longitude;
            cache = { at: Date.now(), lat, lng };
          }
        }
      } catch (err) {
        console.error("Maps location fetch error:", err);
      }
    }

    return { apiKey, lat, lng, placeId: PLACE_ID };
  },
);
