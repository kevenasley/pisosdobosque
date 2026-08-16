import { createFileRoute, redirect } from "@tanstack/react-router";
import { MarketingDashboard } from "@/components/dashboard/MarketingDashboard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/painel/")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return; // Skip during SSG/SSR
    
    // Check session
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      // Avoid redirecting to login if we are already coming from it in a loop
      // although here we are at /painel/ index.
      throw redirect({
        to: "/painel/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
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
