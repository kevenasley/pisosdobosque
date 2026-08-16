import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KPICard({ title, value, desc, variant = "default" }: { title: string; value: string; desc: string; variant?: "default" | "green" }) {
  return (
    <Card className={cn("shadow-sm border-brand-green/10", variant === "green" && "bg-brand-green-teal/5 border-brand-green-teal/20")}>
      <CardContent className="p-4 md:p-6">
        <p className="text-[10px] md:text-xs uppercase font-bold text-muted-foreground mb-1">{title}</p>
        <h3 className={cn("text-2xl md:text-3xl font-bold mb-1", variant === "green" ? "text-brand-green-teal" : "text-slate-800")}>{value}</h3>
        <p className="text-xs md:text-sm text-muted-foreground leading-tight">{desc}</p>
      </CardContent>
    </Card>
  );
}
