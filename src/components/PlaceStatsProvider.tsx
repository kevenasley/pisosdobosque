import { createContext, useContext, type ReactNode } from "react";
import { PLACE_STATS, type PlaceStats } from "@/lib/place-stats";

export type { PlaceStats } from "@/lib/place-stats";

const PlaceStatsContext = createContext<PlaceStats>(PLACE_STATS);

export function PlaceStatsProvider({ children }: { children: ReactNode }) {
  return (
    <PlaceStatsContext.Provider value={PLACE_STATS}>
      {children}
    </PlaceStatsContext.Provider>
  );
}

export function usePlaceStats(): PlaceStats {
  return useContext(PlaceStatsContext);
}
