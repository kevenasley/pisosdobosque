import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type TrendPreference = "up" | "down" | "neutral";

type KPICardProps = {
  title: string;
  value: string;
  desc: string;
  variant?: "default" | "green";
  trendValue?: number | null;
  trendPreference?: TrendPreference;
};

export function KPICard({
  title,
  value,
  desc,
  variant = "default",
  trendValue,
  trendPreference = "neutral",
}: KPICardProps) {
  const hasTrend =
    typeof trendValue === "number" && Number.isFinite(trendValue);

  const direction = hasTrend
    ? trendValue > 0
      ? "up"
      : trendValue < 0
        ? "down"
        : "flat"
    : "flat";

  const isPositive =
    trendPreference === "neutral"
      ? null
      : trendPreference === "up"
        ? direction === "up"
        : direction === "down";

  const TrendIcon =
    direction === "up"
      ? ArrowUpRight
      : direction === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <Card
      className={cn(
        "h-full rounded-2xl border-brand-green/10 shadow-sm",
        variant === "green" &&
          "border-brand-green-teal/20 bg-brand-green-teal/5",
      )}
    >
      <CardContent className="p-4 sm:p-5 md:p-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground md:text-xs">
          {title}
        </p>

        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <h3
            className={cn(
              "text-[1.65rem] font-bold leading-none sm:text-3xl",
              variant === "green"
                ? "text-brand-green-teal"
                : "text-slate-800",
            )}
          >
            {value}
          </h3>

          {hasTrend && (
            <span
              className={cn(
                "mb-0.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold md:text-xs",
                isPositive === true && "bg-emerald-50 text-emerald-700",
                isPositive === false && "bg-rose-50 text-rose-700",
                isPositive === null && "bg-slate-100 text-slate-600",
              )}
              title="Comparação com o período anterior equivalente"
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {Math.abs(trendValue).toLocaleString("pt-BR", {
                maximumFractionDigits: 1,
              })}
              %
            </span>
          )}
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs md:text-sm">
          {desc}
        </p>

        {hasTrend && (
          <p className="mt-2 text-[10px] text-slate-400 md:text-xs">
            Comparado ao período anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}
