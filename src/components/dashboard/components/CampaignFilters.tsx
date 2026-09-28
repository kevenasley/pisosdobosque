import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { SlidersHorizontal } from "lucide-react";

export function CampaignFilters({
  campaign,
  setCampaign,
  period,
  setPeriod,
  data,
  customRange,
  setCustomRange,
  periodLabels,
  onApplyCustom,
}: any) {
  return (
    <section className="rounded-2xl border border-brand-green/10 bg-white p-3.5 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-teal/10 text-brand-green-teal">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Filtros</h2>
          <p className="text-[11px] text-slate-500">Escolha a campanha e o período.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:items-end md:gap-4">
        <div className="w-full md:w-72">
          <Label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">
            Campanha
          </Label>
          <Select onValueChange={setCampaign} value={campaign}>
            <SelectTrigger className="h-11 w-full rounded-xl text-sm">
              <SelectValue placeholder="Todas as campanhas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as campanhas</SelectItem>
              {data?.campaigns?.map((c: any) => (
                <SelectItem key={c.campaign_id} value={c.campaign_id}>
                  {c.campaign_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">
            Período
          </Label>
          <Select onValueChange={setPeriod} value={period}>
            <SelectTrigger className="h-11 w-full rounded-xl text-sm">
              <SelectValue>
                {period === "custom" && customRange?.from ? (
                  customRange.to &&
                  customRange.from.getTime() !== customRange.to.getTime() ? (
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
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {period === "custom" && (
          <div className="w-full sm:col-span-2 md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-11 w-full rounded-xl md:w-auto">
                  Calendário personalizado
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(100vw-1.5rem)] max-w-sm p-0 sm:w-auto"
                align="start"
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customRange?.from}
                  selected={customRange}
                  onSelect={setCustomRange}
                  numberOfMonths={1}
                  locale={ptBR}
                />
                <div className="flex justify-end gap-2 border-t p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApplyCustom(true)}
                  >
                    Limpar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onApplyCustom(false)}
                    disabled={!customRange?.from}
                  >
                    Aplicar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </section>
  );
}
