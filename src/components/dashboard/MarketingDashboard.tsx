import { useState, useEffect } from "react";
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

// Mock data for initial visual audit
const mockDailyData = [
  { date: "2026-08-09", spend: 120.50, leads: 4, impressions: 5200, clicks: 120 },
  { date: "2026-08-10", spend: 150.20, leads: 6, impressions: 6100, clicks: 145 },
  { date: "2026-08-11", spend: 135.00, leads: 3, impressions: 5800, clicks: 110 },
  { date: "2026-08-12", spend: 180.75, leads: 8, impressions: 7200, clicks: 190 },
  { date: "2026-08-13", spend: 210.00, leads: 10, impressions: 8500, clicks: 230 },
  { date: "2026-08-14", spend: 195.50, leads: 7, impressions: 7900, clicks: 210 },
  { date: "2026-08-15", spend: 225.00, leads: 12, impressions: 9200, clicks: 260 },
].map(d => ({
  ...d,
  cpl: d.leads > 0 ? d.spend / d.leads : 0,
  ctr: (d.clicks / d.impressions) * 100
}));

const mockCampaigns = [
  { name: "Conversão - Pisos Cerâmicos", spend: 850.40, leads: 28, cpl: 30.37, impressions: 32000, clicks: 850, ctr: 2.65 },
  { name: "Tráfego - Showroom", spend: 420.10, leads: 12, cpl: 35.00, impressions: 18500, clicks: 620, ctr: 3.35 },
  { name: "Remarketing - Visitantes Site", spend: 150.00, leads: 8, cpl: 18.75, impressions: 4200, clicks: 180, ctr: 4.28 },
];

export function MarketingDashboard() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>("15/08/2026 06:15");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/painel/login" });
  };

  const handleSync = async () => {
    setSyncing(true);
    // This will call the Edge Function in the future
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleString("pt-BR"));
      toast.success("Dados sincronizados com sucesso!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans pb-12">
      {/* Header Administrativo */}
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
              <p className="text-xs font-medium text-brand-green-teal">{lastSync}</p>
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
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-green-teal">Visão Geral</h2>
            <p className="text-muted-foreground">Desempenho dos anúncios no Meta Ads</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-brand-green/10 shadow-sm w-fit">
            <Button variant="ghost" size="sm" className="bg-brand-orange/10 text-brand-orange font-medium">Últimos 7 dias</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">30 dias</Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><Calendar className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="Investimento" 
            value="R$ 1.236,20" 
            trend="+8,2%" 
            isPositive={false} 
            icon={<DollarSign className="h-5 w-5" />} 
          />
          <KPICard 
            title="Leads" 
            value="48" 
            trend="+12,5%" 
            isPositive={true} 
            icon={<Users className="h-5 w-5" />} 
          />
          <KPICard 
            title="Custo por Lead" 
            value="R$ 25,75" 
            trend="-14,2%" 
            isPositive={true} 
            icon={<BarChart3 className="h-5 w-5" />} 
          />
          <KPICard 
            title="Cliques" 
            value="1.355" 
            trend="+5,1%" 
            isPositive={true} 
            icon={<MousePointer2 className="h-5 w-5" />} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-elegant overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-brand-green-teal">Evolução dos Resultados</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockDailyData}>
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
                <LineChart data={mockDailyData}>
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

        {/* Campaigns Table */}
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
                    <th className="px-6 py-4 text-right">CPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-green/5">
                  {mockCampaigns.map((camp, i) => (
                    <tr key={i} className="hover:bg-brand-cream/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-green-teal">{camp.name}</td>
                      <td className="px-6 py-4 text-right">R$ {camp.spend.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td className="px-6 py-4 text-right font-semibold">{camp.leads}</td>
                      <td className="px-6 py-4 text-right font-medium">R$ {camp.cpl.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{camp.ctr}%</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">R$ {(camp.spend/camp.clicks).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
