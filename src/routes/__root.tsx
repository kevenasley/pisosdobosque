import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { captureAttribution } from "../lib/attribution";
import { LeadCapture, openLeadCapture } from "../components/lead/LeadCapture";
import { ConsentBanner } from "../components/ConsentBanner";
import { GTM_ID } from "../lib/config";

const consentModeScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied',
  ad_personalization: 'denied', analytics_storage: 'denied',
  region: ['EEA','GB','CH']
});
gtag('consent', 'default', {
  ad_storage: 'granted', ad_user_data: 'granted',
  ad_personalization: 'granted', analytics_storage: 'granted'
});
gtag('set', 'ads_data_redaction', true);
`;

const gtmScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Pisos do Bosque" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Pisos do Bosque — Pisos e Revestimentos com Preço Justo em Cachoeirinha/RS" },
      { property: "og:title", content: "Pisos do Bosque — Pisos e Revestimentos com Preço Justo em Cachoeirinha/RS" },
      { name: "twitter:title", content: "Pisos do Bosque — Pisos e Revestimentos com Preço Justo em Cachoeirinha/RS" },
      { name: "description", content: "Há mais de 20 anos oferecendo os pisos mais baratos da região. Cerâmica, porcelanato, vinílicos, forro, louças e portas com preço justo, estoque imediato e atendimento personalizado em Cachoeirinha/RS." },
      { property: "og:description", content: "Há mais de 20 anos oferecendo os pisos mais baratos da região. Cerâmica, porcelanato, vinílicos, forro, louças e portas com preço justo, estoque imediato e atendimento personalizado em Cachoeirinha/RS." },
      { name: "twitter:description", content: "Há mais de 20 anos oferecendo os pisos mais baratos da região. Cerâmica, porcelanato, vinílicos, forro, louças e portas com preço justo, estoque imediato e atendimento personalizado em Cachoeirinha/RS." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [
      { children: consentModeScript },
      { children: gtmScript },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    // Intercepta cliques em links do WhatsApp para abrir modal de captura.
    // Permite bypass com data-lead-bypass, tecla modificadora ou na página de obrigado.
    function onClick(ev: MouseEvent) {
      const target = (ev.target as HTMLElement | null)?.closest?.(
        'a[href*="wa.me/"], a[href*="api.whatsapp.com/send"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      if (target.dataset.leadBypass === "true") return;
      if (window.location.pathname.startsWith("/obrigado")) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      const ctaOrigin =
        target.dataset.ctaOrigin ||
        target.getAttribute("aria-label") ||
        target.textContent?.trim().slice(0, 40) ||
        "whatsapp_link";
      openLeadCapture({ ctaOrigin });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    let destroyed = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      let rafId = 0;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      cleanup = () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    })();
    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <LeadCapture />
      <ConsentBanner />
    </QueryClientProvider>
  );
}
