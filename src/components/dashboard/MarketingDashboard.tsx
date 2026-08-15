import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer2, 
  DollarSign, 
  RefreshCw,
  LogOut,
  Calendar,
  ChevronDown
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line
} from "recharts";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MarketingDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      const to = new Date();
      const res = await callMetaApi(`/api/meta/dashboard?from=${from.toISOString().split('T')[0]}&to=${to.toISOString().split('T')[0]}`);
      setData(res);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados do Meta Ads");
    } finally {
      setLoading(false);
    }
  };

  const callMetaApi = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: "/painel/login" });
      throw new Error("No session");
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      navigate({ to: "/painel/login" });
      throw new Error("Unauthorized");
    }

    return await response.json();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/painel/login" });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream font-sans pb-12">
      <header className="bg-white border-b border-brand-green/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-pisos-do-bosque.webp" alt="Logo" className="h-8" />
            <h1 className="text-lg font-bold text-brand-green-teal">Painel de Marketing</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-muted-foreground">Última consulta</p>
              <p className="text-xs font-bold text-brand-green-teal">{new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
            <Button onClick={fetchData} size="sm" className="bg-brand-orange hover:bg-brand-orange/90">
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar agora
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        {!data?.success ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-elegant border border-red-100">
            <h3 className="text-lg font-bold text-red-600">Não foi possível carregar os dados.</h3>
            <Button onClick={fetchData} variant="outline" className="mt-4">Tentar novamente</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard title="Investimento" value={`R$ ${data.totals.spend.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} trend="Neutral" />
              <KPICard title="Conversas" value={data.totals.conversations.toString()} trend="Up" />
              <KPICard title="Custo por Conversa" value={`R$ ${data.totals.cost_per_conversation?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}`} trend="Down" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard title="Impressões" value={data.totals.impressions.toLocaleString('pt-BR')} trend="Neutral" />
              <KPICard title="Cliques no link" value={data.totals.link_clicks.toLocaleString('pt-BR')} trend="Up" />
              <KPICard title="CTR" value={`${data.totals.link_ctr?.toFixed(1) || '0'}%`} trend="Up" />
              <KPICard title="CPC" value={`R$ ${data.totals.link_cpc?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}`} trend="Down" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KPICard title="Leads" value={data.totals.leads.toString()} trend="Up" />
              <KPICard title="CPL" value={`R$ ${data.totals.cpl?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}`} trend="Down" />
            </div>

            <Card className="p-6">
              <CardTitle className="mb-6">Investimento x Conversas</CardTitle>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="spend" fill="#FF6400" name="Investimento" />
                    <Bar yAxisId="right" dataKey="conversations" fill="#6EC046" name="Conversas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <CardTitle className="mb-4">Desempenho por campanha</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Conversas</TableHead>
                    <TableHead>Custo/Conv</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.campaigns.map((c: any) => (
                    <TableRow key={c.campaign_id}>
                      <TableCell>{c.campaign_name}</TableCell>
                      <TableCell>R$ {c.spend.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{c.conversations}</TableCell>
                      <TableCell>R$ {c.cost_per_conversation?.toLocaleString('pt-BR') || '0'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Accordion type="single" collapsible>
              <AccordionItem value="daily">
                <AccordionTrigger>Detalhamento diário</AccordionTrigger>
                <AccordionContent>
                  <pre className="text-[10px] overflow-auto">{JSON.stringify(data.daily, null, 2)}</pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </main>
    </div>
  );
}

function KPICard({ title, value, trend }: { title: string; value: string; trend: 'Up' | 'Down' | 'Neutral' }) {
  return (
    <Card className="p-4 shadow-elegant border-brand-green/10">
      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">{title}</p>
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-bold text-brand-green-teal">{value}</h3>
        {trend !== 'Neutral' && (
          <div className={trend === 'Up' ? 'text-green-600' : 'text-red-600'}>
            {trend === 'Up' ? <TrendingUp className="h-4" /> : <TrendingDown className="h-4" />}
          </div>
        )}
      </div>
    </Card>
  );
}