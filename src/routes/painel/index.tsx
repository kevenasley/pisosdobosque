import { createFileRoute } from "@tanstack/react-router";
import { MarketingDashboard } from "@/components/dashboard/MarketingDashboard";

export const Route = createFileRoute("/painel/")({
  component: MarketingDashboard,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { title: "Painel de Marketing | Pisos do Bosque" },
    ],
  }),
});
