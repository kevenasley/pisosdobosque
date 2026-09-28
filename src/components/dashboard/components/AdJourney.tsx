import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AdJourney({
  impressions,
  link_clicks,
  conversations,
}: {
  impressions: number;
  link_clicks: number;
  conversations: number;
}) {
  const isMobile = useIsMobile();

  const ctr = impressions > 0 ? (link_clicks / impressions) * 100 : 0;
  const convRate = link_clicks > 0 ? (conversations / link_clicks) * 100 : 0;

  if (isMobile) {
    const steps = [
      {
        label: "Exibições",
        value: impressions.toLocaleString("pt-BR"),
        description: "Anúncios exibidos",
        badge: null,
        dotClass: "bg-slate-400",
      },
      {
        label: "Cliques no link",
        value: link_clicks.toLocaleString("pt-BR"),
        description: "Pessoas interessadas",
        badge: `${ctr.toFixed(1)}% das exibições`,
        dotClass: "bg-brand-green",
      },
      {
        label: "Novas conversas",
        value: conversations.toLocaleString("pt-BR"),
        description: "Contatos diretos iniciados",
        badge: `${convRate.toFixed(1)}% dos cliques`,
        dotClass: "bg-brand-green-teal",
      },
    ];

    return (
      <section className="rounded-2xl border border-brand-green/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <h3 className="text-base font-bold text-brand-green-teal">
            Jornada dos anúncios
          </h3>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
            Do anúncio exibido até a conversa iniciada.
          </p>
        </div>

        <div className="space-y-0.5">
          {steps.map((step, index) => (
            <div key={step.label} className="grid grid-cols-[18px_1fr] gap-3">
              <div className="flex flex-col items-center">
                <div className={`mt-1.5 h-3 w-3 rounded-full ${step.dotClass}`} />
                {index < steps.length - 1 && (
                  <div className="my-1 min-h-9 w-px flex-1 bg-slate-200" />
                )}
              </div>

              <div className={index < steps.length - 1 ? "pb-4" : ""}>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {step.label}
                  </p>
                  {step.badge && (
                    <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[9px] font-bold text-brand-green">
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xl font-bold leading-none text-slate-900">
                  {step.value}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-brand-green/10 bg-white p-8 shadow-sm">
      <h3 className="mb-8 text-xl font-bold text-brand-green-teal">
        Jornada dos anúncios
      </h3>

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex-1 p-4 text-center">
          <p className="mb-1 text-xs font-bold uppercase text-slate-500">Exibições</p>
          <p className="text-3xl font-bold">{impressions.toLocaleString("pt-BR")}</p>
          <p className="text-sm leading-tight text-slate-500">Anúncios exibidos</p>
        </div>

        <ArrowRight className="h-6 w-6 shrink-0 text-brand-green/20" />

        <div className="relative flex-1 p-4 text-center">
          <div className="absolute left-1/2 top-0 mb-2 -translate-x-1/2 -translate-y-full">
            <span className="whitespace-nowrap rounded-full border border-brand-orange/20 bg-brand-orange/10 px-2 py-1 text-[10px] font-bold text-brand-orange">
              {ctr.toFixed(1)}% geraram clique
            </span>
          </div>
          <p className="mb-1 text-xs font-bold uppercase text-brand-green">Cliques no link</p>
          <p className="text-3xl font-bold text-brand-green-teal">
            {link_clicks.toLocaleString("pt-BR")}
          </p>
          <p className="text-sm leading-tight text-slate-500">Pessoas interessadas</p>
        </div>

        <ArrowRight className="h-6 w-6 shrink-0 text-brand-green/20" />

        <div className="relative flex-1 p-4 text-center">
          <div className="absolute left-1/2 top-0 mb-2 -translate-x-1/2 -translate-y-full">
            <span className="whitespace-nowrap rounded-full border border-brand-green/20 bg-brand-green/10 px-2 py-1 text-[10px] font-bold text-brand-green">
              {convRate.toFixed(1)}% resultaram em conversa
            </span>
          </div>
          <p className="mb-1 text-xs font-bold uppercase text-brand-green-teal">
            Novas conversas
          </p>
          <p className="text-3xl font-bold text-brand-green-teal">
            {conversations.toLocaleString("pt-BR")}
          </p>
          <p className="text-sm leading-tight text-slate-500">Contatos diretos iniciados</p>
        </div>
      </div>
    </section>
  );
}
