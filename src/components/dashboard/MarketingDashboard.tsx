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
import { exportMarketingReportPdf } from "@/lib/dashboard/export-report";

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

  const fetchData = useCallback(async (
    override?: { from: string; to: string } | { preset: "maximum" },
  ) => {
    const dates = override || calculateDates(period, customRange);
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
      const params = new URLSearchParams({ _ts: Date.now().toString() });

      if ("preset" in dates) {
        params.set("preset", dates.preset);
      } else {
        params.set("from", dates.from);
        params.set("to", dates.to);
      }

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
      return;
    }

    const dates = calculateDates("custom", customRange);
    if (dates && !("preset" in dates)) {
      void fetchData(dates);
    }
  };

  const filtered = useMemo(() => {
    if (!data?.success) return null;
    if (campaign === "all") return data.totals;
    const c = data.campaigns.find((item: any) => item.campaign_id === campaign);
    return c || { spend: 0, conversations: 0, impressions: 0, link_clicks: 0, leads: 0, link_ctr: 0, link_cpc: 0, cpl: 0 };
  }, [data, campaign]);

  const selectedCampaignName =
    campaign === "all"
      ? "Todas as campanhas"
      : data?.campaigns?.find((item: any) => item.campaign_id === campaign)
          ?.campaign_name || "Campanha selecionada";

  const comparison =
    campaign === "all" ? data?.comparison : null;

  const periodText =
    data?.period?.mode === "maximum" || period === "maximum"
      ? "Tempo máximo"
      : data?.period?.from && data?.period?.to
        ? formatDashboardPeriod(data.period.from, data.period.to)
        : periodLabels[period] || "Período selecionado";

  const generatedAtText = data?.generated_at
    ? new Date(data.generated_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleExportPdf = () => {
    if (!filtered) {
      toast.error("Ainda não há dados para exportar.");
      return;
    }

    try {
      exportMarketingReportPdf({
        periodLabel: periodText,
        campaignName: selectedCampaignName,
        generatedAt: new Date().toISOString(),
        spend: filtered.spend || 0,
        conversations: filtered.conversations || 0,
        impressions: filtered.impressions || 0,
        linkClicks: filtered.link_clicks || 0,
        leads: filtered.leads || 0,
        comparison,
      });
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error(
        "Não foi possível abrir o relatório. Verifique se o navegador está bloqueando pop-ups.",
      );
    }
  };

  if (loading && !data) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto" />
        <p className="text-slate-600 font-medium">Carregando dados da Meta...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-12">
      <DashboardHeader
        loading={loading}
        onRefresh={fetchData}
        onExport={handleExportPdf}
        exportDisabled={!filtered}
      />

      <PlatformSelector active={platform} onChange={setPlatform} />

      <main className="mx-auto max-w-7xl space-y-5 px-3 pt-4 sm:px-4 md:space-y-8 md:pt-6">
        {platform === "google" ? (
          <GoogleAdsEmpty />
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-sm">
              <div className="p-4 sm:p-5 md:flex md:items-center md:justify-between md:gap-6 md:p-7">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-green md:text-xs">
                    Visão geral
                  </p>
                  <h1 className="mt-1 text-xl font-bold leading-tight text-slate-900 sm:text-2xl md:text-3xl">
                    Resultado dos anúncios
                  </h1>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {periodText}
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="break-words">{selectedCampaignName}</span>
                  </p>
                </div>

                <div className="mt-3 md:mt-0 md:shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs ${
                      loading
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {loading
                      ? "Atualizando dados..."
                      : generatedAtText
                        ? `Atualizado em ${generatedAtText}`
                        : "Dados atualizados"}
                  </span>
                </div>
              </div>

              {filtered && (
                <>
                  <div className="grid grid-cols-2 gap-px bg-white/15 text-white md:hidden">
                    <div className="col-span-2 bg-brand-green-teal px-4 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/65">
                        Investimento
                      </p>
                      <p className="mt-1 text-2xl font-bold leading-none">
                        {formatCurrency(filtered.spend)}
                      </p>
                    </div>

                    <div className="bg-brand-green-teal px-4 py-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/65">
                        Conversas
                      </p>
                      <p className="mt-1 text-xl font-bold leading-none">
                        {filtered.conversations.toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <div className="bg-brand-green-teal px-4 py-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/65">
                        Custo / conversa
                      </p>
                      <p className="mt-1 text-xl font-bold leading-none">
                        {formatCurrency(
                          filtered.conversations > 0
                            ? filtered.spend / filtered.conversations
                            : 0,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="hidden border-t border-brand-green/10 bg-brand-green-teal px-7 py-5 text-white md:block">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                      Resumo em uma frase
                    </p>
                    <p className="mt-1 text-xl font-semibold leading-snug">
                      {filtered.conversations > 0 ? (
                        <>
                          Com {formatCurrency(filtered.spend)} investidos, os anúncios iniciaram{" "}
                          <strong>{filtered.conversations.toLocaleString("pt-BR")} conversas</strong>,
                          com custo médio de{" "}
                          <strong>
                            {formatCurrency(filtered.spend / filtered.conversations)}
                          </strong>{" "}
                          por conversa.
                        </>
                      ) : (
                        <>
                          Foram investidos {formatCurrency(filtered.spend)} neste período e a Meta não
                          atribuiu novas conversas aos anúncios selecionados.
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
            </section>

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
                <section>
                  <div className="mb-3">
                    <h2 className="text-base font-bold text-brand-green-teal sm:text-lg">
                      Números principais
                    </h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      Os três números mais importantes para acompanhar a campanha.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
                    <div>
                      <KPICard
                        title="Investimento"
                        value={formatCurrency(filtered.spend)}
                        desc="Quanto foi investido em anúncios no período."
                        trendValue={comparison?.spend?.change_percent}
                        trendPreference="neutral"
                      />
                    </div>

                    <div>
                      <KPICard
                        title="Conversas iniciadas"
                        value={filtered.conversations.toLocaleString("pt-BR")}
                        desc="Novas conversas atribuídas pela Meta aos anúncios."
                        variant="green"
                        trendValue={comparison?.conversations?.change_percent}
                        trendPreference="up"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-1">
                      <KPICard
                        title="Custo por conversa"
                        value={formatCurrency(
                          filtered.conversations > 0
                            ? filtered.spend / filtered.conversations
                            : 0,
                        )}
                        desc="Quanto, em média, foi investido para iniciar cada conversa."
                        trendValue={comparison?.cost_per_conversation?.change_percent}
                        trendPreference="down"
                      />
                    </div>
                  </div>
                </section>

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

                <p className="px-2 pb-2 text-center text-[10px] leading-relaxed text-slate-400 sm:text-[11px] md:text-xs">
                  Dados consultados diretamente da Meta Ads. Conversas e conversões seguem
                  a atribuição informada pela própria plataforma.
                </p>
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
  maximum: "Tempo máximo",
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
    case 'maximum':
      return { preset: "maximum" as const };
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


function formatDashboardPeriod(from: string, to: string) {
  const parseLocalDate = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const start = parseLocalDate(from);
  const end = parseLocalDate(to);

  if (from === to) {
    return start.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return `${start.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })} – ${end.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}
