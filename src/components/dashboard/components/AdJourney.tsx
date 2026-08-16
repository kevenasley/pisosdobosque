import { ArrowDown, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatPercent } from "@/lib/utils"; // We'll make sure this helper exists or pass it

export function AdJourney({ impressions, link_clicks, conversations }: { impressions: number; link_clicks: number; conversations: number }) {
  const isMobile = useIsMobile();

  const ctr = impressions > 0 ? (link_clicks / impressions) * 100 : 0;
  const convRate = link_clicks > 0 ? (conversations / link_clicks) * 100 : 0;

  if (isMobile) {
    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-brand-green/10">
        <h3 className="text-lg font-bold text-brand-green-teal mb-6">Jornada dos anúncios</h3>
        
        <div className="flex flex-col gap-2">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 mt-1" />
              <div className="w-px h-full bg-slate-200 my-1" />
            </div>
            <div className="pb-6">
              <p className="text-[10px] font-bold uppercase text-slate-500">EXIBIÇÕES</p>
              <p className="text-xl font-bold">{impressions.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-slate-500">Anúncios exibidos</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-brand-green mt-1" />
              <div className="w-px h-full bg-brand-green/20 my-1" />
            </div>
            <div className="pb-6">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase text-brand-green">CLIQUES NO LINK</p>
                <span className="text-[10px] font-bold bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full border border-brand-orange/20">
                  {ctr.toFixed(1)}% das exibições
                </span>
              </div>
              <p className="text-xl font-bold text-brand-green-teal">{link_clicks.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-slate-500">Pessoas interessadas</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-brand-green-teal mt-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase text-brand-green-teal">NOVAS CONVERSAS</p>
                <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full border border-brand-green/20">
                  {convRate.toFixed(1)}% dos cliques
                </span>
              </div>
              <p className="text-xl font-bold text-brand-green-teal">{conversations.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-slate-500">Contatos diretos iniciados</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-8 rounded-xl shadow-sm border border-brand-green/10">
      <h3 className="text-xl font-bold text-brand-green-teal mb-8">Jornada dos anúncios</h3>
      
      <div className="flex items-center justify-between max-w-5xl mx-auto gap-4">
        {/* Exibições */}
        <div className="flex-1 text-center p-4">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Exibições</p>
          <p className="text-3xl font-bold">{impressions.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-slate-500 leading-tight">Anúncios exibidos</p>
        </div>

        <ArrowRight className="h-6 w-6 text-brand-green/20 shrink-0" />

        {/* Cliques */}
        <div className="flex-1 text-center p-4 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
            <span className="text-[10px] font-bold bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full border border-brand-orange/20 whitespace-nowrap">
              {ctr.toFixed(1)}% geraram clique
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-brand-green mb-1">Cliques no link</p>
          <p className="text-3xl font-bold text-brand-green-teal">{link_clicks.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-slate-500 leading-tight">Pessoas interessadas</p>
        </div>

        <ArrowRight className="h-6 w-6 text-brand-green/20 shrink-0" />

        {/* Conversas */}
        <div className="flex-1 text-center p-4 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
            <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green px-2 py-1 rounded-full border border-brand-green/20 whitespace-nowrap">
              {convRate.toFixed(1)}% resultaram em conversa
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-brand-green-teal mb-1">Novas conversas</p>
          <p className="text-3xl font-bold text-brand-green-teal">{conversations.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-slate-500 leading-tight">Contatos diretos iniciados</p>
        </div>
      </div>
    </section>
  );
}
