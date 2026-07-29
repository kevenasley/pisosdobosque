import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
  Quote,
  DollarSign,
  Package,
  Headphones,
  Check,
  X,
  Menu,
  ArrowUp,
  Truck,
  Award,
  Plus,
  Users,
  Shield,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { InteractiveMap } from "@/components/InteractiveMap";
import { smoothScrollTo } from "@/lib/smoothScrollTo";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlaceStatsProvider,
  usePlaceStats,
} from "@/components/PlaceStatsProvider";


import heroVendedor from "@/assets/hero-vendedor.webp";
import heroVendedorMobile from "@/assets/hero-vendedor-mobile.webp";
import toolHammer from "@/assets/tool-hammer.webp";
import toolTape from "@/assets/tool-tape.webp";
import toolTiles from "@/assets/tool-tiles.webp";
const avatar1 = { url: "/avatar-1.webp" };
const avatar2 = { url: "/avatar-2.webp" };
const avatar3 = { url: "/avatar-3.webp" };
import catCeramica from "@/assets/cat-ceramica.webp";
import catPorcelanato from "@/assets/cat-porcelanato.webp";
import catVinilico from "@/assets/cat-vinilico.webp";
import solForro from "@/assets/sol-forro.webp";
import solLouca from "@/assets/sol-louca.webp";
import solPorta from "@/assets/sol-porta.webp";
import storeFront from "@/assets/store-front.webp";
import showroom1 from "@/assets/showroom-1.webp";
import showroom2 from "@/assets/showroom-2.webp";
import showroom3 from "@/assets/showroom-3.webp";
import showroom4 from "@/assets/showroom-4.webp";
import showroom5 from "@/assets/showroom-5.webp";
import showroom6 from "@/assets/showroom-6.webp";
import showroom7 from "@/assets/showroom-7.webp";
import showroom8 from "@/assets/showroom-8.webp";



import tVin1 from "@/assets/tile-vinilico-1.webp";
import tVin2 from "@/assets/tile-vinilico-2.webp";
import tVin3 from "@/assets/tile-vinilico-3.webp";
const logoAsset = { url: "/logo-pisos-do-bosque.webp" };

