import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Star,
  DollarSign,
  Package,
  Headphones,
  Check,
  X,
  Menu,
  ArrowUp,
  Truck,
  Award,
  Users,
  Shield,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

import heroVendedor from "@/assets/hero-vendedor.jpg";
import avatar1 from "@/assets/avatar-1.webp.asset.json";
import avatar2 from "@/assets/avatar-2.webp.asset.json";
import avatar3 from "@/assets/avatar-3.webp.asset.json";
import catCeramica from "@/assets/cat-ceramica.jpg";
import catPorcelanato from "@/assets/cat-porcelanato.jpg";
import catVinilico from "@/assets/cat-vinilico.jpg";
import solForro from "@/assets/sol-forro.jpg";
import solLouca from "@/assets/sol-louca.jpg";
import solPorta from "@/assets/sol-porta.jpg";
import storeFront from "@/assets/store-front.jpg";
import tCer1 from "@/assets/tile-ceramica-1.jpg";
import tCer2 from "@/assets/tile-ceramica-2.jpg";
import tCer3 from "@/assets/tile-ceramica-3.jpg";
import tPor1 from "@/assets/tile-porcelanato-1.jpg";
import tPor2 from "@/assets/tile-porcelanato-2.jpg";
import tPor3 from "@/assets/tile-porcelanato-3.jpg";
import tVin1 from "@/assets/tile-vinilico-1.jpg";
import tVin2 from "@/assets/tile-vinilico-2.jpg";
import tVin3 from "@/assets/tile-vinilico-3.jpg";
import logoAsset from "@/assets/logo-pisos-do-bosque.png.asset.json";

const WHATSAPP_URL =
  "https://wa.me/5551984905782?text=Ol%C3%A1!%20Vi%20o%20site%20de%20voc%C3%AAs%20e%20gostaria%20de%20um%20atendimento.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Pisos do Bosque — Pisos e Revestimentos com Preço Justo em Cachoeirinha/RS",
      },
      {
        name: "description",
        content:
          "Há mais de 20 anos oferecendo os pisos mais baratos da região. Cerâmica, porcelanato, vinílicos, forro, louças e portas com preço justo, estoque imediato e atendimento personalizado em Cachoeirinha/RS.",
      },
      { name: "theme-color", content: "#F58220" },
      {
        property: "og:title",
        content: "Pisos do Bosque — Pisos e Revestimentos com Preço Justo",
      },
      {
        property: "og:description",
        content:
          "Os pisos mais baratos da região metropolitana de Porto Alegre. Cerâmica, porcelanato, vinílicos e muito mais.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pisos do Bosque" },
      {
        name: "twitter:description",
        content:
          "Pisos e revestimentos com preço justo, entrega rápida e atendimento diferenciado.",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroVendedor },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Pisos do Bosque",
          image: "/favicon.ico",
          telephone: "+555134701212",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Capitão Garibaldi Pinto dos Santos, 468",
            addressLocality: "Cachoeirinha",
            addressRegion: "RS",
            postalCode: "94940-030",
            addressCountry: "BR",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "08:00",
              closes: "18:30",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "08:00",
              closes: "17:00",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "2171",
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

/* ------------ DATA ------------ */

type Product = { img: string; name: string; size: string; price: string };

const ceramica: Product[] = [
  { img: tCer1, name: "Piso Interno Esmaltado Angelus Gray", size: "60 x 60 cm", price: "R$ 23,90 m²" },
  { img: tCer2, name: "Piso Santorini Bege Esmaltado", size: "60 x 60 cm", price: "R$ 26,90 m²" },
  { img: tCer1, name: "Piso Externo Mykonos Brown", size: "53 x 53 cm", price: "R$ 25,99 m²" },
  { img: tCer2, name: "Piso Externo Angelus Gray", size: "60 x 60 cm", price: "R$ 25,90 m²" },
  { img: tCer3, name: "Piso Interno Esmaltado Legno Linear", size: "60 x 60 cm", price: "R$ 29,90 m²" },
  { img: tCer1, name: "Piso Astano Gris Matte Retificado", size: "75 x 75 cm", price: "R$ 49,90 m²" },
];

