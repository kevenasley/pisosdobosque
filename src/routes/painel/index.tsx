import { createFileRoute } from "@tanstack/react-router";
import { MarketingDashboard } from "@/components/dashboard/MarketingDashboard";

export const Route = createFileRoute("/painel/")({
  loader: async ({ context }) => {
    if (typeof window === "undefined") return { dailyStats: [], lastSync: null };
    // We could pre-fetch here if needed
    return {};
  },
  component: MarketingDashboard,

  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { title: "Painel de Marketing | Pisos do Bosque" },
    ],
  }),
});
