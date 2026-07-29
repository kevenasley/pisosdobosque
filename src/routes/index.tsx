import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Scale,
  Stethoscope,
  FileText,
  Clock,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Quote,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const WHATSAPP_HREF = "https://wa.me/5551984905782";
const SITE_URL = "https://pisosdobosque.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reverta a negativa da terapia ABA — Direito à saúde do seu filho" },
      {
        name: "description",
        content:
          "Ajudamos famílias de crianças autistas a reverter negativas de cobertura de terapia ABA pelos planos de saúde. Análise inicial gratuita com equipe jurídico-médica.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Reverta a negativa da terapia ABA" },
      {
        property: "og:description",
        content:
          "Equipe jurídico-médica especializada em obrigar planos de saúde a cobrir a terapia ABA. Análise inicial gratuita.",
      },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Reverta a negativa da terapia ABA" },
      {
        name: "twitter:description",
        content:
          "Análise gratuita para famílias de crianças autistas com negativa de cobertura ABA.",
      },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: LandingPage,
});

function CTAButton({
  children,
  size = "lg",
  origin,
  className = "",
}: {
  children: React.ReactNode;
  size?: "lg" | "md";
  origin: string;
  className?: string;
}) {
  const sizeCls =
    size === "lg"
      ? "px-6 py-4 text-base sm:text-lg"
      : "px-5 py-3 text-sm sm:text-base";
  return (
    <a
      href={WHATSAPP_HREF}
      data-cta-origin={origin}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-orange)] font-semibold text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--brand-orange)_60%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange-dark)] hover:shadow-[0_18px_40px_-12px_color-mix(in_oklab,var(--brand-orange)_70%,transparent)] active:translate-y-0 sm:w-auto ${sizeCls} ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-green-teal)]/20 bg-[color:var(--brand-green-teal)]/8 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-green-teal)]">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--brand-cream)] text-foreground">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-green-dark)] via-[color:var(--brand-green-teal)] to-[color:var(--brand-green-dark)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[color:var(--brand-orange)]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[color:var(--brand-green-light)]/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-[color:var(--brand-orange-light)]" />
                Equipe jurídico-médica especializada em autismo
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Plano de saúde negou a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[color:var(--brand-orange-light)]">
                    terapia ABA
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 h-3 rounded-sm bg-[color:var(--brand-orange)]/30"
                  />
                </span>{" "}
                do seu filho?
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                Reverta a negativa em poucos dias. Nossa equipe combina{" "}
                <strong className="text-white">advogados</strong> e{" "}
                <strong className="text-white">médicos</strong> para obrigar o
                plano a custear o tratamento — sem custo antecipado e com
                análise inicial gratuita.
              </p>

              <ul className="mt-7 grid gap-2.5 text-sm text-white/90 sm:text-base">
                {[
                  "Análise inicial gratuita em até 24h",
                  "Liminares deferidas em 3 a 10 dias",
                  "Você só paga se ganhar a causa",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-green-light)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CTAButton origin="hero_primary">
                  Falar com a equipe agora
                </CTAButton>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Clock className="h-4 w-4" />
                  Resposta em minutos, seg. a sáb.
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-xs text-white/75 sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className="h-4 w-4 fill-[color:var(--brand-orange-light)] text-[color:var(--brand-orange-light)]"
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9</span>
                  <span>· centenas de famílias atendidas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--brand-green-light)]" />
                  Sigilo total garantido
                </div>
              </div>
            </div>

            {/* Right visual card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur">
                <div className="mb-4 flex items-center gap-3 border-b border-black/5 pb-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color:var(--brand-green-teal)]/10 text-[color:var(--brand-green-teal)]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Análise inicial gratuita
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      O que avaliamos no seu caso
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-foreground/85">
                  {[
                    { icon: FileText, text: "Carta de negativa do plano" },
                    { icon: Stethoscope, text: "Relatório médico e laudo" },
                    { icon: Scale, text: "Prazo e chances de liminar" },
                    { icon: HeartHandshake, text: "Próximos passos claros para a família" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-xl bg-[color:var(--brand-green-teal)]/6 p-4 text-sm">
                  <div className="mb-1 font-semibold text-[color:var(--brand-green-dark)]">
                    Sem risco financeiro
                  </div>
                  <p className="text-foreground/70">
                    Você só paga honorários se conseguirmos a cobertura. Sem taxas
                    escondidas.
                  </p>
                </div>
              </div>
              <div
                aria-hidden
                className="absolute -bottom-4 left-4 right-4 -z-10 h-8 rounded-b-2xl bg-black/20 blur-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROBLEM ---------- */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTag>O problema real</SectionTag>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Cada mês sem terapia é tempo que{" "}
              <span className="text-[color:var(--brand-orange)]">não volta</span>.
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              A janela de intervenção precoce é curta. Enquanto o plano protela,
              seu filho perde meses críticos de desenvolvimento.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: AlertTriangle,
                title: "Negativas sem base legal",
                text: "Planos alegam limitação de sessões ou falta de rol da ANS — mas o STJ já pacificou: cobertura é obrigatória.",
              },
              {
                icon: Clock,
                title: "Meses de espera na burocracia",
                text: "Recursos administrativos podem levar 60 a 180 dias. Judicialmente, conseguimos liminar em poucos dias.",
              },
              {
                icon: HeartHandshake,
                title: "Famílias exaustas e sozinhas",
                text: "Sem orientação técnica, muitas famílias desistem ou pagam do próprio bolso um tratamento que já é direito.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SOLUTION ---------- */}
      <section className="relative bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionTag>Nossa abordagem</SectionTag>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Advogados e médicos trabalhando juntos pelo seu filho.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Não somos um escritório genérico. Somos especialistas em direito
                à saúde de crianças no espectro autista — com médicos parceiros
                que fundamentam tecnicamente cada caso.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Estratégia jurídica focada em liminar",
                    text: "Ações desenhadas para conseguir a cobertura em dias, não em anos.",
                  },
                  {
                    title: "Laudo técnico robusto",
                    text: "Médicos especialistas em TEA que traduzem a necessidade da ABA para a linguagem jurídica.",
                  },
                  {
                    title: "Acompanhamento humano",
                    text: "Um responsável dedicado à sua família do primeiro contato à execução.",
                  },
                ].map((row) => (
                  <div key={row.title} className="flex gap-4">
                    <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--brand-green-teal)]/10 text-[color:var(--brand-green-teal)]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {row.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {row.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <CTAButton origin="solution_cta" size="md">
                  Quero analisar meu caso
                </CTAButton>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-[color:var(--brand-green-teal)] to-[color:var(--brand-green-dark)] p-8 text-white shadow-xl">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-3xl opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]"
                />
                <div className="relative">
                  <div className="text-sm font-semibold uppercase tracking-wider text-[color:var(--brand-orange-light)]">
                    Resultados que já conseguimos
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    {[
                      { k: "+500", v: "famílias atendidas" },
                      { k: "94%", v: "de decisões favoráveis" },
                      { k: "3-10", v: "dias para a liminar" },
                      { k: "R$ 0", v: "de custo antecipado" },
                    ].map((s) => (
                      <div key={s.v}>
                        <div className="text-4xl font-extrabold leading-none text-white">
                          {s.k}
                        </div>
                        <div className="mt-1 text-sm text-white/80">{s.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <Quote className="mb-2 h-5 w-5 text-[color:var(--brand-orange-light)]" />
                    <p className="text-sm leading-relaxed text-white/90">
                      “Em 7 dias tínhamos liminar e a terapia começou. Não tenho
                      palavras para agradecer.”
                    </p>
                    <div className="mt-3 text-xs font-semibold text-white/70">
                      — Mãe do Théo, 4 anos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTag>Como funciona</SectionTag>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              3 passos simples até a cobertura.
            </h2>
          </div>

          <div className="relative mt-12 grid gap-6 md:grid-cols-3">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-[color:var(--brand-green-teal)]/30 to-transparent md:block"
            />
            {[
              {
                n: "01",
                title: "Você fala com a gente",
                text: "Envia a carta de negativa e o relatório médico pelo WhatsApp. Levamos até 24h para analisar.",
              },
              {
                n: "02",
                title: "Montamos a estratégia",
                text: "Advogado + médico parceiro estruturam o caso e a petição com pedido de liminar.",
              },
              {
                n: "03",
                title: "Seu filho começa a terapia",
                text: "Com a liminar deferida, o plano é obrigado a custear a ABA imediatamente.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--brand-orange)] text-lg font-extrabold text-white shadow-[0_10px_25px_-10px_color-mix(in_oklab,var(--brand-orange)_70%,transparent)]">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="relative bg-[color:var(--brand-green-dark)] py-16 text-white sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.1] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-orange-light)]">
              <Star className="h-3.5 w-3.5 fill-current" />
              Famílias reais, resultados reais
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              O que dizem as famílias que já passaram por aqui.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Camila R.",
                child: "Mãe do Théo",
                text: "Estávamos há 8 meses tentando pelo administrativo. Em uma semana com a equipe, saiu a liminar. Recuperamos a esperança.",
              },
              {
                name: "Bruno S.",
                child: "Pai da Alice",
                text: "Explicaram tudo com paciência, sem juridiquês. Nunca me senti sozinho no processo. E o melhor: deu certo.",
              },
              {
                name: "Fernanda L.",
                child: "Mãe do Enzo",
                text: "O plano tinha limitado a 2h por semana. Hoje o Enzo faz 20h. É outra criança. Obrigada, de coração.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur"
              >
                <div className="flex gap-0.5 text-[color:var(--brand-orange-light)]">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  “{t.text}”
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--brand-orange)] font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-white/70">{t.child}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center">
            <SectionTag>Perguntas frequentes</SectionTag>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ainda com dúvidas?
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {[
              {
                q: "Quanto custa entrar com a ação?",
                a: "Nada antecipadamente. Trabalhamos com honorários de êxito: você só paga se conseguirmos a cobertura da terapia.",
              },
              {
                q: "Em quanto tempo meu filho começa a terapia?",
                a: "Na maioria dos casos, obtemos a liminar entre 3 e 10 dias. Com a liminar em mãos, o plano é obrigado a autorizar imediatamente.",
              },
              {
                q: "Meu plano é pequeno / regional. Vocês atendem?",
                a: "Sim. Atendemos famílias em todo o Brasil e contra qualquer operadora — de grandes redes a autogestões e planos regionais.",
              },
              {
                q: "Quais documentos preciso ter?",
                a: "Basicamente: a carta de negativa do plano, o laudo médico com CID F84 e a prescrição da carga horária de ABA. Ajudamos a organizar o restante.",
              },
              {
                q: "É seguro? E se der errado?",
                a: "As chances são altas — a jurisprudência é favorável e temos 94% de decisões positivas. Mesmo assim, você não corre risco financeiro: sem êxito, não há honorários.",
              },
            ].map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-base font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-orange)] to-[color:var(--brand-orange-dark)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Cada mês sem terapia é tempo que não volta.
          </h2>
          <p className="mt-5 text-base text-white/90 sm:text-lg">
            Fale agora com a nossa equipe. A análise inicial é gratuita e feita
            por profissionais especializados em direito à saúde e autismo.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={WHATSAPP_HREF}
              data-cta-origin="final_cta"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-semibold text-[color:var(--brand-orange-dark)] shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--brand-cream)] sm:text-lg"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar com a equipe técnica pelo WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/85 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Sigilo total
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Resposta em minutos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Análise gratuita
            </span>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-[color:var(--brand-green-dark)] py-10 text-white/80">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-lg font-bold text-white">Direito ABA</div>
              <p className="mt-2 max-w-xs text-sm">
                Equipe jurídico-médica especializada em garantir o direito de
                crianças autistas à terapia ABA.
              </p>
            </div>
            <div className="text-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                Contato
              </div>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href="mailto:contato@direitoaba.com.br"
                className="mt-2 flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4" /> contato@direitoaba.com.br
              </a>
            </div>
            <div className="text-xs">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                Aviso legal
              </div>
              <p>
                Este site tem caráter informativo. Consulta jurídica sob demanda,
                respeitando o Código de Ética da OAB. Resultados variam conforme
                cada caso.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/60">
            © {new Date().getFullYear()} Direito ABA. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* ---------- FLOATING WHATSAPP ---------- */}
      <a
        href={WHATSAPP_HREF}
        data-cta-origin="floating_whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className={`fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[color:var(--brand-whatsapp)] text-white shadow-2xl transition-all duration-500 hover:scale-110 sm:h-16 sm:w-16 ${
          scrolled ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-[color:var(--brand-whatsapp)] opacity-40"
        />
        <WhatsAppIcon className="relative h-7 w-7" />
      </a>
    </div>
  );
}
