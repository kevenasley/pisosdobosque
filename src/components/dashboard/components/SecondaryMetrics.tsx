import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { KPICard } from "./KPICard";

export function SecondaryMetrics({ leads, spend, formatCurrency }: { leads: number; spend: number; formatCurrency: (v: number) => string }) {
  const cpl = leads > 0 ? spend / leads : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-lg text-brand-green-teal">Outros resultados atribuídos pela Meta</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3">
              <p className="text-xs">A Meta atribuiu estas conversões aos anúncios neste período. A atribuição da Meta pode ser diferente do total de contatos registrados pela empresa.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard 
          title="CONVERSÕES DE LEAD ATRIBUÍDAS" 
          value={leads.toString()} 
          desc="A Meta atribuiu estas conversões aos anúncios neste período." 
        />
        <KPICard 
          title="CUSTO POR CONVERSÃO" 
          value={formatCurrency(cpl)} 
          desc="Investimento por lead registrado no site." 
        />
      </div>

      {/* Removed "Calculado automaticamente" CTR text as per requirement */}
    </section>
  );
}
