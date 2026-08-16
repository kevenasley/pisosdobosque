import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { format, startOfMonth, subMonths, endOfMonth, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";

// Components
import { DashboardHeader } from "./components/DashboardHeader";
import { PlatformSelector } from "./components/PlatformSelector";
import { CampaignFilters } from "./components/CampaignFilters";
import { KPICard } from "./components/KPICard";
import { AdJourney } from "./components/AdJourney";
import { SecondaryMetrics } from "./components/SecondaryMetrics";
import { GoogleAdsEmpty } from "./components/GoogleAdsEmpty";

export function MarketingDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [campaign, setCampaign] = useState("all");
  const [period, setPeriod] = useState("last_7_days");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [platform, setPlatform] = useState<"meta" | "google">("meta");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dates = calculateDates(period, customRange);
      if (!dates) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/painel/login" });
        return;
      }

      const response = await fetch(`/api/meta/dashboard?from=${dates.from}&to=${dates.to}`, {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });

      if (response.status === 401) {
        navigate({ to: "/painel/login" });
        return;
      }

      const res = await response.json();
      setData(res);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados do Meta Ads");
    } finally {
      setLoading(false);
    }
  }, [period, customRange, navigate]);

  useEffect(() => {
    if (period !== "custom") {
      fetchData();
    }
  }, [period, fetchData]);

  const onApplyCustom = (clear: boolean) => {
    if (clear) {
      setCustomRange(undefined);
      setPeriod("last_7_days");
    } else {
      fetchData();
    }
  };

  const filtered = useMemo(() => {
    if (!data?.success) return null;
    if (campaign === "all") return data.totals;
    const c = data.campaigns.find((item: any) => item.campaign_id === campaign);
    return c || { spend: 0, conversations: 0, impressions: 0, link_clicks: 0, leads: 0, link_ctr: 0, link_cpc: 0, cpl: 0 };
  }, [data, campaign]);

  if (loading && !data) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto" />
        <p className="text-slate-600 font-medium">Carregando dados da Meta...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-12">
      <DashboardHeader loading={loading} onRefresh={fetchData} />
      
      <PlatformSelector active={platform} onChange={setPlatform} />

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6 md:space-y-8">
        {platform === "google" ? (
          <GoogleAdsEmpty />
        ) : (
          <>
            <CampaignFilters 
              campaign={campaign}
              setCampaign={setCampaign}
              period={period}
              setPeriod={setPeriod}
              data={data}
              customRange={customRange}
              setCustomRange={setCustomRange}
              periodLabels={periodLabels}
              onApplyCustom={onApplyCustom}
            />

            {filtered && (
              <>
                {/* Top KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  <div className="col-span-1">
                    <KPICard 
                      title="Investimento" 
                      value={formatCurrency(filtered.spend)} 
                      desc="Total investido em anúncios." 
                    />
                  </div>
                  <div className="col-span-1">
                    <KPICard 
                      title="Novas conversas" 
                      value={filtered.conversations.toString()} 
                      desc="Contatos iniciados via anúncios." 
                      variant="green"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <KPICard 
                      title="Custo por conversa" 
                      value={formatCurrency(filtered.conversations > 0 ? filtered.spend / filtered.conversations : 0)} 
                      desc="Valor médio para gerar uma conversa." 
                    />
                  </div>
                </div>

                <AdJourney 
                  impressions={filtered.impressions}
                  link_clicks={filtered.link_clicks}
                  conversations={filtered.conversations}
                />

                <SecondaryMetrics 
                  leads={filtered.leads}
                  spend={filtered.spend}
                  formatCurrency={formatCurrency}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const periodLabels: Record<string, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  last_7_days: "Últimos 7 dias",
  last_14_days: "Últimos 14 dias",
  last_30_days: "Últimos 30 dias",
  this_month: "Este mês",
  last_month: "Mês passado",
  custom: "Personalizado",
};

function calculateDates(period: string, customRange?: DateRange) {
  const to = new Date();
  const from = new Date();

  switch (period) {
    case 'today':
      return { from: format(startOfDay(from), 'yyyy-MM-dd'), to: format(endOfDay(to), 'yyyy-MM-dd') };
    case 'yesterday':
      const yesterday = subDays(new Date(), 1);
      return { from: format(startOfDay(yesterday), 'yyyy-MM-dd'), to: format(endOfDay(yesterday), 'yyyy-MM-dd') };
    case 'last_7_days':
      return { from: format(subDays(from, 7), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'last_14_days':
      return { from: format(subDays(from, 14), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'last_30_days':
      return { from: format(subDays(from, 30), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'this_month':
      return { from: format(startOfMonth(from), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'last_month':
      const lastMonth = subMonths(new Date(), 1);
      return { from: format(startOfMonth(lastMonth), 'yyyy-MM-dd'), to: format(endOfMonth(lastMonth), 'yyyy-MM-dd') };
    case 'custom':
      if (customRange?.from) {
        return { 
          from: format(customRange.from, 'yyyy-MM-dd'), 
          to: format(customRange.to || customRange.from, 'yyyy-MM-dd') 
        };
      }
      return null;
    default:
      return { from: format(subDays(from, 7), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
  }
}