const WHATSAPP_URL =
  "https://wa.me/5551984905782?text=Ol%C3%A1!%20Vi%20o%20site%20de%20voc%C3%AAs%20e%20gostaria%20de%20um%20atendimento.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Pisos do Bosque — Pisos com Preço Justo em Cachoeirinha/RS",
      },
      {
        name: "description",
        content:
          "Há mais de 20 anos com os pisos mais baratos da região: cerâmica, porcelanato, vinílicos, forro, louças e portas em Cachoeirinha/RS.",
      },
      { name: "theme-color", content: "#FF6400" },
      {
        property: "og:title",
        content: "Pisos do Bosque — Pisos com Preço Justo em Cachoeirinha/RS",
      },
      {
        property: "og:description",
        content:
          "Há mais de 20 anos com os pisos mais baratos da região: cerâmica, porcelanato, vinílicos, forro, louças e portas em Cachoeirinha/RS.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pisosdobosque.lovable.app/" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pisos do Bosque — Pisos com Preço Justo em Cachoeirinha/RS" },
      {
        name: "twitter:description",
        content:
          "Há mais de 20 anos com os pisos mais baratos da região: cerâmica, porcelanato, vinílicos, forro, louças e portas em Cachoeirinha/RS.",
      },
      { property: "og:image", content: "https://pisosdobosque.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://pisosdobosque.lovable.app/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://pisosdobosque.lovable.app/" },
      {
        rel: "preload",
        as: "image",
        href: "/logo-pisos-do-bosque.webp",
        fetchpriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: heroVendedor,
        imagesrcset: `${heroVendedorMobile} 600w, ${heroVendedor} 900w`,
        imagesizes: "(max-width: 767px) 240px, (max-width: 1023px) 320px, (max-width: 1279px) 448px, (max-width: 1535px) 512px, 640px",
        fetchpriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Pisos do Bosque",
          image: heroVendedor,
          url: "https://pisosdobosque.lovable.app/",
          telephone: "+5551984905782",
          priceRange: "$$",
          sameAs: [
            "https://www.instagram.com/pisosdobosque",
            "https://www.facebook.com/pisosdobosque",
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Capitão Garibaldi Pinto dos Santos, 488",
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
            ratingValue: "4.9",
            reviewCount: "2397",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

/* ------------ DATA ------------ */

type Product = { img: string; name: string; size: string; price: string };

const ceramica: Product[] = [
  { img: "/piso-interno-esmaltado-angelus-gray.webp", name: "Piso Interno Esmaltado Angelus Gray", size: "60 x 60 cm", price: "R$ 23,90 m²" },
  { img: "/piso-santorini-bege-esmaltado.webp", name: "Piso Santorini Bege Esmaltado", size: "60 x 60 cm", price: "R$ 26,90 m²" },
  { img: "/piso-externo-mykonos-brown.webp", name: "Piso Externo Mykonos Brown", size: "53 x 53 cm", price: "R$ 25,99 m²" },
  { img: "/piso-externo-angelus-gray.webp", name: "Piso Externo Angelus Gray", size: "60 x 60 cm", price: "R$ 26,90 m²" },
  { img: "/piso-interno-esmaltado-legno-linear.webp", name: "Piso Interno Esmaltado Legno Linear", size: "60 x 60 cm", price: "R$ 29,90 m²" },
  { img: "/piso-astano-gris-matte-retificado.webp", name: "Piso Astano Gris Matte Retificado", size: "75 x 75 cm", price: "R$ 49,90 m²" },
  { img: "/piso-blue-belle-polido.webp", name: "Piso Blue Belle Polido", size: "56 x 113 cm", price: "R$ 64,90 m²" },
  { img: "/piso-sicilia-polido.webp", name: "Piso Sicília Polido", size: "83 x 83 cm", price: "R$ 52,90 m²" },
];

const porcelanato: Product[] = [
  { img: "/piso-pulpis-cinza-polido.webp", name: "Porcelanato Pulpis Cinza Polido", size: "84 x 84 cm", price: "R$ 89,90 m²" },
  { img: "/piso-thasos-acetinado.webp", name: "Porcelanato Thasos Acetinado", size: "121 x 121 cm", price: "R$ 99,90 m²" },
  { img: "/piso-calacata-acetinado.webp", name: "Porcelanato Calacata Acetinado", size: "62 x 121 cm", price: "R$ 81,90 m²" },
  { img: "/porcelanato-externo-broadway-dark-gray.webp", name: "Porcelanato Externo Broadway Dark Gray", size: "81 x 82 cm", price: "R$ 79,90 m²" },
  { img: "/piso-cimento-gris-acetinado.webp", name: "Porcelanato Cimento Gris Acetinado", size: "83 x 83 cm", price: "R$ 79,90 m²" },
  { img: "/piso-onix-premium-polido.webp", name: "Porcelanato Onix Premium Polido", size: "82 x 82 cm", price: "R$ 94,90 m²" },
  { img: "/piso-ducal-polido.webp", name: "Porcelanato Ducal Polido", size: "82 x 82 cm", price: "R$ 94,90 m²" },
];

const vinilicos: Product[] = [
  { img: tVin1, name: "Vinílico Atacama", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin1, name: "Vinílico Avelã", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin2, name: "Vinílico Cartagena", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin2, name: "Vinílico Jatobá", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin3, name: "Vinílico Platina", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: tVin1, name: "Vinílico Carmel", size: "18,7 x 122,7 cm", price: "R$ 79,90 m²" },
  { img: "/piso-taberna-titanio.webp", name: "Taberna Titânio", size: "18,7 x 122,7 cm", price: "R$ 74,90 m²" },
];

const compareRows = [
  { topic: "Entrega e Prazo", bad: "Atraso na Entrega", badDesc: "Nada pior do que ter sua obra parada esperando por materiais que nunca chegam. O prazo prometido nunca é cumprido.", good: "Estoque Imediato", goodDesc: "Com o maior estoque da região, garantimos os materiais certos, na hora certa. Sua obra nunca para." },
  { topic: "Preço", bad: "Preços Altos", badDesc: "Pagando caro por materiais básicos, você estoura o orçamento antes de terminar a obra.", good: "Preço Justo e Competitivo", goodDesc: "Produtos de alta qualidade a preços que cabem no bolso. Sua obra merece o melhor sem pesar no orçamento." },
  { topic: "Atendimento", bad: "Atendimento Genérico", badDesc: "Você é tratado como apenas mais um cliente. Ninguém entende suas dúvidas ou ajuda a escolher.", good: "Atendimento Personalizado", goodDesc: "Nossa equipe ouve suas necessidades e ajuda você a encontrar a melhor solução para sua obra." },
  { topic: "Variedade de Produtos", bad: "Pouca Variedade", badDesc: "A falta de opções obriga você a escolher o que tem, não o que combina com seu projeto.", good: "Maior Estoque da Região", goodDesc: "Ampla variedade de porcelanatos, vinílicos, forros e mais. Encontre exatamente o que precisa." },
  { topic: "Condições de Pagamento", bad: "Dificuldade em Negociação", badDesc: "Pouca flexibilidade para negociar valores e condições de pagamento.", good: "Condições Flexíveis", goodDesc: "Cada cliente é único. Oferecemos condições flexíveis para a melhor experiência de compra." },
];

const reviews = [
  {
    name: "Carlos Mendes",
    initial: "C",
    text: 'Obrigado ao Thiago, vendedor atencioso e educado. **Ótimo atendimento** e preços que realmente cabem no bolso. Voltarei com certeza para a próxima reforma.',
  },
  {
    name: "Ana Paula",
    initial: "A",
    text: 'Muito bom atendimento, **preços ótimos** e a Mileni foi super paciente comigo escolhendo os porcelanatos. Nota 10 para a loja toda!',
  },
  {
    name: "João Ricardo",
    initial: "J",
    text: 'Ótimo atendimento, **muito rápido** e sem enrolação. Sai da loja com tudo o que precisava para começar minha obra no mesmo dia.',
  },
  {
    name: "Fernanda Silva",
    initial: "F",
    text: 'Excelente atendimento, **preço justo** e produtos de qualidade. Super recomendo para quem procura pisos e revestimentos bons por um valor honesto.',
  },
  {
    name: "Ricardo Lopes",
    initial: "R",
    text: 'Atendimento nota mil, especialmente da Fabiana e da gerente Grazi. **Time consultivo e transparente** do começo ao fim. Indico de olhos fechados.',
  },
  {
    name: "Patrícia Bastos",
    initial: "P",
    text: 'Loja completa, **encontrei tudo que precisava** para a reforma em um só lugar. Entrega rápida e produtos exatamente como combinado.',
  },
  {
    name: "Mariana Costa",
    initial: "M",
    text: 'Fui muito bem atendida desde a entrada na loja. **Profissionais competentes** e preços realmente competitivos. Recomendo!',
  },
  {
    name: "Roberto Dias",
    initial: "R",
    text: 'Excelente variedade de pisos e revestimentos. **Consegui tudo para minha obra** com ótimas condições de pagamento.',
  },
  {
    name: "Juliana Ramos",
    initial: "J",
    text: 'Atendimento diferenciado e entrega no prazo. **A Pisos do Bosque é minha loja de confiança** para reformas.',
  },
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
    bg: "bg-brand-orange/10",
  },
  {
    key: "porcelanato",
    eyebrow: "Categoria",
    title: "Porcelanato",
    desc: "Beleza, resistência e fácil manutenção para qualquer ambiente. Alta qualidade e preços incríveis, só na Pisos do Bosque.",
    image: catPorcelanato,
    products: porcelanato,
    bg: "bg-brand-green/10",
  },
  {
    key: "vinilicos",
    eyebrow: "Categoria",
    title: "Vinílicos",
    desc: "Conforto, sofisticação e praticidade. Ideal para quartos, salas e escritórios com aparência de madeira e instalação rápida.",
    image: catVinilico,
    products: vinilicos,
    bg: "bg-amber-100/50",
  },
] as const;

type CategoryKey = (typeof categoriesData)[number]["key"] | "todos";

/* ------------ HOOKS ------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("reveal-in");
      return;
    }
    // Immediate check: if the element is already in the viewport at mount
    // (e.g. after a filter/tab swap), reveal it right away.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh - 40 && rect.bottom > 0) {
      el.classList.add("reveal-in");
      return;
    }
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
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-brand-whatsapp px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:brightness-95 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {children}
    </a>
  );
}

function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "light";
  className?: string;
}) {
  const isLight = variant === "light";
  return (
    <img
      src={isLight ? "/logo-footer.webp" : logoAsset.url}
      alt="Pisos do Bosque"
      width={isLight ? 2367 : 2730}
      height={isLight ? 738 : 655}
      className={`w-auto ${isLight ? "h-8 md:h-20" : "h-10 md:h-12"} ${className}`}
      loading="eager"
      decoding="async"
      fetchPriority={isLight ? undefined : "high"}
    />
  );
}




function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("top");

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

  const navItems: Array<{ href: string; label: string; disabled?: boolean }> = [
    { href: "#top", label: "Início" },
    { href: "#produtos", label: "Produtos" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#", label: "Seja nosso parceiro", disabled: true },
  ];


  // Scroll spy to highlight active nav item
  useEffect(() => {
    const ids = navItems.map((n) => n.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={`relative z-50 border-b bg-white transition-all duration-300 md:sticky md:top-0 ${
        scrolled ? "border-border/60 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("top");
          }}
          aria-label="Ir para o topo"
          className="transition-opacity duration-200 hover:opacity-80"
        >
          <Logo />
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-2 md:flex">
          {navItems.map((n) => {
            const isActive = !n.disabled && activeSection === n.href.slice(1);
            return (
              <a
                key={n.label}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (n.disabled) return;
                  smoothScrollTo(n.href);
                }}
                aria-disabled={n.disabled || undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-brand-orange/70"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {n.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco no WhatsApp"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-brand-green bg-transparent px-5 py-2.5 text-sm font-semibold text-brand-green transition-all duration-300 ease-out hover:bg-brand-green hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Fale Conosco no WhatsApp
          </a>
        </div>
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
        <nav className="flex flex-col px-5 py-4">
          {navItems.map((n) => (
            <a
              key={n.label}
              href={n.href}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                if (n.disabled) return;
                smoothScrollTo(n.href);
              }}
              aria-disabled={n.disabled || undefined}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-all duration-300 ease-in-out hover:bg-brand-cream hover:text-brand-orange"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const stats = usePlaceStats();
  return (
    <section id="top" className="relative overflow-hidden gradient-hero texture-dots-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-5 py-10 md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-8 md:py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <Reveal className="text-center text-white md:text-left">
          <div className="mb-6 flex items-center justify-center gap-2 md:justify-start md:mb-7">
            <div className="flex -space-x-1.5">
              {[avatar1.url, avatar2.url, avatar3.url].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-6 rounded-full border-2 border-white object-cover bg-brand-cream md:h-7 md:w-7"
                />
              ))}
            </div>
            <div className="rounded-full bg-white px-2 py-0.5 md:px-2.5 md:py-1">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground md:text-xs">
                <span className="font-bold text-brand-orange">G</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-current md:h-3 md:w-3" />
                  ))}
                </div>
                <span>{stats.ratingFormatted} · {stats.userRatingCountFormatted} avaliações</span>
              </div>
            </div>
          </div>
          <h1 className="font-display text-[2rem] font-bold leading-[1.1] [text-wrap:balance] md:text-[2.75rem] lg:text-[3.25rem]">
            Somos conhecidos por ter os{" "}
            <span className="font-extrabold">pisos mais baratos</span> da região!
          </h1>


          <p className="mx-auto mt-5 max-w-xl text-base text-white/95 md:mx-0 md:mt-6 md:text-lg">
            Estamos há mais de 20 anos no mercado porque oferecemos pisos e
            revestimentos com <strong>preço justo</strong>,{" "}
            <strong>entrega rápida</strong> e{" "}
            <strong>atendimento diferenciado.</strong>
          </p>
          <div className="mx-auto mt-6 w-full max-w-xs space-y-2.5 md:mx-0 md:mt-8 md:max-w-md md:space-y-3">
            {[
              { icon: DollarSign, label: "Menor Preço do Mercado" },
              { icon: Package, label: "Estoque Imediato" },
              { icon: Headphones, label: "Atendimento Personalizado" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-md bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:px-4 md:py-2.5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-whatsapp text-white md:h-9 md:w-9">
                  <Icon className="h-3.5 w-3.5 md:h-4.5 md:w-4.5" />
                </div>
                <span className="text-[13px] font-semibold text-foreground md:text-sm">{label}</span>
              </div>
            ))}
          </div>
          <WhatsAppButton
            ariaLabel="Fale conosco no WhatsApp"
            className="mx-auto mt-8 w-full max-w-xs py-4 text-base md:mx-0 md:max-w-md"
          >
            Fale Conosco no WhatsApp
          </WhatsAppButton>
        </Reveal>
        <Reveal delay={150} className="relative flex items-center justify-center self-center">
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl 2xl:translate-x-6">
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
              srcSet={`${heroVendedorMobile} 600w, ${heroVendedor} 900w`}
              sizes="(max-width: 767px) 240px, (max-width: 1023px) 320px, (max-width: 1279px) 448px, (max-width: 1535px) 512px, 640px"
              alt="Vendedor da Pisos do Bosque segurando placa de porcelanato"
              width={900}
              height={900}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full drop-shadow-2xl"
            />
          </div>
        </Reveal>



      </div>
    </section>
  );
}

function Stats() {
  const stats = usePlaceStats();
  const items = [
    { icon: Award, value: "20+", label: "Anos de mercado" },
    { icon: Users, value: stats.userRatingCountFormatted, label: "Avaliações no Google" },
    { icon: Package, value: "1000+", label: "Itens em estoque" },
    { icon: Truck, value: "Toda RS", label: "Entregamos na região" },
  ];
  return (
    <section className="border-y border-border bg-brand-cream py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4 md:gap-6 md:px-8">
        {items.map((it, i) => (
          <Reveal
            key={it.label}
            delay={i * 80}
            className="flex flex-col items-center gap-2 rounded-md border border-border/60 bg-white p-3 text-center shadow-sm md:flex-row md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0 md:text-left md:shadow-none"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange md:h-12 md:w-12">
              <it.icon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-tight text-brand-green md:text-2xl">
                {it.value}
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground md:text-xs">{it.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Consultar ${p.name} no WhatsApp`}
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-border/60 bg-muted">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col bg-[#F4F4F4] px-3 py-3 text-center sm:px-4">
        <h4 className="line-clamp-2 h-[2.4rem] overflow-hidden text-[13px] font-semibold leading-[1.2rem] text-foreground [text-wrap:balance] sm:h-[2.8rem] sm:text-[15px] sm:leading-[1.4rem]">
          {p.name}
        </h4>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
          {p.size}
        </p>

        <div className="mt-auto pt-2">
          <p className="whitespace-nowrap font-display text-[15px] font-bold leading-none text-brand-green sm:text-xl">
            {p.price}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-[11px]">
            em até 12x sem juros
          </p>

          <span
            className="mx-auto mt-2.5 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-brand-whatsapp px-2 py-2 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-brand-green-dark group-hover:shadow-md group-hover:brightness-105 sm:w-[85%] sm:px-3 sm:text-xs"
          >
            <WhatsAppIcon className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
            Quero este
          </span>
        </div>
      </div>




    </a>
  );
}

function PlaceholderCard() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar outros produtos no WhatsApp"
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
    >
      <div className="relative grid aspect-square place-items-center overflow-hidden border-b border-border/60 bg-brand-teal/10">
        <div className="flex flex-col items-center gap-2 text-brand-teal">
          <Plus className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-semibold">E muito mais</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-[#F4F4F4] px-3 py-3 text-center sm:px-4">
        <h4 className="line-clamp-2 h-[2.4rem] overflow-hidden text-[13px] font-semibold leading-[1.2rem] text-foreground [text-wrap:balance] sm:h-[2.8rem] sm:text-[15px] sm:leading-[1.4rem]">
          Consulte outras opções
        </h4>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
          Diversos modelos
        </p>

        <div className="mt-auto pt-2">
          <p className="whitespace-nowrap font-display text-[15px] font-bold leading-none text-brand-green sm:text-xl">
            Sob consulta
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-[11px]">
            fale com nosso time
          </p>

          <span className="mx-auto mt-2.5 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-brand-whatsapp px-2 py-2 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-brand-green-dark group-hover:shadow-md group-hover:brightness-105 sm:w-[85%] sm:px-3 sm:text-xs">
            <WhatsAppIcon className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
            Quero este
          </span>
        </div>
      </div>
    </a>
  );
}

function CategoryBlock({
  eyebrow,
  title,
  desc,
  image,
  products,
  bg,
  carousel = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  products: Product[];
  bg: string;
  carousel?: boolean;
}) {
  return (
    <div className={`mt-12 first:mt-12 rounded-2xl ${bg} p-6 md:p-10`}>
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
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-brand-green md:text-3xl">
            Piso em <span className="text-brand-orange">{title}</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">{desc}</p>

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
      {carousel ? (
        <ProductCarousel products={products} />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={i} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCarousel({
  products,
  hint = "Arraste para o lado para ver mais →",
}: {
  products: Product[];
  hint?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const originalCount = products.length;
  // Duplicate slides once to enable seamless forward-only looping.
  const loopedProducts = [...products, ...products];

  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const first = el.querySelector<HTMLElement>("[data-slide]");
    if (!first) return 0;
    const slideW = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return slideW + gap;
  }, []);

  // Track current slide index from scrollLeft
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const step = getStep();
      if (!step) return;
      const idx = Math.round(el.scrollLeft / step);
      setCurrent(idx % originalCount);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [getStep, originalCount]);

  // Custom eased smooth-scroll
  const animRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const animateTo = useCallback(
    (targetLeft: number, duration = 650, onComplete?: () => void) => {
      const el = scrollerRef.current;
      if (!el) return;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const start = el.scrollLeft;
      const max = el.scrollWidth - el.clientWidth;
      const to = Math.max(0, Math.min(max, targetLeft));
      const diff = to - start;
      if (Math.abs(diff) < 1) {
        if (onComplete) onComplete();
        return;
      }
      isAnimatingRef.current = true;
      const t0 = performance.now();
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        el.scrollLeft = start + diff * ease(p);
        if (p < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          isAnimatingRef.current = false;
          if (onComplete) onComplete();
        }
      };
      animRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const next = useCallback(() => {
    if (isAnimatingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const step = getStep();
    if (!step) return;
    const cur = currentRef.current;
    if (cur >= originalCount - 1) {
      // Animate into the cloned slot, then snap silently back to real start
      animateTo(step * originalCount, 650, () => {
        el.scrollLeft = 0;
        setCurrent(0);
      });
    } else {
      animateTo(step * (cur + 1), 650);
    }
  }, [animateTo, getStep, originalCount]);

  const prev = useCallback(() => {
    if (isAnimatingRef.current) return;
    const step = getStep();
    if (!step) return;
    const cur = currentRef.current;
    if (cur <= 0) return;
    animateTo(step * (cur - 1), 650);
  }, [animateTo, getStep]);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimatingRef.current) return;
      const step = getStep();
      if (!step) return;
      animateTo(step * idx, 650);
    },
    [animateTo, getStep]
  );

  // Autoplay
  useEffect(() => {
    if (paused || originalCount <= 1) return;
    const id = window.setInterval(() => {
      next();
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, originalCount, next]);

  // Pointer drag (mouse + touch fallback). Native touch scroll still works too.
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startScroll: number;
    moved: boolean;
    pointerId: number | null;
  }>({ active: false, startX: 0, startScroll: 0, moved: false, pointerId: null });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    isAnimatingRef.current = false;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      pointerId: e.pointerId,
    };
    try {
      el.setPointerCapture?.(e.pointerId);
    } catch {}
    setPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    if (e.pointerType !== "touch") {
      el.scrollLeft = s.startScroll - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) {
      setTimeout(() => setPaused(false), 400);
      return;
    }
    const el = scrollerRef.current;
    const wasMoved = s.moved;
    s.active = false;
    if (s.pointerId != null) {
      try {
        el?.releasePointerCapture?.(s.pointerId);
      } catch {}
    }
    if (el && wasMoved && e.pointerType !== "touch") {
      const step = getStep();
      if (step) {
        const idx = Math.round(el.scrollLeft / step);
        animateTo(step * idx, 400);
      }
    }
    // Suppress the click that fires after a drag on anchor children
    if (wasMoved) {
      const suppress = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      el?.addEventListener("click", suppress, { capture: true, once: true });
      setTimeout(() => el?.removeEventListener("click", suppress, true), 50);
    }
    setTimeout(() => setPaused(false), 400);
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">{hint}</p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Anterior"
            onClick={prev}
            disabled={current === 0}
            className="grid h-9 w-9 place-items-center rounded-full border border-brand-green/30 bg-white text-brand-green shadow-sm transition hover:bg-brand-green hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:h-10 md:w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={next}
            className="grid h-9 w-9 place-items-center rounded-full border border-brand-green/30 bg-white text-brand-green shadow-sm transition hover:bg-brand-green hover:text-white md:h-10 md:w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (dragState.current.active) endDrag(e);
        }}
        onDragStart={(e) => e.preventDefault()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="-mx-2 flex cursor-grab gap-4 overflow-x-auto px-2 pb-2 select-none active:cursor-grabbing sm:gap-6 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-y" }}
      >

        {loopedProducts.map((p, i) => (
          <div
            key={i}
            data-slide
            className="h-full w-[calc(50%-0.5rem)] shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
          >
            <ProductCard p={p} />
          </div>
        ))}
      </div>

      {originalCount > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: originalCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para item ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-brand-green" : "w-2 bg-brand-green/25 hover:bg-brand-green/50"
              }`}
            />
          ))}
        </div>
      )}
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

  let totalCount = 0;
  for (const c of filtered) totalCount += c.products.length;

  return (
    <section id="produtos" className="bg-white texture-dots-dark py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-bold [text-wrap:balance] leading-tight text-brand-green md:text-4xl">
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
          className="mx-auto mt-8 grid w-full max-w-md grid-cols-2 gap-1.5 rounded-2xl border border-border/70 bg-white p-1.5 shadow-sm sm:flex sm:max-w-none sm:w-auto sm:flex-wrap sm:justify-center sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
        >
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className={`relative rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors duration-300 ease-out sm:rounded-full sm:px-5 sm:text-sm ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-brand-green sm:border sm:border-border sm:bg-white sm:hover:border-brand-orange/40"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="products-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-brand-orange shadow-orange sm:rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-2 border-b border-border/70 pb-4 sm:flex-row sm:items-end">
          <h3 className="font-display text-xl font-bold leading-tight text-foreground md:text-2xl">
            Nossos Pisos e Revestimentos
          </h3>
          <p className="text-sm text-muted-foreground">
            Exibindo <span className="font-semibold text-foreground">{totalCount}</span>{" "}
            {totalCount === 1 ? "produto" : "produtos"}
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            {filtered.map((c) => (
              <CategoryBlock
                key={c.key}
                eyebrow={c.eyebrow}
                title={c.title}
                desc={c.desc}
                image={c.image}
                products={c.products}
                bg={c.bg}
                carousel={true}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

function MoreSolutions() {
  const solucoes: Product[] = [
    {
      img: solForro,
      name: "Forro de PVC",
      size: "PVC — 4, 5, 6 e 7 m",
      price: "R$ 24,90 m²",
    },
    {
      img: solLouca,
      name: "Louças e Metais",
      size: "Conjunto Acoplado Santa Clara",
      price: "R$ 449,90",
    },
    {
      img: solPorta,
      name: "Portas de Qualidade",
      size: "Porta Externa Mista",
      price: "R$ 579,90",
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-bold [text-wrap:balance] leading-tight text-brand-green md:text-4xl">
            Mais Soluções para Sua Obra ou Reforma
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Confira também nossa linha de forros, louças, metais e muito mais!
          </p>
        </Reveal>

        <div className="mt-12 rounded-2xl bg-brand-teal/10 p-6 md:p-10">
          <Reveal className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
                Complementos
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-brand-green md:text-3xl">
                Forro, Louças, Metais e Portas
              </h3>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-brand-green px-6 py-2.5 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
            >
              Ver Mais
            </a>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {solucoes.map((p, i) => (
              <ProductCard key={i} p={p} />
            ))}
            <PlaceholderCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section
      id="parceria"
      className="bg-brand-green-dark texture-dots-white py-16 text-white md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-bold text-white [text-wrap:balance] leading-tight md:text-4xl">
            Por Que a Pisos do Bosque é a Escolha Certa para Sua Obra?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Há anos ajudamos clientes como você a transformar obras em
            conquistas. Veja os benefícios que só a Pisos do Bosque oferece.
          </p>
        </Reveal>
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-white/10">
            <div className="px-4 py-4 text-center sm:px-6 sm:py-5">
              <p className="font-display text-sm font-semibold text-white/70 sm:text-base">
                Outras Lojas
              </p>
            </div>
            <div className="border-l border-white/10 px-4 py-4 text-center sm:px-6 sm:py-5">
              <p className="font-display text-sm font-semibold text-white sm:text-base">
                Pisos do Bosque
              </p>
            </div>
          </div>

          {/* Rows */}
          {compareRows.map((r, i) => (
            <div
              key={r.topic}
              className={i < compareRows.length - 1 ? "border-b border-white/10" : ""}
            >
              {/* Topic bar */}
              <Reveal
                delay={i * 60}
                className="bg-white/5 px-4 py-3 text-center sm:py-4"
              >
                <p className="font-display text-base font-semibold text-white sm:text-lg">
                  {r.topic}
                </p>
              </Reveal>

              <div className="grid grid-cols-2">
                <Reveal
                  delay={i * 60 + 20}
                  className="flex flex-col items-center gap-2 px-4 py-5 text-center sm:px-6 sm:py-6"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <X className="h-4 w-4 text-white/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/90 [text-wrap:balance] sm:text-base">
                    {r.bad}
                  </h3>
                  <p className="text-xs text-white/80 [text-wrap:balance] sm:text-sm">
                    {r.badDesc}
                  </p>
                </Reveal>
                <Reveal
                  delay={i * 60 + 40}
                  className="flex flex-col items-center gap-2 border-l border-white/10 px-4 py-5 text-center sm:px-6 sm:py-6"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white [text-wrap:balance] sm:text-base">
                    {r.good}
                  </h3>
                  <p className="text-xs text-white/80 [text-wrap:balance] sm:text-sm">
                    {r.goodDesc}
                  </p>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

type DisplayReview = {
  name: string;
  initial: string;
  text: string;
  relativeTime?: string;
  photoUrl?: string;
};

function ReviewAvatar({ review }: { review: DisplayReview }) {
  const [failed, setFailed] = useState(false);
  if (review.photoUrl && !failed) {
    return (
      <img
        src={review.photoUrl}
        alt={review.name}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-semibold text-white">
      {review.initial}
    </div>
  );
}

function ReviewCard({ r }: { r: DisplayReview }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-elegant">
      <Quote className="h-6 w-6 text-brand-orange/70" aria-hidden="true" />
      <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-muted-foreground md:line-clamp-4">
        {renderBold(r.text)}
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
        <ReviewAvatar review={r} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{r.name}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GoogleG className="h-3.5 w-3.5" /> Avaliação verificada
            {r.relativeTime ? ` · ${r.relativeTime}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function TestimonialsCarousel({ items }: { items: DisplayReview[] }) {
  const [isMobile, setIsMobile] = useState(true);
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const compute = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const perSlide = isMobile ? 2 : 6;
  const totalSlides = Math.ceil(items.length / perSlide);

  useEffect(() => {
    if (index >= totalSlides) setIndex(0);
  }, [index, totalSlides]);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || totalSlides <= 1) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setIndex((i) => (i >= totalSlides - 1 ? 0 : i + 1));
    }, 5000);
    return () => window.clearInterval(id);
  }, [totalSlides]);

  const pause = () => {
    pausedRef.current = true;
    window.setTimeout(() => (pausedRef.current = false), 8000);
  };

  const goTo = (i: number) => {
    pause();
    setIndex(Math.max(0, Math.min(totalSlides - 1, i)));
  };

  const slides = Array.from({ length: totalSlides }, (_, i) =>
    items.slice(i * perSlide, (i + 1) * perSlide),
  );

  const goPrev = () => goTo(index === 0 ? totalSlides - 1 : index - 1);
  const goNext = () => goTo(index >= totalSlides - 1 ? 0 : index + 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Avaliações de clientes"
      onPointerDown={pause}
    >
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {slides.map((slide, slideIdx) => (
            <div
              key={slideIdx}
              className="shrink-0 px-2"
              style={{ width: "100%" }}
              aria-roledescription="slide"
              aria-label={`${slideIdx + 1} de ${totalSlides}`}
            >
              <div
                className={`grid h-full ${
                  isMobile
                    ? "min-h-[520px] grid-cols-1 grid-rows-2 gap-4"
                    : "grid-cols-3 grid-rows-2 gap-4"
                }`}
              >
                {slide.map((r, i) => (
                  <div key={i} className="min-h-0">
                    <ReviewCard r={r} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {totalSlides > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Avaliações anteriores"
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-green shadow-lg ring-1 ring-black/5 transition-colors hover:bg-brand-green hover:text-white sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para grupo ${i + 1}`}
                className="group p-1.5 sm:p-3"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ease-in-out ${
                    i === index
                      ? "h-1.5 w-4 bg-brand-orange sm:h-2 sm:w-6"
                      : "h-1.5 w-1.5 bg-muted-foreground/40 group-hover:bg-muted-foreground/60 sm:h-2 sm:w-2"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Próximas avaliações"
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-green shadow-lg ring-1 ring-black/5 transition-colors hover:bg-brand-green hover:text-white sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      )}
    </div>
  );

}

function Testimonials() {
  const stats = usePlaceStats();
  const googleReviews: DisplayReview[] = stats.reviews.map((r) => ({
    name: r.author,
    initial: r.initial,
    text: r.text,
    relativeTime: r.relativeTime,
    photoUrl: r.photoUrl,
  }));
  const fallbackReviews: DisplayReview[] = reviews.map((r) => ({
    name: r.name,
    initial: r.initial,
    text: r.text,
  }));
  // Combine Google reviews (up to 5 from Places API) with curated fallbacks
  // so the carousel always has enough items to rotate beyond the visible slide.
  const seen = new Set(googleReviews.map((r) => r.name.toLowerCase()));
  const pool: DisplayReview[] = [
    ...googleReviews,
    ...fallbackReviews.filter((r) => !seen.has(r.name.toLowerCase())),
  ];
  // Pad to a multiple of 6 (desktop grid = 3x2) so the last slide fills completely.
  const padded: DisplayReview[] = [...pool];
  if (padded.length > 0) {
    const target = Math.max(18, Math.ceil(padded.length / 6) * 6);
    while (padded.length < target) padded.push(pool[padded.length % pool.length]);
  }
  const displayReviews: DisplayReview[] = padded;
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-bold [text-wrap:balance] leading-tight text-brand-green md:text-4xl">
            O Que Nossos Clientes Dizem Sobre Nós
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground [text-wrap:balance]">
            Mais de <strong>{stats.userRatingCountFormatted} clientes</strong> avaliaram nossa loja no Google. Veja o que dizem sobre atendimento, preço e qualidade.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span>
                <strong className="text-base">{stats.ratingFormatted}</strong> de 5
              </span>
              <GoogleG className="h-4 w-4" />
              <span className="text-muted-foreground">· {stats.userRatingCountFormatted} avaliações</span>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 md:mt-14">
          <TestimonialsCarousel items={displayReviews} />
        </div>

        <Reveal className="mt-10 text-center" delay={200}>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Pisos+do+Bosque&query_place_id=ChIJTyoE7NlzGZURHlAt9IQVcGE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline"
          >
            <GoogleG className="h-4 w-4" /> Ver todas as avaliações no Google
          </a>
        </Reveal>
      </div>
    </section>
  );
}


function AboutGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="relative flex flex-1 overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="aspect-[4/3] w-full bg-muted md:aspect-auto md:h-full md:min-h-0">
          {images.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i === active ? undefined : true}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver imagem ${i + 1}: ${img.alt}`}
            aria-pressed={i === active}
            className={`relative aspect-[4/3] w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-28 ${
              i === active
                ? "border-brand-orange shadow-md"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={img.src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {current?.alt}
      </span>
    </div>
  );
}

function About() {
  const showroomImages = [
    { src: storeFront, alt: "Fachada da loja Pisos do Bosque em Cachoeirinha" },
    { src: showroom1, alt: "Showroom com painéis de amostras de pisos" },
    { src: showroom2, alt: "Corredor principal do showroom Pisos do Bosque" },
    { src: showroom3, alt: "Área de louças sanitárias e boxes de banheiro" },
    { src: showroom4, alt: "Atendimento consultivo dentro da loja" },
    { src: showroom5, alt: "Ambiente de bancada e revestimentos premium" },
    { src: showroom6, alt: "Ambiente de exposição com pisos e revestimentos" },
    { src: showroom7, alt: "Vitrine de produtos e amostras da loja" },
    { src: showroom8, alt: "Área interna da loja Pisos do Bosque" },
  ];
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Pisos+do+Bosque&query_place_id=ChIJTyoE7NlzGZURHlAt9IQVcGE";

  return (
    <section id="sobre" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <Reveal className="text-center">
          <span className="inline-block rounded-md bg-brand-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
            Sobre Nós
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground [text-wrap:balance] md:text-4xl">
            Conheça Nossa História
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground [text-wrap:balance] md:text-lg">
            Há mais de 20 anos transformando ambientes com qualidade, confiança e
            preço justo em Cachoeirinha e região metropolitana.
          </p>
        </Reveal>

        {/* Main content */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-2 md:gap-12 md:items-stretch">
          {/* Left: story + value cards */}
          <Reveal className="flex h-full flex-col">
            <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <p className="text-foreground [text-wrap:balance] md:text-lg">
                A Pisos do Bosque nasceu com um propósito claro: oferecer
                materiais de qualidade com atendimento próximo e preços que
                cabem no bolso. Hoje, somos referência em pisos,
                porcelanatos, vinílicos, forros, louças e portas na região.
              </p>
              <p className="mt-4 text-muted-foreground">
                Nosso showroom em Cachoeirinha reúne o maior estoque da região,
                pronto para atender desde pequenas reformas até grandes obras.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Package,
                    title: "Maior estoque",
                    desc: "Materiais prontos para sua obra sem espera.",
                    color: "bg-brand-orange/10 text-brand-orange",
                  },
                  {
                    icon: Users,
                    title: "Equipe especializada",
                    desc: "Auxiliamos na escolha ideal para cada ambiente.",
                    color: "bg-brand-green/10 text-brand-green",
                  },
                  {
                    icon: Truck,
                    title: "Entrega rápida",
                    desc: "Prazos cumpridos para sua obra não parar.",
                    color: "bg-brand-green-teal/10 text-brand-green-teal",
                  },
                  {
                    icon: Headphones,
                    title: "Atendimento regional",
                    desc: "Levamos nossos produtos até você em toda a região.",
                    color: "bg-brand-orange/10 text-brand-orange",
                  },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: gallery + map */}
          <Reveal delay={150} className="flex h-full flex-col gap-6">
            <AboutGallery images={showroomImages} />

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <InteractiveMap
                mapsUrl={mapsUrl}
                className="block h-36 w-full border-0 md:h-32"
              />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-border bg-white p-3 text-sm font-semibold text-brand-green transition hover:bg-muted"
              >
                <MapPin className="h-5 w-5 text-brand-orange" />
                Abrir rota no Google Maps
              </a>
            </div>
          </Reveal>
        </div>

        {/* Info cards */}
        <Reveal delay={200}>
          <div className="mt-10 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-3 md:mt-14">
            {[
              {
                icon: MapPin,
                label: "Localização",
                text: "Av. Capitão Garibaldi Pinto dos Santos, 488 — Cachoeirinha/RS",
              },
              {
                icon: Phone,
                label: "Contato",
                text: "WhatsApp (51) 98490-5782",
              },
              {
                icon: Clock,
                label: "Horário",
                text: "Seg–Sex 8h–12h · 13h30–18h30\nSáb 8h–12h · 13h30–17h",
              },
            ].map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-xl bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 whitespace-pre-line text-sm text-muted-foreground">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={250}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:flex-row sm:text-left md:mt-10">
            <div className="flex-1">
              <p className="font-display text-lg font-bold text-foreground md:text-xl">
                Visite nossa loja ou fale com um consultor
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tire suas dúvidas, peça um orçamento ou agende uma visita ao showroom.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-whatsapp px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-green-teal hover:shadow-md sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Fale Conosco no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


function FAQ() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-bold [text-wrap:balance] leading-tight text-brand-green md:text-4xl">
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
                className="border-border last:border-b-0"
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

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile: accordion */}
      <details className="group border-b border-white/10 py-4 [&:last-of-type]:border-b-0 md:hidden [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white">
          <span>{title}</span>
          <svg
            className="h-4 w-4 text-white/60 transition-transform duration-300 group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>
        <div className="mt-4">{children}</div>
      </details>

      {/* Desktop: plain column */}
      <div className="hidden md:block">
        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
          {title}
        </h4>
        <div className="mt-3 h-0.5 w-8 bg-brand-orange" />
        <div className="mt-5">{children}</div>
      </div>
    </>
  );
}

function Footer() {
  const stats = usePlaceStats();
  const navLinks = [
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#produtos", label: "Produtos" },
    
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#faq", label: "Dúvidas Frequentes" },
  ];
  const categorias = [
    { href: "#produtos", label: "Cerâmica" },
    { href: "#produtos", label: "Porcelanato" },
    { href: "#produtos", label: "Vinílico" },
    { href: "#produtos", label: "Forros de PVC" },
    { href: "#produtos", label: "Louças & Metais" },
  ];

  const socials = (
    <div className="mt-6 flex gap-3 justify-center md:justify-start">
      <a
        href="https://www.instagram.com/pisosdobosque"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-brand-orange hover:bg-brand-orange hover:text-white"
      >
        <Instagram className="h-4 w-4" />
      </a>
      <a
        href="https://www.facebook.com/pisosdobosque"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-brand-orange hover:bg-brand-orange hover:text-white"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href="https://wa.me/5551984905782"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-brand-orange hover:bg-brand-orange hover:text-white"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>
    </div>
  );

  return (
    <footer className="bg-brand-green-dark texture-dots-white text-white/85">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 md:px-8">
        {/* Mobile: centered brand block */}
        <div className="flex flex-col items-center text-center md:hidden">
          <Logo variant="light" className="-ml-2" />
          <p className="mt-5 max-w-md text-sm text-white/70 [text-wrap:balance]">
            Há mais de 20 anos oferecendo pisos e revestimentos com preço justo
            em Cachoeirinha e região metropolitana.
          </p>
          {socials}
        </div>

        {/* Mobile divider */}
        <div className="mt-12 h-px w-full bg-white/10 md:hidden" />

        {/* Content grid — accordion on mobile, balanced 4 columns on desktop */}
        <div className="mt-8 md:mt-0 md:grid md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:gap-10 lg:gap-14">
          {/* Desktop brand column */}
          <div className="hidden md:flex md:flex-col md:items-start">
            <Logo variant="light" className="-ml-2" />
            <p className="mt-5 text-sm text-white/70 [text-wrap:balance]">
              Há mais de 20 anos oferecendo pisos e revestimentos com preço
              justo em Cachoeirinha e região metropolitana.
            </p>
            <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80">
              <span className="text-brand-orange">★★★★★</span>
              <span className="font-semibold text-white">{stats.ratingFormatted}</span>
              <span className="text-white/50">·</span>
              <span>{stats.userRatingCountFormatted} avaliações no Google</span>
            </div>
            <div className="mt-auto pt-6">{socials}</div>
          </div>

          <FooterColumn title="Navegação">
            <ul className="space-y-2.5 text-sm text-white/75">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition hover:text-brand-orange">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Categorias">
            <ul className="space-y-2.5 text-sm text-white/75">
              {categorias.map((c) => (
                <li key={c.label}>
                  <a href={c.href} className="transition hover:text-brand-orange">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contato">
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pisos+do+Bosque&query_place_id=ChIJTyoE7NlzGZURHlAt9IQVcGE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="[text-wrap:balance] transition hover:text-brand-orange"
                >
                  Av. Capitão Garibaldi Pinto dos Santos, 488
                  <br />
                  Jardim do Bosque — Cachoeirinha/RS
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-brand-orange" />
                <a
                  href="https://wa.me/5551984905782"
                  className="hover:text-brand-orange"
                >
                  (51) 98490-5782
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-orange" />
                <a
                  href="mailto:pisosdobosque2019@gmail.com"
                  className="break-all hover:text-brand-orange"
                >
                  pisosdobosque2019@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                <span>
                  Seg a Sex: 8h–12h · 13h30–18h30
                  <br />
                  Sábado: 8h–12h · 13h30–17h
                </span>
              </li>
            </ul>
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 pb-20 text-xs text-white/75 md:flex-row md:pb-0">
            <p className="text-center md:text-left">
              © 2027 Pisos do Bosque. Todos os direitos reservados.
            </p>
            <p className="text-center text-white/70 md:text-right">
              Comercio de Pisos do Bosque LTDA - 24.933.391/0001-65
            </p>
          </div>
        </div>
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
      className="pulse-ring fixed bottom-6 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-brand-whatsapp text-white shadow-xl transition hover:scale-110 md:flex"
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
      onClick={() => smoothScrollTo("top")}
      className={`fixed bottom-6 right-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full bg-brand-green text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md md:flex ${
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-lg backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <a
          href="tel:+5551984905782"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ligar para a loja Pisos do Bosque"
          onClick={() => {
            if (typeof window !== "undefined") {
              const w = window as unknown as { dataLayer?: unknown[] };
              w.dataLayer = w.dataLayer || [];
              w.dataLayer.push({
                event: "Ligou",
                cta_origin: "mobile_cta_bar",
                phone_number: "+5551984905782",
              });
            }
          }}
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
    <PlaceStatsProvider>
      <div className="min-h-screen bg-background font-sans">
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); smoothScrollTo("top"); }}
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

          <FAQ />
        </main>
        <Footer />

        <BackToTop />
        <MobileCTABar />
      </div>
    </PlaceStatsProvider>
  );
}
