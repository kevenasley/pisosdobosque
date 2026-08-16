import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export function CampaignFilters({ 
  campaign, 
  setCampaign, 
  period, 
  setPeriod, 
  data, 
  customRange, 
  setCustomRange, 
  periodLabels,
  onApplyCustom 
}: any) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-brand-green/5">
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
            {Object.entries(periodLabels).map(([val, label]: [any, any]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {period === "custom" && (
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">Calendário Personalizado</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={customRange?.from}
                selected={customRange}
                onSelect={setCustomRange}
                numberOfMonths={1}
                locale={ptBR}
              />
              <div className="p-3 border-t flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onApplyCustom(true)}>Limpar</Button>
                <Button size="sm" onClick={() => onApplyCustom(false)} disabled={!customRange?.from}>Aplicar</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
