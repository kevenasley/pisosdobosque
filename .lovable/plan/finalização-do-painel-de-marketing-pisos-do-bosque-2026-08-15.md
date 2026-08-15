# Finalização do Painel de Marketing - Pisos do Bosque

Implementação do dashboard funcional conectado à Meta Marketing API via Cloudflare Pages Functions, focado em KPIs comerciais para a proprietária.

## Mudanças no Backend (Cloudflare Pages Functions)

### 1. Novo Endpoint: `functions/api/meta/dashboard.js`
- **Autenticação**: Protegido por `_middleware.js` (JWT Supabase).
- **Parâmetros**: `from` e `to` (YYYY-MM-DD), limite de 90 dias.
- **Integração Meta**:
    - Consulta `act_{ID}/insights` (nível campanha, time_increment=1).
    - Métricas: `spend`, `impressions`, `actions`.
    - Paginação interna automática.
- **Métricas Reais**:
    - **Conversas**: `onsite_conversion.messaging_conversation_started_7d`.
    - **Cliques no link**: `link_click`.
    - **Leads**: `lead`.
- **Processamento**:
    - Agregação por campanha e diária.
    - Comparação com período anterior (mesmo número de dias).
    - Timezone: `America/Sao_Paulo`.
    - Reach e Frequency removidos.

## Mudanças no Frontend (`src/components/dashboard/MarketingDashboard.tsx`)

### 1. Gestão de Estado e Dados
- Integração com `/api/meta/dashboard` usando o helper `callMetaApi`.
- Período padrão: Últimos 7 dias (incluindo hoje).
- Filtros funcionais: Hoje, Ontem, 7d, 14d, 30d, Este mês, Mês anterior, Personalizado.

### 2. Interface e KPIs
- **Cabeçalho**: Logo, Título "Painel de Marketing", "Última consulta" e Botão "Atualizar Agora".
- **Hierarquia de KPIs**:
    - **Linha 1**: Investimento, Conversas, Custo por Conversa.
    - **Linha 2**: Impressões, Cliques no link, CTR, CPC.
    - **Linha 3**: Leads, CPL (Conversões atribuídas).
- **Indicadores de Tendência**:
    - Cores interpretativas (Verde = CPL caiu / Conversas subiram; Vermelho = CPL subiu / Conversas caíram).
    - Investimento e Impressões com indicadores neutros.
- **Resumo do Período**: Insights matemáticos automáticos.

### 3. Visualização e Tabelas
- **Gráficos (Recharts)**:
    - Investimento x Conversas.
    - Custo por conversa.
    - Cliques e CTR.
- **Tabelas**:
    - Desempenho por campanha (ordenável por investimento).
    - Detalhamento diário (recolhível).
- **Feedback**: Skeletons para loading, toasts para erros, aviso de "dados de hoje em processamento".

### 4. Limpeza e Refatoração
- Remoção completa do bloco e botão de diagnóstico técnico.
- Refatoração do `DiagnosisBlock` e estados relacionados.

## Detalhes Técnicos
- **Moeda**: pt-BR (R$).
- **Casas Decimais**: 2 para monetário/CPC/CPL, 1 para percentual.
- **Métricas ausentes**: 0 para totais, `null` para razões (ex: spend/0).
- **Segurança**: Secrets mantidos no backend, Supabase Auth via headers.
