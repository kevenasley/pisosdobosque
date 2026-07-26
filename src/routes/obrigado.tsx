import { createFileRoute, Link } from "@tanstack/react-router";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/config";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Obrigado — Pisos do Bosque" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Recebemos seu contato. Em breve nosso time responderá no WhatsApp.",
      },
    ],
  }),
  component: ObrigadoPage,
});

function ObrigadoPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
          <CheckCircle2 className="h-4 w-4" />
          Contato recebido
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight [text-wrap:balance]">
          Obrigado! Seu contato chegou até nós.
        </h1>
        <p className="mt-3 text-muted-foreground [text-wrap:balance]">
          Um consultor da Pisos do Bosque vai te chamar no WhatsApp em instantes
          para entender melhor sua necessidade e apresentar as melhores opções.
        </p>

        <div className="mt-8 rounded-lg border bg-card p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Próximos passos
          </h2>
          <ol className="mt-3 space-y-2 text-sm">
            <li>1. Fique atento ao seu WhatsApp.</li>
            <li>2. Tenha em mãos a metragem aproximada do ambiente.</li>
            <li>3. Se possível, envie referências ou fotos do espaço.</li>
          </ol>
        </div>

        <a
          href={WHATSAPP_URL}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-green/90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Abrir WhatsApp
        </a>

        <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Seg–Sex 8h–18h30
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Cachoeirinha/RS
          </div>
        </div>

        <div className="mt-10">
          <Link to="/" className="text-sm text-muted-foreground underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
