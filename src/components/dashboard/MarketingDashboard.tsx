import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, LogOut, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

export function MarketingDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [campaign, setCampaign] = useState("all");
  const [period, setPeriod] = useState("last_7_days");
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { from, to } = calculateDates(period);
      const res = await callMetaApi(`/api/meta/dashboard?from=${from}&to=${to}`);
      setData(res);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados do Meta Ads");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const callMetaApi = useCallback(async (endpoint: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate({ to: "/painel/login" }); throw new Error("No session"); }
    const response = await fetch(endpoint, { headers: { "Authorization": `Bearer ${session.access_token}` } });
    if (response.status === 401) { navigate({ to: "/painel/login" }); throw new Error("Unauthorized"); }
    return await response.json();
  }, [navigate]);

  if (loading || !data?.success) return <div className="p-12 text-center">Carregando...</div>;

  const filtered = filterData(data, campaign);

  return (
    <div className="min-h-screen bg-brand-cream pb-12">
      <header className="bg-white border-b border-brand-green/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <img src="/logo-pisos-do-bosque.webp" alt="Logo" className="h-10" />
          <div className="flex gap-4">
            <Button variant="outline" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" /> Atualizar agora</Button>
            <Button variant="ghost" onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/painel/login" }))}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-brand-green/5">
          <div className="w-64">
            <Label className="mb-2 block">Campanha</Label>
            <Select onValueChange={setCampaign} value={campaign}>
              <SelectTrigger><SelectValue placeholder="Todas as campanhas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as campanhas</SelectItem>
                {data.campaigns.map((c: any) => <SelectItem key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-64">
            <Label className="mb-2 block">Período</Label>
            <Select onValueChange={setPeriod} value={period}>
              <SelectTrigger><SelectValue placeholder="Últimos 7 dias" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard title="Investimento" value={`R$ ${filtered.spend.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} desc="Total investido em anúncios no período." />
          <KPICard title="Novas conversas" value={filtered.conversations.toString()} desc="Pessoas que iniciaram uma conversa pelos anúncios." />
          <KPICard title="Custo por conversa" value={`R$ ${(filtered.conversations > 0 ? filtered.spend / filtered.conversations : 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} desc="Valor médio para gerar uma nova conversa." />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-green/5">
          <h3 className="font-bold text-lg mb-2">Resumo do período</h3>
          <p className="text-muted-foreground">Neste período, foram investidos R$ {filtered.spend.toLocaleString('pt-BR', {minimumFractionDigits: 2})} e os anúncios geraram {filtered.conversations} novas conversas, com custo médio de R$ {(filtered.conversations > 0 ? filtered.spend / filtered.conversations : 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})} por conversa.</p>
        </div>

        <section>
          <h3 className="font-bold text-lg mb-4">Visibilidade e interesse</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SmallCard title="Exibições" value={filtered.impressions.toLocaleString()} desc="Quantas vezes os anúncios apareceram." />
            <SmallCard title="Cliques no link" value={filtered.link_clicks.toLocaleString()} desc="Cliques para saber mais." />
            <SmallCard title="Taxa de cliques" value={`${(filtered.link_ctr || 0).toFixed(1)}%`} desc="Percentual de exibições resultando em clique." />
            <SmallCard title="Custo por clique" value={`R$ ${(filtered.link_cpc || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} desc="Valor médio por clique no link." />
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4">Conversões atribuídas pela Meta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KPICard title="Leads do site" value={filtered.leads.toString()} desc="Conversões registradas no site atribuídas pela Meta." />
            <KPICard title="Custo por lead" value={`R$ ${(filtered.cpl || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} desc="Custo médio por lead atribuído." />
          </div>
        </section>
      </main>
    </div>
  );
}

function calculateDates(period: string) {
  const to = new Date();
  const from = new Date();
  if (period === 'last_7_days') from.setDate(from.getDate() - 7);
  else if (period === 'last_30_days') from.setDate(from.getDate() - 30);
  else if (period === 'yesterday') { to.setDate(to.getDate() - 1); from.setDate(from.getDate() - 1); }
  return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
}

function filterData(data: any, campaignId: string) {
  if (campaignId === "all") return data.totals;
  const c = data.campaigns.find((item: any) => item.campaign_id === campaignId);
  return c || { spend: 0, conversations: 0, impressions: 0, link_clicks: 0, leads: 0, link_ctr: 0, link_cpc: 0, cpl: 0 };
}

function KPICard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <Card className="shadow-none border-brand-green/10">
      <CardContent className="p-6">
        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-brand-green-teal mb-2">{value}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function SmallCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <Card className="shadow-none border-brand-green/10">
      <CardContent className="p-4">
        <p className="text-xs uppercase font-bold text-muted-foreground mb-1">{title}</p>
        <h3 className="text-lg font-bold text-brand-green-teal mb-1">{value}</h3>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
