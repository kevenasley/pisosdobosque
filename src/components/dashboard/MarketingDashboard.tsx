import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, LogOut, Info, ArrowDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, subMonths, endOfMonth, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export function MarketingDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [campaign, setCampaign] = useState("all");
  const [period, setPeriod] = useState("last_7_days");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value) + "%";
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dates = calculateDates(period, customRange);
      if (!dates) return;
      const res = await callMetaApi(`/api/meta/dashboard?from=${dates.from}&to=${dates.to}`);
      setData(res);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados do Meta Ads");
    } finally {
      setLoading(false);
    }
  }, [period, customRange]);

  useEffect(() => {
    if (period !== "custom") {
      fetchData();
    }
  }, [period, fetchData]);

  const callMetaApi = useCallback(async (endpoint: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/painel/login" }); throw new Error("No session"); }
    const response = await fetch(endpoint, { headers: { "Authorization": `Bearer ${session.access_token}` } });
    if (response.status === 401) { navigate({ to: "/painel/login" }); throw new Error("Unauthorized"); }
    return await response.json();
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!data?.success) return null;
    if (campaign === "all") return data.totals;
    const c = data.campaigns.find((item: any) => item.campaign_id === campaign);
    return c || { spend: 0, conversations: 0, impressions: 0, link_clicks: 0, leads: 0, link_ctr: 0, link_cpc: 0, cpl: 0 };
  }, [data, campaign]);

  if (loading && !data) return <div className="p-12 text-center">Carregando dados da Meta...</div>;

  return (
    <div className="min-h-screen bg-brand-cream pb-12">
      <header className="bg-white border-b border-brand-green/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <img src="/logo-pisos-do-bosque.webp" alt="Logo" className="h-10" />
          <div className="flex gap-4">
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Atualizar
            </Button>
            <Button variant="ghost" onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/painel/login" }))}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-brand-green/5">
          <div className="w-full md:w-64">
            <Label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Campanha</Label>
            <Select onValueChange={setCampaign} value={campaign}>
              <SelectTrigger><SelectValue placeholder="Todas as campanhas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as campanhas</SelectItem>
                {data?.campaigns?.map((c: any) => (
                  <SelectItem key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <Label className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Período</Label>
            <Select onValueChange={setPeriod} value={period}>
              <SelectTrigger>
                <SelectValue>
                  {period === "custom" && customRange?.from ? (
                    customRange.to && customRange.from.getTime() !== customRange.to.getTime() ? (
                      `${format(customRange.from, "dd MMM", { locale: ptBR })} – ${format(customRange.to, "dd MMM yyyy", { locale: ptBR })}`
                    ) : (
                      format(customRange.from, "dd MMM yyyy", { locale: ptBR })
                    )
                  ) : (
                    periodLabels[period] || "Selecione o período"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(periodLabels).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {period === "custom" && (
            <div className="w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Calendário Personalizado</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customRange?.from}
                    selected={customRange}
                    onSelect={setCustomRange}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                  <div className="p-3 border-t flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setCustomRange(undefined); setPeriod("last_7_days"); }}>Limpar</Button>
                    <Button size="sm" onClick={fetchData} disabled={!customRange?.from}>Aplicar</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {filtered && (
          <>
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard 
                title="Investimento" 
                value={formatCurrency(filtered.spend)} 
                desc="Total investido em anúncios no período." 
              />
              <KPICard 
                title="Novas conversas" 
                value={filtered.conversations.toString()} 
                desc="Pessoas que iniciaram uma conversa pelos anúncios." 
                variant="green"
              />
              <KPICard 
                title="Custo por conversa" 
                value={formatCurrency(filtered.conversations > 0 ? filtered.spend / filtered.conversations : 0)} 
                desc="Valor médio para gerar uma nova conversa." 
              />
            </div>

            {/* Jornada dos Anúncios */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-brand-green/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-brand-green-teal">Jornada dos anúncios</h3>
                <div className="text-sm text-muted-foreground bg-brand-cream px-3 py-1 rounded-full">
                  Caminho do cliente
                </div>
              </div>

              <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6">
                {/* Exibições */}
                <div className="w-full md:w-80 text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Exibições</p>
                  <p className="text-3xl font-bold mb-1">{filtered.impressions.toLocaleString("pt-BR")}</p>
                  <p className="text-sm text-slate-500 italic">"Quantas vezes os anúncios apareceram"</p>
                </div>

                <ArrowDown className="h-6 w-6 text-brand-green/40" />

                {/* Cliques */}
                <div className="w-full md:w-80 text-center p-6 bg-brand-green/5 rounded-lg border border-brand-green/10 relative">
                  <p className="text-xs font-bold uppercase text-brand-green mb-1">Cliques no link</p>
                  <p className="text-3xl font-bold mb-1 text-brand-green-teal">{filtered.link_clicks.toLocaleString("pt-BR")}</p>
                  <p className="text-sm text-brand-green/70 italic">"Quantas pessoas demonstraram interesse e clicaram"</p>
                  
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full hidden md:block text-left">
                    <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-xs font-bold border border-brand-orange/20 whitespace-nowrap">
                      {formatPercent(filtered.impressions > 0 ? (filtered.link_clicks / filtered.impressions) * 100 : 0)} geraram clique
                    </div>
                  </div>
                </div>

                {/* Mobile conversion rate for clicks */}
                <div className="md:hidden bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-xs font-bold border border-brand-orange/20">
                  {formatPercent(filtered.impressions > 0 ? (filtered.link_clicks / filtered.impressions) * 100 : 0)} geraram clique
                </div>

                {/* Bifurcação */}
                <div className="w-full flex flex-col md:flex-row items-stretch gap-6 md:pt-4">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="h-8 w-px bg-brand-green/20 hidden md:block mb-2"></div>
                    <div className="w-full p-6 bg-brand-green-teal/5 rounded-lg border border-brand-green-teal/20 text-center relative">
                      <p className="text-xs font-bold uppercase text-brand-green-teal mb-1">Novas conversas</p>
                      <p className="text-3xl font-bold mb-1 text-brand-green-teal">{filtered.conversations.toLocaleString("pt-BR")}</p>
                      <p className="text-sm text-brand-green-teal/70 italic">"Pessoas que iniciaram uma conversa"</p>
                      <div className="mt-2 text-xs font-medium text-brand-green-teal/60">
                        {formatPercent(filtered.link_clicks > 0 ? (filtered.conversations / filtered.link_clicks) * 100 : 0)} dos cliques resultaram em conversa
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <div className="h-8 w-px bg-brand-green/20 hidden md:block mb-2"></div>
                    <div className="w-full p-6 bg-brand-orange/5 rounded-lg border border-brand-orange/20 text-center relative">
                      <p className="text-xs font-bold uppercase text-brand-orange mb-1">Leads no site</p>
                      <p className="text-3xl font-bold mb-1 text-brand-orange">{filtered.leads.toLocaleString("pt-BR")}</p>
                      <p className="text-sm text-brand-orange/70 italic">"Conversões de lead registradas no site"</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Resultados no site */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Resultados no site</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Leads do site são diferentes de pessoas que iniciaram uma conversa.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KPICard 
                  title="Leads registrados no site" 
                  value={filtered.leads.toString()} 
                  desc="Conversões de lead registradas no site e atribuídas aos anúncios pela Meta." 
                />
                <KPICard 
                  title="Custo por lead" 
                  value={formatCurrency(filtered.leads > 0 ? filtered.spend / filtered.leads : 0)} 
                  desc="Valor médio investido para cada lead registrado no site." 
                />
              </div>
            </section>
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

function KPICard({ title, value, desc, variant = "default" }: { title: string; value: string; desc: string; variant?: "default" | "green" }) {
  return (
    <Card className={cn("shadow-none border-brand-green/10", variant === "green" && "bg-brand-green-teal/5 border-brand-green-teal/20")}>
      <CardContent className="p-6">
        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">{title}</p>
        <h3 className={cn("text-3xl font-bold mb-2", variant === "green" ? "text-brand-green-teal" : "text-slate-800")}>{value}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
