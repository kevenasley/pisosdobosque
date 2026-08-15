import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/api/dashboard/get-meta-dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { 
              status: 401, 
              headers: { "Content-Type": "application/json" } 
            });
          }

          const { data: { user }, error: userError } = await supabase.auth.getUser(
            authHeader.replace("Bearer ", "")
          );

          if (userError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { 
              status: 401, 
              headers: { "Content-Type": "application/json" } 
            });
          }

          const url = new URL(request.url);
          const dateFrom = url.searchParams.get("dateFrom");
          const dateTo = url.searchParams.get("dateTo");

          const { data: dailyStats, error: statsError } = await supabase
            .from("meta_ads_daily")
            .select("*")
            .gte("date", dateFrom || "1970-01-01")
            .lte("date", dateTo || "9999-12-31")
            .order("date", { ascending: true });

          if (statsError) throw statsError;

          const { data: syncRuns, error: syncError } = await supabase
            .from("meta_ads_sync_runs")
            .select("started_at")
            .eq("status", "success")
            .order("started_at", { ascending: false })
            .limit(1);

          if (syncError) throw syncError;

          return Response.json({
            dailyStats: dailyStats || [],
            lastSync: syncRuns?.[0]?.started_at || null
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
          });
        }
      }
    }
  }
});