const porcelanato: Product[] = [
  { img: tPor1, name: "Porcelanato Polido Onice Sea", size: "61 x 121 cm", price: "R$ 109,90 m²" },
  { img: tPor2, name: "Porcelanato Barcelona Bloc Acetinado", size: "84 x 84 cm", price: "R$ 74,90 m²" },
  { img: tPor2, name: "Porcelanato Externo Taberna Titânio", size: "81 x 81 cm", price: "R$ 74,90 m²" },
  { img: tPor2, name: "Porcelanato Pulpis Cinza", size: "84 x 84 cm", price: "R$ 89,90 m²" },
  { img: tPor1, name: "Porcelanato Acetinado Thasos", size: "121 x 121 cm", price: "R$ 99,90 m²" },
  { img: tPor3, name: "Porcelanato Acetinado Calacata", size: "62 x 121 cm", price: "R$ 81,90 m²" },
];

const vinilicos: Product[] = [
  { img: tVin1, name: "Vinílico Atacama", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin1, name: "Vinílico Avelã", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin2, name: "Vinílico Cartagena", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin2, name: "Vinílico Jatobá", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin3, name: "Vinílico Platina", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin1, name: "Vinílico Carmel", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
];

const compareRows = [
  { bad: "Atraso na Entrega", badDesc: "Nada pior do que ter sua obra parada esperando por materiais que nunca chegam. O prazo prometido nunca é cumprido.", good: "Estoque Imediato", goodDesc: "Com o maior estoque da região, garantimos os materiais certos, na hora certa. Sua obra nunca para." },
  { bad: "Preços Altos", badDesc: "Pagando caro por materiais básicos, você estoura o orçamento antes de terminar a obra.", good: "Preço Justo e Competitivo", goodDesc: "Produtos de alta qualidade a preços que cabem no bolso. Sua obra merece o melhor sem pesar no orçamento." },
  { bad: "Atendimento Genérico", badDesc: "Você é tratado como apenas mais um cliente. Ninguém entende suas dúvidas ou ajuda a escolher.", good: "Atendimento Personalizado", goodDesc: "Nossa equipe ouve suas necessidades e ajuda você a encontrar a melhor solução para sua obra." },
  { bad: "Pouca Variedade", badDesc: "A falta de opções obriga você a escolher o que tem, não o que combina com seu projeto.", good: "Maior Estoque da Região", goodDesc: "Ampla variedade de porcelanatos, vinílicos, forros e mais. Encontre exatamente o que precisa." },
  { bad: "Dificuldade em Negociação", badDesc: "Pouca flexibilidade para negociar valores e condições de pagamento.", good: "Condições Flexíveis", goodDesc: "Cada cliente é único. Oferecemos condições flexíveis para a melhor experiência de compra." },
];

const reviews = [
  { name: "Carlos M.", text: "Obrigado ao Thiago vendedor atencioso e educado. Ótimo atendimento!" },
  { name: "Ana P.", text: "Muito bom atendimento, preços ótimos. Atendimento muito bom da Mileni, nota 10!" },
  { name: "João R.", text: "Ótimo atendimento, muito rápido!" },
  { name: "Fernanda S.", text: "Excelente atendimento, preço justo, super recomendo." },
  { name: "Ricardo L.", text: "Excelente atendimento, especialmente da vendedora Fabiana e gerente Grazi. Indico!" },
  { name: "Patrícia B.", text: "Loja completa, encontrei tudo que precisava para minha reforma em um só lugar." },
];

const faqs = [
  { q: "Vocês abrem no sábado?", a: "Sim! Aos sábados atendemos das 8h às 12h e das 13h30 às 17h." },
  { q: "Vocês entregam?", a: "Sim, entregamos em Cachoeirinha, Porto Alegre e toda a região metropolitana. Fale com nosso time no WhatsApp para consultar prazo e valor." },
  { q: "Fazem entrega na praia?", a: "Sim! Consulte condições e prazos de entrega para o litoral direto com nosso atendimento no WhatsApp." },
  { q: "Quais tipos de produtos vocês oferecem?", a: "Pisos cerâmicos, porcelanatos, vinílicos, forros de PVC, louças, metais, portas e muito mais para sua obra ou reforma." },
  { q: "Vocês possuem estacionamento?", a: "Sim, temos estacionamento próprio para clientes na loja em Cachoeirinha." },
  { q: "Vocês ajudam a escolher o produto certo?", a: "Com certeza. Nossa equipe é especializada e vai te ajudar a escolher o piso e revestimento ideal para cada ambiente." },
  { q: "Atendem construtoras e arquitetos?", a: "Sim! Temos condições especiais para construtoras, arquitetos e profissionais. Consulte nossa Parceria pelo WhatsApp." },
];

const categoriesData = [
  {
    key: "ceramica",
    eyebrow: "Categoria",
    title: "Cerâmica",
    desc: "Revestimentos cerâmicos: praticidade, resistência e elegância para sua cozinha, banheiro ou área externa. Opções incríveis com preços que cabem no seu bolso, só na Pisos do Bosque!",
    image: catCeramica,
    products: ceramica,
  },
  {
    key: "porcelanato",
    eyebrow: "Categoria",
    title: "Porcelanato",
    desc: "Beleza, resistência e fácil manutenção para qualquer ambiente. Alta qualidade e preços incríveis, só na Pisos do Bosque.",
    image: catPorcelanato,
    products: porcelanato,
  },
  {
    key: "vinilicos",
    eyebrow: "Categoria",
    title: "Vinílicos",
    desc: "Conforto, sofisticação e praticidade. Ideal para quartos, salas e escritórios com aparência de madeira e instalação rápida.",
    image: catVinilico,
    products: vinilicos,
  },
] as const;

type CategoryKey = (typeof categoriesData)[number]["key"] | "todos";

/* ------------ HOOKS ------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  className = "",
  delay,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>();
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <div ref={ref} style={style} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/* ------------ COMPONENTS ------------ */

function WhatsAppButton({
  className = "",
  children,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-brand-whatsapp px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {children}
    </a>
  );
}

function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  return (
    <img
      src={logoAsset.url}
      alt="Pisos do Bosque"
      width={2730}
      height={655}
      className={`h-10 w-auto md:h-12 ${variant === "light" ? "brightness-0 invert" : ""}`}
      loading="eager"
      decoding="async"
    />
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = [
    { href: "#top", label: "Início" },
    { href: "#produtos", label: "Produtos" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#parceria", label: "Parceria" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/60 bg-background/90 shadow-sm backdrop-blur-lg"
          : "border-transparent bg-background/70 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="#top" aria-label="Ir para o topo">
          <Logo />
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-foreground transition hover:text-brand-orange"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <WhatsAppButton
          ariaLabel="Fale conosco no WhatsApp"
          className="hidden text-sm md:inline-flex"
        >
          Fale Conosco no WhatsApp
        </WhatsAppButton>
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-green transition hover:bg-brand-cream md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[65px] z-40 origin-top overflow-hidden bg-background shadow-lg transition-all duration-300 md:hidden ${
          open ? "max-h-[100vh] border-t border-border" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-4">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition hover:bg-brand-cream hover:text-brand-orange"
            >
              {n.label}
            </a>
          ))}
          <WhatsAppButton
            ariaLabel="Fale conosco no WhatsApp"
            className="mt-3 w-full py-3"
          >
            Fale Conosco no WhatsApp
          </WhatsAppButton>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden gradient-hero">
      {/* Decorative dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-20 lg:gap-20">
        <Reveal className="text-white">
          <div className="mb-7 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[avatar1.url, avatar2.url, avatar3.url].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-7 rounded-full border-2 border-white object-cover bg-brand-cream"
                />
              ))}
            </div>
            <div className="rounded-full bg-white px-2.5 py-1">
              <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <span className="font-bold text-brand-orange">G</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span>4.9 · 2.397 avaliações</span>
              </div>
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold leading-[1.15] md:text-4xl lg:text-5xl">
            Somos conhecidos por ter os{" "}
            <span className="font-extrabold">pisos mais baratos</span> da região!
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/95 md:text-lg">
            Estamos há mais de 20 anos no mercado porque oferecemos pisos e
            revestimentos com <strong>preço justo</strong>,{" "}
            <strong>entrega rápida</strong> e{" "}
            <strong>atendimento diferenciado.</strong>
          </p>
          <div className="mt-8 w-full space-y-3 md:max-w-md">
            {[
              { icon: DollarSign, label: "Menor Preço do Mercado" },
              { icon: Package, label: "Estoque Imediato" },
              { icon: Headphones, label: "Atendimento Personalizado" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-md bg-white px-4 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-whatsapp text-white">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-sm font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>
          <WhatsAppButton
            ariaLabel="Fale conosco no WhatsApp"
            className="mt-8 w-full py-4 text-base md:max-w-md"
          >
            Fale Conosco no WhatsApp
          </WhatsAppButton>
        </Reveal>
        <Reveal delay={150} className="relative flex items-center justify-center self-center">
          <div className="relative mx-auto w-full max-w-xs md:max-w-md lg:max-w-lg">
            {/* Soft radial glow to anchor the image */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.35), transparent 70%)",
              }}
            />
            <img
              src={heroVendedor}
              alt="Vendedor da Pisos do Bosque segurando placa de porcelanato"
              width={1200}
              height={1200}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="float-y w-full drop-shadow-2xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { icon: Award, value: "20+", label: "Anos de mercado" },
    { icon: Users, value: "2.397", label: "Avaliações no Google" },
    { icon: Package, value: "1000+", label: "Itens em estoque" },
    { icon: Truck, value: "Toda RS", label: "Entregamos na região" },
  ];
  return (
    <section className="border-y border-border bg-brand-cream py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-8">
        {items.map((it, i) => (
          <Reveal
            key={it.label}
            delay={i * 80}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <it.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-brand-green">
                {it.value}
              </p>
              <p className="text-xs text-muted-foreground">{it.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[3rem] font-semibold text-foreground">
          {p.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{p.size}</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">{p.price}</p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Saiba mais sobre ${p.name} no WhatsApp`}
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
        >
          Saiba Mais
        </a>
      </div>
    </div>
  );
}

function CategoryBlock({
  eyebrow,
  title,
  desc,
  image,
  products,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  products: Product[];
}) {
  return (
    <div className="mt-16 first:mt-0">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal className="overflow-hidden rounded-2xl shadow-elegant">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />
        </Reveal>
        <Reveal delay={100}>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold text-brand-green md:text-4xl">
            Piso em <span className="text-brand-orange">{title}</span>
          </h3>
          <p className="mt-4 text-muted-foreground">{desc}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-brand-green px-6 py-2.5 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
          >
            Ver Mais
          </a>
        </Reveal>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {products.map((p, i) => (
          <ProductCard key={i} p={p} />
        ))}
      </div>
    </div>
  );
}

function Products() {
  const [active, setActive] = useState<CategoryKey>("todos");
  const filtered =
    active === "todos"
      ? categoriesData
      : categoriesData.filter((c) => c.key === active);

  const tabs: { key: CategoryKey; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "ceramica", label: "Cerâmica" },
    { key: "porcelanato", label: "Porcelanato" },
    { key: "vinilicos", label: "Vinílicos" },
  ];

  return (
    <section id="produtos" className="bg-brand-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-5xl">
            Pisos e Revestimentos de Qualidade,
            <br />
            <span className="text-brand-orange">Em um Só Lugar!</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Transforme sua casa ou projeto com produtos de alta qualidade,
            preços competitivos e entrega garantida no prazo.
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Filtrar categorias"
          className="mx-auto mt-8 flex max-w-full flex-wrap justify-center gap-2 rounded-md border border-border bg-card p-1.5 md:w-fit"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-md px-5 py-2 text-sm font-semibold transition ${
                active === t.key
                  ? "bg-brand-orange text-white shadow-orange"
                  : "text-muted-foreground hover:text-brand-green"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.map((c) => (
          <CategoryBlock
            key={c.key}
            eyebrow={c.eyebrow}
            title={c.title}
            desc={c.desc}
            image={c.image}
            products={c.products}
          />
        ))}
      </div>
    </section>
  );
}

function MoreSolutions() {
  const items = [
    {
      img: solForro,
      title: "Forro de PVC",
      desc: "A solução prática e econômica para tetos impecáveis. Fácil instalação, alta durabilidade e perfeito para diversos ambientes.",
      spec: "PVC — 4, 5, 6 e 7 m",
      price: "R$ 24,90 m²",
    },
    {
      img: solLouca,
      title: "Louças e Metais",
      desc: "Funcionalidade e estilo para banheiros e cozinhas. Vasos sanitários, torneiras e válvulas modernas para acabamento elegante.",
      spec: "Conjunto Acoplado Santa Clara",
      price: "R$ 449,90",
    },
    {
      img: solPorta,
      title: "Portas de Qualidade",
      desc: "Portas modernas e resistentes, ideais para completar qualquer ambiente com estilo e segurança.",
      spec: "Porta Externa Mista",
      price: "R$ 579,90",
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            Mais Soluções para Sua Obra ou Reforma
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Confira também nossa linha de forros, louças, metais e muito mais!
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal
              key={it.title}
              delay={i * 100}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-brand-green">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                <div className="mt-4 rounded-lg bg-brand-cream p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                    Promoção
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{it.spec}</p>
                  <p className="mt-1 text-2xl font-bold text-brand-orange">
                    {it.price}
                  </p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-brand-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Saiba Mais
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section
      id="parceria"
      className="gradient-green py-16 text-white md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Por Que a Pisos do Bosque é a Escolha Certa para Sua Obra?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Há anos ajudamos clientes como você a transformar obras em
            conquistas. Veja os benefícios que só a Pisos do Bosque oferece.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="hidden text-center font-semibold uppercase tracking-wide text-white/70 md:block">
            Outros
          </div>
          <div className="hidden text-center font-semibold uppercase tracking-wide text-brand-orange md:block">
            Pisos do Bosque
          </div>
          {compareRows.map((r, i) => (
            <div key={r.bad} className="contents">
              <Reveal
                delay={i * 60}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <X className="h-5 w-5 text-red-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60 md:hidden">
                      Outros
                    </p>
                    <h4 className="font-semibold text-white">{r.bad}</h4>
                    <p className="mt-1 text-sm text-white/70">{r.badDesc}</p>
                  </div>
                </div>
              </Reveal>
              <Reveal
                delay={i * 60 + 30}
                className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange md:hidden">
                      Pisos do Bosque
                    </p>
                    <h4 className="font-semibold text-white">{r.good}</h4>
                    <p className="mt-1 text-sm text-white/80">{r.goodDesc}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            O Que Nossos Clientes Dizem Sobre Nós
          </h2>
          <p className="mt-3 text-muted-foreground">
            <strong>Mais de 1.200 avaliações positivas</strong> comprovam nosso
            compromisso com qualidade e atendimento.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand-cream px-5 py-2.5 shadow-sm">
            <span className="text-2xl font-bold text-foreground">4.8</span>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              2.171 Avaliações
            </span>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground">"{r.text}"</p>
              <p className="mt-4 text-sm font-semibold text-brand-green">
                — {r.name}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="bg-brand-cream py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            Conheça Nossa História
          </h2>
          <p className="mt-4 italic text-muted-foreground">
            Há mais de 20 anos, a Pisos do Bosque vem transformando ambientes
            com qualidade e confiança. Situados em Cachoeirinha, atendemos Porto
            Alegre e toda a região metropolitana, oferecendo um estoque completo
            para sua obra ou reforma.
          </p>
          <p className="mt-6 font-semibold text-foreground">
            Motivos pelos quais somos referência na região:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {[
              ["Maior estoque da região:", "sempre preparados para suprir sua obra com prontidão."],
              ["Equipe especializada:", "profissionais prontos para auxiliar você na escolha ideal."],
              ["Compromisso com prazos:", "entrega rápida para garantir que sua obra não pare."],
              ["Atendimento abrangente:", "levamos nossos produtos até você em toda a região."],
            ].map(([b, t]) => (
              <li key={b} className="flex gap-2">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <span>
                  <strong>{b}</strong> {t}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <p className="flex items-center gap-2 font-semibold text-brand-green">
                <MapPin className="h-4 w-4" /> Localização
              </p>
              <p className="mt-1 text-muted-foreground">
                Av. Capitão Garibaldi Pinto dos Santos, 468 — Jardim do Bosque,
                Cachoeirinha/RS
              </p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <p className="flex items-center gap-2 font-semibold text-brand-green">
                <Phone className="h-4 w-4" /> Contato
              </p>
              <p className="mt-1 text-muted-foreground">
                WhatsApp: (51) 98490-5782
                <br />
                Telefone: (51) 3470-1212
              </p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-sm sm:col-span-2">
              <p className="flex items-center gap-2 font-semibold text-brand-green">
                <Clock className="h-4 w-4" /> Horário
              </p>
              <p className="mt-1 text-muted-foreground">
                Seg. a Sex.: 8h–12h e 13h30–18h30 · Sáb.: 8h–12h e 13h30–17h
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+Capit%C3%A3o+Garibaldi+Pinto+dos+Santos+468+Cachoeirinha+RS"
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl shadow-elegant"
          >
            <img
              src={storeFront}
              alt="Fachada da loja Pisos do Bosque"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden gradient-hero py-14">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center text-white md:px-8">
        <Shield className="h-10 w-10" />
        <h2 className="font-display text-2xl font-bold md:text-4xl">
          Pronto para transformar sua obra com preço justo?
        </h2>
        <p className="max-w-2xl text-white/90">
          Fale agora com nosso time e receba um atendimento personalizado. Sem
          compromisso, com o melhor preço da região.
        </p>
        <WhatsAppButton
          ariaLabel="Falar agora no WhatsApp"
          className="px-8 py-4 text-base"
        >
          Falar Agora no WhatsApp
        </WhatsAppButton>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tire suas dúvidas rapidamente.
          </p>
        </Reveal>
        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="mt-8 rounded-2xl border border-border bg-card p-2 shadow-sm"
          >
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-border"
              >
                <AccordionTrigger className="px-4 text-left font-semibold text-foreground hover:text-brand-orange hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-green-dark py-14 text-white/90">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-3 md:px-8">
        <div>
          <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white">
            Contato
          </h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 text-brand-orange" /> (51)
              98490-5782
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-orange" />{" "}
              pisosdobosque2019@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>
                Segunda a sexta: 8h às 12h e 13h30 às 18h30
                <br />
                Sábado: 8h às 12h e 13h30 às 17h
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>
                Av. Capitão Garibaldi Pinto dos Santos, 468 — Jardim do Bosque,
                Cachoeirinha, RS
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white">
            Navegação
          </h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <ul className="mt-5 space-y-2 text-sm">
            <li>
              <a href="#sobre" className="hover:text-brand-orange">
                Sobre Nós
              </a>
            </li>
            <li>
              <a href="#produtos" className="hover:text-brand-orange">
                Produtos
              </a>
            </li>
            <li>
              <a href="#parceria" className="hover:text-brand-orange">
                Parceria
              </a>
            </li>
          </ul>
          <h4 className="mt-8 font-display text-lg font-bold uppercase tracking-wider text-white">
            Nossas Redes
          </h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white">
            Políticas
          </h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <ul className="mt-5 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-brand-orange">
                Política de privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand-orange">
                Termos de uso
              </a>
            </li>
          </ul>
          <h4 className="mt-8 font-display text-lg font-bold uppercase tracking-wider text-white">
            Visite nossa loja
          </h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+Capit%C3%A3o+Garibaldi+Pinto+dos+Santos+468+Cachoeirinha+RS"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block overflow-hidden rounded-lg border border-white/20"
          >
            <img
              src={storeFront}
              alt="Mapa da loja"
              loading="lazy"
              decoding="async"
              className="h-28 w-full object-cover"
            />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 px-4 pt-6 pb-20 text-xs text-white/60 md:flex-row md:px-8 md:pb-0">
        <span>
          Copyright © 2025 Pisos do Bosque. Todos os direitos reservados.
        </span>
        <span>Recriado com Lovable</span>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="pulse-ring fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-whatsapp text-white shadow-xl transition hover:scale-110 md:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-green text-white shadow-lg transition-all md:bottom-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-lg backdrop-blur md:hidden">
      <div className="flex gap-2">
        <a
          href="tel:+555134701212"
          aria-label="Ligar para a loja"
          className="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-brand-green px-4 py-2.5 text-sm font-semibold text-brand-green"
        >
          <Phone className="h-4 w-4" /> Ligar
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[2] items-center justify-center gap-2 rounded-md bg-brand-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-md"
        >
          <WhatsAppIcon className="h-4 w-4" /> Fale no WhatsApp
        </a>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-green focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Products />
        <MoreSolutions />
        <Comparison />
        <Testimonials />
        <About />
        <CTA />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <MobileCTABar />
    </div>
  );
}
