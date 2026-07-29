import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Clock, MapPin, CheckCircle2, MessageCircle } from "lucide-react";
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
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Obrigado — Pisos do Bosque" },
      {
        property: "og:description",
        content: "Recebemos seu contato. Em breve nosso time responderá no WhatsApp.",
      },
      { property: "og:url", content: "https://pisosdobosque.lovable.app/obrigado" },
    ],
    links: [
      { rel: "canonical", href: "https://pisosdobosque.lovable.app/obrigado" },
    ],
  }),
  component: ObrigadoPage,
});

function ObrigadoPage() {
  const [src, setSrc] = useState<"form" | "direct">("form");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("src") === "direct") setSrc("direct");
  }, []);

  const isDirect = src === "direct";

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
          <CheckCircle2 className="h-4 w-4" />
          {isDirect ? "Redirecionando para o WhatsApp" : "Contato recebido"}
        </span>

        <h1 className="mt-6 text-3xl font-bold tracking-tight [text-wrap:balance]">
          {isDirect
            ? "Estamos te levando para o WhatsApp!"
            : "Obrigado! Seu contato chegou até nós."}
        </h1>

        <p className="mt-3 text-muted-foreground [text-wrap:balance]">
          {isDirect ? (
            <>
              O WhatsApp foi aberto em uma nova aba. Se não abriu automaticamente,
              use o botão abaixo para falar com um consultor.
            </>
          ) : (
            <>
              Um consultor da Pisos do Bosque vai te chamar no WhatsApp em
              instantes para entender sua necessidade e apresentar as melhores
              opções.
            </>
          )}
        </p>

        <div className="mt-8 rounded-lg border bg-card p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {isDirect ? "Enquanto isso" : "Próximos passos"}
          </h2>
          <ol className="mt-3 space-y-2 text-sm">
            {isDirect ? (
              <>
                <li className="flex gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brand-green" />
                  Envie a metragem aproximada do ambiente.
                </li>
                <li className="flex gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brand-green" />
                  Se possível, mande fotos ou referências do espaço.
                </li>
                <li className="flex gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brand-green" />
                  Conte para qual cômodo é o piso (sala, cozinha, área externa…).
                </li>
              </>
            ) : (
              <>
                <li>1. Fique atento ao seu WhatsApp.</li>
                <li>2. Tenha em mãos a metragem aproximada do ambiente.</li>
                <li>3. Se possível, envie referências ou fotos do espaço.</li>
              </>
            )}
          </ol>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-lead-bypass="true"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-green/90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {isDirect ? "Abrir WhatsApp novamente" : "Abrir WhatsApp"}
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
