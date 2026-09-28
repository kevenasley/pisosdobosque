import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { format, startOfMonth, subMonths, endOfMonth, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

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
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const fetchData = useCallback(async () => {
    const dates = calculateDates(period, customRange);
    if (!dates) {
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);

    try {
      const params = new URLSearchParams({
        from: dates.from,
        to: dates.to,
        _ts: Date.now().toString(),
      });

      const response = await fetch(`/api/meta/dashboard?${params.toString()}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Resposta inesperada do servidor");
      }

      const res = await response.json();
      if (!res?.success) {
        throw new Error(res?.error || "Falha ao consultar Meta Ads");
      }

      if (requestId === requestIdRef.current) {
        setData(res);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados do Meta Ads");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [period, customRange]);

  useEffect(() => {
    if (period !== "custom") {
      void fetchData();
    }
  }, [period, fetchData]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (
      campaign !== "all" &&
      data?.campaigns &&
      !data.campaigns.some((item: any) => item.campaign_id === campaign)
    ) {
      setCampaign("all");
    }
  }, [data, campaign]);

  const onApplyCustom = (clear: boolean) => {
    if (clear) {
      setCustomRange(undefined);
      setPeriod("last_7_days");
    } else {
      void fetchData();
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
      return { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'yesterday': {
      const yesterday = subDays(new Date(), 1);
      const day = format(yesterday, 'yyyy-MM-dd');
      return { from: day, to: day };
    }
    case 'last_7_days':
      return { from: format(subDays(from, 6), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'last_14_days':
      return { from: format(subDays(from, 13), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'last_30_days':
      return { from: format(subDays(from, 29), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'this_month':
      return { from: format(startOfMonth(from), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    case 'last_month': {
      const lastMonth = subMonths(new Date(), 1);
      return { from: format(startOfMonth(lastMonth), 'yyyy-MM-dd'), to: format(endOfMonth(lastMonth), 'yyyy-MM-dd') };
    }
    case 'custom':
      if (customRange?.from) {
        return { 
          from: format(customRange.from, 'yyyy-MM-dd'), 
          to: format(customRange.to || customRange.from, 'yyyy-MM-dd') 
        };
      }
      return null;
    default:
      return { from: format(subDays(from, 6), 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
  }
}
