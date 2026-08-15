# Plano de Implementação: Backend via Edge Functions para o Dashboard

O objetivo é migrar a lógica do dashboard de marketing de rotas de servidor TanStack para Edge Functions reais no backend (Lovable Cloud), garantindo que o frontend estático chame essas funções diretamente via cliente Supabase.

## Ações imediatas
- Remover as rotas de API TanStack `/api/dashboard/*` que serviam de ponte.
- Criar e implantar as Edge Functions `get-meta-dashboard` e `sync-meta-ads` no Lovable Cloud.
- Atualizar o componente `MarketingDashboard.tsx` para usar `supabase.functions.invoke`.

## Detalhes técnicos
- **Edge Functions:**
  - `get-meta-dashboard`: Valida o JWT do usuário, consulta as tabelas `meta_ads_daily` e `meta_ads_sync_runs` usando o cliente Supabase da função (que respeita RLS ou usa service role dependendo da necessidade, mas aqui deve respeitar a autenticação do usuário).
  - `sync-meta-ads`: Valida o JWT, verifica a presença dos Secrets da Meta e retorna "Meta Ads ainda não configurado" enquanto não existirem.
- **Frontend:**
  - Substituir as chamadas `fetch('/api/dashboard/...')` por `supabase.functions.invoke('...')`.
  - Garantir que o estado de carregamento e erros (como `CONFIG_MISSING`) sejam tratados corretamente.
- **Segurança:**
  - Ambas as funções exigirão um token de autorização válido.
  - A verificação de Secrets da Meta será feita via `Deno.env.get` dentro das Edge Functions.

## Passos de verificação
- Executar `supabase--deploy_edge_functions` para as duas novas funções.
- Testar a chamada via frontend (simulação ou inspeção de código) para confirmar o uso do cliente Supabase.
- Confirmar a remoção do diretório `src/routes/api/dashboard/`.
