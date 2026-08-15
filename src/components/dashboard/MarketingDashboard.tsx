import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer2, 
  Eye, 
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
  Line,
  Legend
} from "recharts";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

// Visual logic uses API data now. Mock constants removed.

export function MarketingDashboard() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/painel/login" });
        return;
      }

      const { data, error } = await supabase.rpc("get_meta_dashboard_data");
      
      if (error) {
        if (error.code === 'PGRST301' || error.message.includes('authorized')) {
          navigate({ to: "/painel/login" });
          return;
        }
        throw error;
      }

      const dashboardData = data as any;
      setDailyData(dashboardData.dailyStats || []);
      if (dashboardData.lastSync) {
        setLastSync(new Date(dashboardData.lastSync).toLocaleString("pt-BR"));
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Falha ao carregar dados do painel");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper to call authenticated Cloudflare Pages Functions
   * Use this for future integrations with /api/meta/*
   */
  const callMetaApi = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
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
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/painel/login" });
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.rpc("sync_meta_ads_rpc");

      if (error) {
        toast.error(error.message || "Erro na sincronização");
      } else {
        const result = data as any;
        if (result.code === "CONFIG_MISSING") {
          toast.error("Meta Ads ainda não configurado no backend");
        } else {
          toast.success("Sincronização iniciada com sucesso!");
          fetchDashboardData();
        }
      }
    } catch (error) {
      toast.error("Erro de conexão");
    } finally {
      setSyncing(false);
    }
  };

  const totals = useMemo(() => {
    return dailyData.reduce((acc, curr) => ({
      spend: acc.spend + (Number(curr.spend) || 0),
      leads: acc.leads + (Number(curr.leads) || 0),
      clicks: acc.clicks + (Number(curr.clicks) || 0),
    }), { spend: 0, leads: 0, clicks: 0 });
  }, [dailyData]);

  const cpl = totals.leads > 0 ? totals.spend / totals.leads : 0;

  const chartData = useMemo(() => {
    return dailyData.map(d => ({
      ...d,
      spend: Number(d.spend),
      leads: Number(d.leads),
      cpl: Number(d.leads) > 0 ? Number(d.spend) / Number(d.leads) : 0
    }));
  }, [dailyData]);

  const campaigns = useMemo(() => {
    const groups: Record<string, any> = {};
    dailyData.forEach(d => {
      if (!groups[d.campaign_name]) {
        groups[d.campaign_name] = { name: d.campaign_name, spend: 0, leads: 0, clicks: 0, impressions: 0 };
      }
      groups[d.campaign_name].spend += Number(d.spend) || 0;
      groups[d.campaign_name].leads += Number(d.leads) || 0;
      groups[d.campaign_name].clicks += Number(d.clicks) || 0;
      groups[d.campaign_name].impressions += Number(d.impressions) || 0;
    });
    return Object.values(groups).map(c => ({
      ...c,
      cpl: c.leads > 0 ? c.spend / c.leads : 0,
      ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0
    }));
  }, [dailyData]);

  return (
    <div className="min-h-screen bg-brand-cream font-sans pb-12">
      <header className="bg-white border-b border-brand-green/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-pisos-do-bosque.webp" alt="Logo" className="h-10 w-auto" />
            <div className="h-6 w-px bg-brand-green/20 hidden sm:block" />
            <h1 className="text-lg font-bold text-brand-green-teal hidden sm:block">Painel de Marketing</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Última atualização</p>
              <p className="text-xs font-medium text-brand-green-teal">{lastSync || "Nunca"}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSync}
              disabled={syncing}
              className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar Agora</span>
              <span className="sm:hidden">Atualizar</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-green-teal">Visão Geral</h2>
            <p className="text-muted-foreground">Desempenho dos anúncios no Meta Ads</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-brand-green/10 shadow-sm w-fit">
            <Button variant="ghost" size="sm" className="bg-brand-orange/10 text-brand-orange font-medium">Período Selecionado</Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><Calendar className="h-4 w-4" /></Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-brand-green-teal">
            <RefreshCw className="h-8 w-8 animate-spin mr-2" /> Carregando dados reais...
          </div>
        ) : dailyData.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-elegant border border-brand-green/10">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-green-teal">Nenhum dado encontrado</h3>
            <p className="text-muted-foreground">Clique em "Atualizar Agora" para sincronizar com o Meta Ads.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard 
                title="Investimento" 
                value={`R$ ${totals.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                trend="Real" 
                isPositive={true} 
                icon={<DollarSign className="h-5 w-5" />} 
              />
              <KPICard 
                title="Leads" 
                value={totals.leads.toString()} 
                trend="Real" 
                isPositive={true} 
                icon={<Users className="h-5 w-5" />} 
              />
              <KPICard 
                title="Custo por Lead" 
                value={`R$ ${cpl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                trend="Real" 
                isPositive={true} 
                icon={<BarChart3 className="h-5 w-5" />} 
              />
              <KPICard 
                title="Cliques" 
                value={totals.clicks.toLocaleString('pt-BR')} 
                trend="Real" 
                isPositive={true} 
                icon={<MousePointer2 className="h-5 w-5" />} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-elegant overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-brand-green-teal">Evolução dos Resultados</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] pt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#888'}}
                        tickFormatter={(str) => str.split('-')[2]}
                      />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        cursor={{fill: '#f8f8f8'}}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px'}} />
                      <Bar yAxisId="left" dataKey="spend" name="Investimento (R$)" fill="#FF6400" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="leads" name="Leads" fill="#6EC046" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-elegant overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-brand-green-teal">Custo por Lead (CPL)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] pt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#888'}}
                        tickFormatter={(str) => str.split('-')[2]}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cpl" 
                        name="CPL (R$)" 
                        stroke="#007065" 
                        strokeWidth={3} 
                        dot={{r: 4, fill: '#007065', strokeWidth: 0}}
                        activeDot={{r: 6, strokeWidth: 0}}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-elegant overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-brand-green-teal">Desempenho por Campanha</CardTitle>
                <Button variant="ghost" size="sm" className="text-brand-orange">Ver todas <ChevronDown className="ml-1 h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-brand-cream/50 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-6 py-4">Campanha</th>
                        <th className="px-6 py-4 text-right">Investimento</th>
                        <th className="px-6 py-4 text-right">Leads</th>
                        <th className="px-6 py-4 text-right">CPL</th>
                        <th className="px-6 py-4 text-right">CTR</th>
                        <th className="px-6 py-4 text-right">Cliques</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5">
                      {campaigns.map((camp, i) => (
                        <tr key={i} className="hover:bg-brand-cream/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-brand-green-teal">{camp.name}</td>
                          <td className="px-6 py-4 text-right">R$ {camp.spend.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                          <td className="px-6 py-4 text-right font-semibold">{camp.leads}</td>
                          <td className="px-6 py-4 text-right font-medium">R$ {camp.cpl.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                          <td className="px-6 py-4 text-right text-muted-foreground">{camp.ctr.toFixed(2)}%</td>
                          <td className="px-6 py-4 text-right text-muted-foreground">{camp.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

function KPICard({ title, value, trend, isPositive, icon }: { 
  title: string; 
  value: string; 
  trend: string; 
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-elegant hover:scale-[1.02] transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-brand-cream rounded-lg text-brand-green-teal">
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-brand-green-teal">{value}</h3>
      </CardContent>
    </Card>
  );
}
