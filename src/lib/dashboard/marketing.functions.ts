import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const getMetaDashboardData = createServerFn({ method: "GET" })
  .inputValidator((data: { dateFrom: string; dateTo: string }) => 
    z.object({ 
      dateFrom: z.string(), 
      dateTo: z.string() 
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const { data: dailyStats, error } = await supabase
      .from("meta_ads_daily")
      .select("*")
      .gte("date", data.dateFrom)
      .lte("date", data.dateTo)
      .order("date", { ascending: true });

    if (error) throw error;

    return {
      dailyStats: dailyStats || [],
      lastSync: new Date().toISOString()
    };
  });

export const syncMetaAds = createServerFn({ method: "POST" })
  .handler(async () => {
    // This will contain the Meta API integration logic
    return { message: "Sincronização iniciada" };
  });
