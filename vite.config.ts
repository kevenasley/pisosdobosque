// @lovable.dev/vite-tanstack-config já inclui os plugins base (tanstackStart,
// viteReact, tailwindcss, tsConfigPaths, aliases, env VITE_*). Não adicione-os
// manualmente.
//
// Build 100% ESTÁTICO (SSG/SPA) para Cloudflare Pages:
// - `nitro: false` remove o build de servidor/Edge (nada de _worker.js).
// - `spa.enabled` gera um shell HTML e a app roda inteira no navegador.
// - `prerender` gera index.html e /obrigado/index.html estáticos.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    prerender: { enabled: true, crawlLinks: false },
    pages: [{ path: "/" }, { path: "/obrigado" }, { path: "/painel" }, { path: "/painel/login" }],
  },
});

