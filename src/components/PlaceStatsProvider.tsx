import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getGooglePlaceStats,
  type PlaceStats,
} from "@/lib/google-place.functions";

const FALLBACK: PlaceStats = {
  rating: 4.9,
  ratingFormatted: "4.9",
  userRatingCount: 2402,
  userRatingCountFormatted: "2.402",
  reviews: [],
};

const PlaceStatsContext = createContext<PlaceStats>(FALLBACK);

export function PlaceStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<PlaceStats>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    getGooglePlaceStats()
      .then((data) => {
        if (!cancelled && data) setStats(data);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PlaceStatsContext.Provider value={stats}>
      {children}
    </PlaceStatsContext.Provider>
  );
}

export function usePlaceStats(): PlaceStats {
  return useContext(PlaceStatsContext);
}
