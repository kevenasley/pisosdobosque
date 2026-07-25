import { createFileRoute } from "@tanstack/react-router";
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
  TreePine,
} from "lucide-react";

import heroVendedor from "@/assets/hero-vendedor.jpg";
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
      {
        property: "og:title",
        content: "Pisos do Bosque — Pisos e Revestimentos com Preço Justo",
      },
      {
        property: "og:description",
        content:
          "Os pisos mais baratos da região metropolitana de Porto Alegre. Cerâmica, porcelanato, vinílicos e muito mais.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Pisos do Bosque" },
      {
        name: "twitter:description",
        content:
          "Pisos e revestimentos com preço justo, entrega rápida e atendimento diferenciado.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Pisos do Bosque",
          image: "/favicon.ico",
          telephone: "+555134701212",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Capitão Garibaldi Pinto dos Santos, 468",
            addressLocality: "Cachoeirinha",
            addressRegion: "RS",
            addressCountry: "BR",
          },
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

/* ------------ COMPONENTS ------------ */

function WhatsAppButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-whatsapp px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-95 ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      {children}
    </a>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green">
        <TreePine className="h-6 w-6 text-brand-orange" />
      </div>
      <span className="font-display text-lg font-bold text-brand-green">
        pisos do <span className="text-brand-orange">Bosque</span>
      </span>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="#top"><Logo /></a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#top" className="text-sm font-medium text-foreground hover:text-brand-orange">Início</a>
          <a href="#produtos" className="text-sm font-medium text-foreground hover:text-brand-orange">Produtos</a>
          <a href="#sobre" className="text-sm font-medium text-foreground hover:text-brand-orange">Sobre Nós</a>
          <a href="#parceria" className="text-sm font-medium text-foreground hover:text-brand-orange">Parceria</a>
        </nav>
        <WhatsAppButton className="hidden text-sm md:inline-flex">Fale Conosco no WhatsApp</WhatsAppButton>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-orange">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-6 md:px-8 md:py-20">
        <div className="text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-brand-cream" />
              ))}
            </div>
            <div className="rounded-full bg-white px-3 py-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <span className="font-bold text-brand-orange">G</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span>+1950 avaliações</span>
              </div>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Somos conhecidos por ter os pisos mais baratos da região!
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/95">
            Estamos há mais de 20 anos no mercado porque oferecemos pisos e revestimentos com{" "}
            <strong>preço justo</strong>, <strong>entrega rápida</strong> e{" "}
            <strong>atendimento diferenciado.</strong>
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: DollarSign, label: "Menor Preço do Mercado" },
              { icon: Package, label: "Estoque Imediato" },
              { icon: Headphones, label: "Atendimento Personalizado" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-whatsapp text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>
          <WhatsAppButton className="mt-8 w-full py-4 text-base md:w-auto">
            Fale Conosco no WhatsApp
          </WhatsAppButton>
        </div>
        <div className="relative">
          <img
            src={heroVendedor}
            alt="Vendedor da Pisos do Bosque segurando placa de porcelanato"
            width={1200}
            height={1200}
            className="mx-auto w-full max-w-lg drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{p.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{p.size}</p>
        <p className="mt-2 text-lg font-bold text-brand-orange">{p.price}</p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
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
        <div className="overflow-hidden rounded-2xl">
          <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-orange">{eyebrow}</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-brand-green md:text-4xl">
            Piso em <span className="text-brand-orange">{title}</span>
          </h3>
          <p className="mt-4 text-muted-foreground">{desc}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-2.5 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
          >
            Ver Mais
          </a>
        </div>
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
  return (
    <section id="produtos" className="bg-brand-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-5xl">
            Pisos e Revestimentos de Qualidade, em um Só Lugar!
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Transforme sua casa ou projeto com produtos de alta qualidade, preços competitivos e entrega garantida no prazo.
          </p>
        </div>
        <CategoryBlock
          eyebrow="Categoria"
          title="Cerâmica"
          desc="Revestimentos cerâmicos: praticidade, resistência e elegância para sua cozinha, banheiro ou área externa. Opções incríveis com preços que cabem no seu bolso, só na Pisos do Bosque!"
          image={catCeramica}
          products={ceramica}
        />
        <CategoryBlock
          eyebrow="Categoria"
          title="Porcelanato"
          desc="Beleza, resistência e fácil manutenção para qualquer ambiente. Alta qualidade e preços incríveis, só na Pisos do Bosque."
          image={catPorcelanato}
          products={porcelanato}
        />
        <CategoryBlock
          eyebrow="Categoria"
          title="Vinílicos"
          desc="Conforto, sofisticação e praticidade. Ideal para quartos, salas e escritórios com aparência de madeira e instalação rápida."
          image={catVinilico}
          products={vinilicos}
        />
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
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            Mais Soluções para Sua Obra ou Reforma
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Confira também nossa linha de forros, louças, metais e muito mais!
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={it.img} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-brand-green">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                <div className="mt-4 rounded-lg bg-brand-cream p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">Promoção</p>
                  <p className="mt-1 font-semibold text-foreground">{it.spec}</p>
                  <p className="mt-1 text-2xl font-bold text-brand-orange">{it.price}</p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-whatsapp px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section id="parceria" className="bg-brand-green py-16 text-white md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Por Que a Pisos do Bosque é a Escolha Certa para Sua Obra?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Há anos ajudamos clientes como você a transformar obras em conquistas. Veja os benefícios que só a Pisos do Bosque oferece.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="hidden text-center font-semibold uppercase tracking-wide text-white/70 md:block">Outros</div>
          <div className="hidden text-center font-semibold uppercase tracking-wide text-brand-orange md:block">Pisos do Bosque</div>
          {compareRows.map((r) => (
            <>
              <div key={r.bad} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <X className="h-5 w-5 text-red-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60 md:hidden">Outros</p>
                    <h4 className="font-semibold text-white">{r.bad}</h4>
                    <p className="mt-1 text-sm text-white/70">{r.badDesc}</p>
                  </div>
                </div>
              </div>
              <div key={r.good} className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange md:hidden">Pisos do Bosque</p>
                    <h4 className="font-semibold text-white">{r.good}</h4>
                    <p className="mt-1 text-sm text-white/80">{r.goodDesc}</p>
                  </div>
                </div>
              </div>
            </>
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
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            O Que Nossos Clientes Dizem Sobre Nós
          </h2>
          <p className="mt-3 text-muted-foreground">
            <strong>Mais de 1.200 avaliações positivas</strong> comprovam nosso compromisso com qualidade e atendimento.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand-cream px-5 py-2.5">
            <span className="text-2xl font-bold text-foreground">4.8</span>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">2.171 Avaliações</span>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground">"{r.text}"</p>
              <p className="mt-4 text-sm font-semibold text-brand-green">— {r.name}</p>
            </div>
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
        <div>
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            Conheça Nossa História
          </h2>
          <p className="mt-4 italic text-muted-foreground">
            Há mais de 20 anos, a Pisos do Bosque vem transformando ambientes com qualidade e confiança. Situados em Cachoeirinha, atendemos Porto Alegre e toda a região metropolitana, oferecendo um estoque completo para sua obra ou reforma.
          </p>
          <p className="mt-6 font-semibold text-foreground">Motivos pelos quais somos referência na região:</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {[
              ["Maior estoque da região:", "sempre preparados para suprir sua obra com prontidão."],
              ["Equipe especializada:", "profissionais prontos para auxiliar você na escolha ideal."],
              ["Compromisso com prazos:", "entrega rápida para garantir que sua obra não pare."],
              ["Atendimento abrangente:", "levamos nossos produtos até você em toda a região."],
            ].map(([b, t]) => (
              <li key={b} className="flex gap-2">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <span><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <p className="flex items-center gap-2 font-semibold text-brand-green"><MapPin className="h-4 w-4" /> Localização</p>
              <p className="mt-1 text-muted-foreground">Av. Capitão Garibaldi Pinto dos Santos, 468 — Jardim do Bosque, Cachoeirinha/RS</p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <p className="flex items-center gap-2 font-semibold text-brand-green"><Phone className="h-4 w-4" /> Contato</p>
              <p className="mt-1 text-muted-foreground">WhatsApp: (51) 98490-5782<br />Telefone: (51) 3470-1212</p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-sm sm:col-span-2">
              <p className="flex items-center gap-2 font-semibold text-brand-green"><Clock className="h-4 w-4" /> Horário</p>
              <p className="mt-1 text-muted-foreground">Seg. a Sex.: 8h–12h e 13h30–18h30 · Sáb.: 8h–12h e 13h30–17h</p>
            </div>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Av.+Capit%C3%A3o+Garibaldi+Pinto+dos+Santos+468+Cachoeirinha+RS"
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-2xl shadow-lg"
        >
          <img src={storeFront} alt="Fachada da loja Pisos do Bosque" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        </a>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-green md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-muted-foreground">Tire suas dúvidas rapidamente.</p>
        </div>
        <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card p-2 shadow-sm">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="px-4 text-left font-semibold text-foreground hover:text-brand-orange hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-green-dark py-14 text-white/90">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-3 md:px-8">
        <div>
          <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white">Contato</h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-brand-orange" /> (51) 98490-5782</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-orange" /> pisosdobosque2019@gmail.com</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" /><span>Segunda a sexta: 8h às 12h e 13h30 às 18h30<br />Sábado: 8h às 12h e 13h30 às 17h</span></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" /><span>Av. Capitão Garibaldi Pinto dos Santos, 468 — Jardim do Bosque, Cachoeirinha, RS</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white">Navegação</h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <ul className="mt-5 space-y-2 text-sm">
            <li><a href="#sobre" className="hover:text-brand-orange">Sobre Nós</a></li>
            <li><a href="#produtos" className="hover:text-brand-orange">Produtos</a></li>
          </ul>
          <h4 className="mt-8 font-display text-lg font-bold uppercase tracking-wider text-white">Nossas Redes</h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-brand-orange hover:text-brand-orange"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-brand-orange hover:text-brand-orange"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white">Políticas</h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <ul className="mt-5 space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-orange">Política de privacidade</a></li>
            <li><a href="#" className="hover:text-brand-orange">Termos de uso</a></li>
          </ul>
          <h4 className="mt-8 font-display text-lg font-bold uppercase tracking-wider text-white">Visite nossa loja</h4>
          <div className="mt-1 h-1 w-10 bg-brand-orange" />
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+Capit%C3%A3o+Garibaldi+Pinto+dos+Santos+468+Cachoeirinha+RS"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block overflow-hidden rounded-lg border border-white/20"
          >
            <img src={storeFront} alt="Mapa da loja" loading="lazy" className="h-28 w-full object-cover" />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-white/10 px-4 pt-6 text-xs text-white/60 md:flex-row md:px-8">
        <span>Copyright © 2025 Pisos do Bosque. Todos os direitos reservados.</span>
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
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-whatsapp text-white shadow-xl transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <Hero />
        <Products />
        <MoreSolutions />
        <Comparison />
        <Testimonials />
        <About />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
