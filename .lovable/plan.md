# Plano de Implementação: Dashboard de Marketing Meta Ads

Este plano detalha a criação de um dashboard privado para acompanhamento de métricas do Meta Ads, integrado ao Supabase e hospedado de forma estática no Cloudflare Pages.

## 1. Infraestrutura e Segurança (Supabase)

*   **Tabelas de Banco de Dados:**
    *   `meta_ads_daily`: Armazena métricas diárias por campanha.
    *   `meta_ads_sync_runs`: Histórico de sincronizações.
    *   `meta_ads_config`: Armazena configurações globais (ex: identificação do lead_action_type).
*   **Segurança (RLS):**
    *   Todas as tabelas terão RLS habilitado.
    *   Acesso restrito apenas a usuários autenticados com permissão (ex: via função `has_role` ou similar).
*   **Edge Functions:**
    *   `sync-meta-ads`: Faz o fetch na API do Meta e persiste no banco.
    *   `get-meta-dashboard`: Retorna dados agregados para o dashboard.
*   **Secrets:**
    *   Configuração dos segredos `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, etc., no Supabase via CLI/Dashboard Lovable.

## 2. Autenticação e Rotas

*   **Proteção de Rotas:**
    *   Criação de `/painel/login` (aberta).
    *   Criação de `/painel` (protegida via middleware do TanStack Router e Supabase Auth).
*   **SPA/SSG:**
    *   Atualização do `vite.config.ts` para incluir as novas rotas no pre-render.
    *   Garantia de que o fallback `404.html` (cópia do `index.html`) trate as rotas do painel corretamente no Cloudflare Pages.

## 3. Frontend (Dashboard)

*   **Design System:**
    *   Reuso estrito das cores (#FF6400, #6EC046), tipografia (Poppins) e tokens definidos no `src/styles.css`.
*   **Componentes:**
    *   `MarketingDashboard`: Container principal.
    *   `KPIGrid`: Cards de performance com indicadores de tendência.
    *   `PerformanceCharts`: Gráficos Recharts (Investimento, Leads, CPL).
    *   `CampaignTable`: Listagem detalhada por campanha.
    *   `SyncStatus`: Indicador de última atualização e botão "Atualizar Agora".

## 4. Integração Meta Ads

*   **Sincronização:**
    *   Modo "Normal" (últimos 7 dias) e "Backfill" (últimos 90 dias).
    *   Tratamento de Timezone (America/Sao_Paulo).
    *   Normalização de `leads` baseada nos `action_types` reais da conta.

## Detalhes Técnicos

*   **Frontend:** React 19 + TanStack Start (SPA mode) + Tailwind v4.
*   **Gráficos:** Recharts.
*   **Backend:** Supabase Auth + PostgreSQL + Edge Functions.
*   **Deploy:** GitHub -> Cloudflare Pages (Estático).

---
**Nota:** Nenhuma alteração nas páginas públicas, formulários ou rastreamento atual será realizada. A arquitetura atual de deploy estático será preservada através da configuração de fallback de rotas do lado do cliente.
