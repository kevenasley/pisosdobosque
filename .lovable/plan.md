# UX/UI Restructuring Plan for Marketing Dashboard

This plan details a complete visual overhaul of the marketing dashboard, focusing on clarity for a business owner while maintaining brand identity and technical integrity.

## User Objectives
- **Simplicity**: Understand performance in under 10 seconds.
- **Organization**: Clear separation between Meta Ads (default) and Google Ads (future).
- **UX Consistency**: Standardized formatting, humane language, and premium visual feel.

## Proposed Changes

### 1. Navigation & Layout
- **Header**: Simplified with Logo, Tab navigation (Meta Ads / Google Ads), and compact actions (Refresh, Logout).
- **Tabs**: Meta Ads as default; Google Ads showing "Google Ads ainda não conectado" state.
- **Layout**: Remove large vertical spacing; use high-density cards with light shadows and brand colors (Green/Orange).

### 2. Filters & Period Selector
- **Campaign Filter**: Unified visual unit; selecting a campaign filters all data (cards, charts, journey).
- **Period Selector**: Human-friendly options (Today, Yesterday, 7d, etc.).
- **Custom Range**: Popover with visual calendar (desktop) and support for single day or range.

### 3. KPI & Insights
- **Primary KPIs**: Three large cards (Investment, New Conversations, Cost per Conversation) with performance comparison (vs. previous period) and human descriptions.
- **Jornada dos Anúncios**: Horizontal flow (Desktop) / Vertical (Mobile) showing: Exibições -> Cliques -> Conversas. Remove site leads from this flow.
- **Attribution**: Separate section for "Other results attributed by Meta" with clear explanation and tooltips.

### 4. Visualization & Tables
- **Charts**: Single metric toggle (Conversas, Investimento, Custo por conversa). Standardized tooltips.
- **Detailed Tables**: Campaign performance and Daily History with "View details" to toggle secondary metrics (CTR, CPC).
- **Formatting**: Standardized currency (R$ 0,00), percentages (1 decimal max), and human dates.

### 5. Mobile Optimization
- **Hierarchy**: Priority to KPIs and Journey.
- **Touch-friendly**: Large filters and buttons.
- **Responsive**: 2x2 grids or vertical stacks to avoid horizontal scrolling.

## Technical Details
- **Styling**: Tailwind CSS using project-specific OKLCH/Hex tokens.
- **Components**: Framer Motion for transitions; Recharts for simplified charts.
- **Constraints**: No changes to API endpoints, authentication, or tracking logic.

## Safety & Validation
- **Auth**: Ensure Magic Link and `/painel/login` remain functional.
- **Data**: Verify all values use real Meta API data (no mocks).
- **Build**: Run static build to ensure Cloudflare compatibility.
