type ReportMetric = number | null | undefined;

type ReportComparisonMetric = {
  current?: ReportMetric;
  previous?: ReportMetric;
  change_percent?: ReportMetric;
};

type MarketingReportInput = {
  periodLabel: string;
  campaignName: string;
  generatedAt?: string | null;
  spend: number;
  conversations: number;
  impressions: number;
  linkClicks: number;
  leads: number;
  comparison?: {
    spend?: ReportComparisonMetric;
    conversations?: ReportComparisonMetric;
    cost_per_conversation?: ReportComparisonMetric;
  } | null;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char] || char,
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value || 0);
}

function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

function trendHtml(
  label: string,
  metric?: ReportComparisonMetric,
  inverse = false,
) {
  const change = metric?.change_percent;
  if (typeof change !== "number" || !Number.isFinite(change)) return "";

  const improved = inverse ? change < 0 : change > 0;
  const neutral = change === 0;
  const className = neutral ? "trend neutral" : improved ? "trend good" : "trend bad";
  const arrow = neutral ? "—" : change > 0 ? "↑" : "↓";

  return `
    <div class="comparison-row">
      <span>${escapeHtml(label)}</span>
      <strong class="${className}">${arrow} ${formatPercent(Math.abs(change))}</strong>
    </div>
  `;
}

function buildFilename(periodLabel: string) {
  const cleaned = periodLabel
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 70);

  return `Relatorio_Pisos_do_Bosque_${cleaned || "Marketing"}`;
}

export function exportMarketingReportPdf(input: MarketingReportInput) {
  if (typeof window === "undefined") return;

  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    throw new Error("POPUP_BLOCKED");
  }

  try {
    reportWindow.opener = null;
  } catch {
    // Alguns navegadores não permitem alterar opener; segue normalmente.
  }

  const costPerConversation =
    input.conversations > 0 ? input.spend / input.conversations : 0;
  const ctr =
    input.impressions > 0 ? (input.linkClicks / input.impressions) * 100 : 0;
  const conversationRate =
    input.linkClicks > 0 ? (input.conversations / input.linkClicks) * 100 : 0;
  const costPerLead = input.leads > 0 ? input.spend / input.leads : 0;

  const generatedAt = input.generatedAt
    ? new Date(input.generatedAt)
    : new Date();

  const generatedAtText = generatedAt.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const title = buildFilename(input.periodLabel);
  const logoUrl = `${window.location.origin}/logo-pisos-do-bosque.webp`;

  const comparisons = input.comparison
    ? `
      <section class="section compact">
        <div class="section-heading">
          <div>
            <p class="eyebrow">COMPARAÇÃO</p>
            <h2>Em relação ao período anterior</h2>
          </div>
        </div>
        <div class="comparison-card">
          ${trendHtml("Investimento", input.comparison.spend)}
          ${trendHtml("Conversas iniciadas", input.comparison.conversations)}
          ${trendHtml(
            "Custo por conversa",
            input.comparison.cost_per_conversation,
            true,
          )}
        </div>
      </section>
    `
    : "";

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --green: #0b7f69;
      --green-dark: #076454;
      --cream: #fbf7ec;
      --orange: #ff7a00;
      --text: #172033;
      --muted: #667085;
      --line: #e7e7e2;
      --good: #0f8a5f;
      --bad: #d92d20;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: white;
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      padding: 28px 30px 24px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding-bottom: 18px;
      border-bottom: 2px solid var(--green);
    }

    .logo {
      width: 190px;
      height: auto;
      object-fit: contain;
    }

    .header-meta {
      text-align: right;
      font-size: 11px;
      line-height: 1.45;
      color: var(--muted);
    }

    .hero {
      margin-top: 22px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--line);
    }

    .hero-top {
      padding: 18px 20px;
      background: white;
    }

    .eyebrow {
      margin: 0 0 5px;
      color: var(--green);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .12em;
    }

    h1, h2, p { margin-top: 0; }
    h1 { margin-bottom: 7px; font-size: 26px; line-height: 1.15; }
    h2 { margin-bottom: 0; font-size: 17px; line-height: 1.25; }

    .sub {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    .summary {
      background: var(--green);
      color: white;
      padding: 18px 20px;
    }

    .summary p {
      margin: 0;
      font-size: 17px;
      line-height: 1.45;
      font-weight: 700;
    }

    .section {
      margin-top: 22px;
      break-inside: avoid;
    }

    .section.compact { margin-top: 18px; }

    .section-heading {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .metric-card {
      padding: 15px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: white;
      break-inside: avoid;
    }

    .metric-card.featured {
      background: #f2fbf7;
      border-color: #b9dfd4;
    }

    .metric-label {
      margin: 0 0 7px;
      color: var(--muted);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .06em;
    }

    .metric-value {
      margin: 0;
      font-size: 23px;
      line-height: 1;
      font-weight: 800;
    }

    .metric-desc {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.45;
    }

    .journey {
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr;
      align-items: center;
      gap: 12px;
      padding: 18px;
      border-radius: 12px;
      border: 1px solid var(--line);
    }

    .journey-step { text-align: center; }
    .journey-arrow { color: #9ed8ca; font-size: 24px; }
    .journey-label {
      color: var(--muted);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .05em;
    }
    .journey-value {
      margin-top: 4px;
      font-size: 22px;
      font-weight: 800;
    }
    .journey-note {
      margin-top: 4px;
      color: var(--muted);
      font-size: 9px;
      line-height: 1.35;
    }
    .journey-rate {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 7px;
      border-radius: 999px;
      background: #eef8f5;
      color: var(--green-dark);
      font-size: 8px;
      font-weight: 700;
    }

    .comparison-card {
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
    }

    .comparison-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 11px 14px;
      border-bottom: 1px solid var(--line);
      font-size: 11px;
    }

    .comparison-row:last-child { border-bottom: 0; }
    .trend.good { color: var(--good); }
    .trend.bad { color: var(--bad); }
    .trend.neutral { color: var(--muted); }

    .secondary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 9px;
      line-height: 1.5;
    }

    .footer strong { color: var(--text); }

    @page {
      size: A4;
      margin: 12mm;
    }

    @media print {
      body { background: white; }
      .page { max-width: none; padding: 0; }
    }

    @media (max-width: 620px) {
      .page { padding: 18px; }
      .header { align-items: flex-start; }
      .logo { width: 150px; }
      .metric-grid { grid-template-columns: 1fr; }
      .journey {
        grid-template-columns: 1fr;
        text-align: left;
      }
      .journey-arrow { transform: rotate(90deg); text-align: center; }
      .secondary-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <img class="logo" src="${logoUrl}" alt="Pisos do Bosque" />
      <div class="header-meta">
        <strong>Relatório de Marketing</strong><br />
        Gerado em ${escapeHtml(generatedAtText)}
      </div>
    </header>

    <section class="hero">
      <div class="hero-top">
        <p class="eyebrow">META ADS</p>
        <h1>Resultado dos anúncios</h1>
        <p class="sub">
          <strong>Período:</strong> ${escapeHtml(input.periodLabel)}<br />
          <strong>Campanha:</strong> ${escapeHtml(input.campaignName)}
        </p>
      </div>
      <div class="summary">
        <p>
          Com ${formatCurrency(input.spend)} investidos, os anúncios iniciaram
          ${formatNumber(input.conversations)} conversas, com custo médio de
          ${formatCurrency(costPerConversation)} por conversa.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">RESULTADOS PRINCIPAIS</p>
          <h2>Números do período</h2>
        </div>
      </div>
      <div class="metric-grid">
        <div class="metric-card">
          <p class="metric-label">INVESTIMENTO</p>
          <p class="metric-value">${formatCurrency(input.spend)}</p>
          <p class="metric-desc">Total investido em anúncios no período.</p>
        </div>
        <div class="metric-card featured">
          <p class="metric-label">CONVERSAS INICIADAS</p>
          <p class="metric-value">${formatNumber(input.conversations)}</p>
          <p class="metric-desc">Novas conversas atribuídas pela Meta aos anúncios.</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">CUSTO POR CONVERSA</p>
          <p class="metric-value">${formatCurrency(costPerConversation)}</p>
          <p class="metric-desc">Investimento médio necessário para iniciar uma conversa.</p>
        </div>
      </div>
    </section>

    ${comparisons}

    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">JORNADA DOS ANÚNCIOS</p>
          <h2>Do anúncio exibido à conversa iniciada</h2>
        </div>
      </div>

      <div class="journey">
        <div class="journey-step">
          <div class="journey-label">EXIBIÇÕES</div>
          <div class="journey-value">${formatNumber(input.impressions)}</div>
          <div class="journey-note">Anúncios exibidos</div>
        </div>

        <div class="journey-arrow">→</div>

        <div class="journey-step">
          <div class="journey-label">CLIQUES NO LINK</div>
          <div class="journey-value">${formatNumber(input.linkClicks)}</div>
          <div class="journey-note">Pessoas interessadas</div>
          <div class="journey-rate">${formatPercent(ctr)} das exibições</div>
        </div>

        <div class="journey-arrow">→</div>

        <div class="journey-step">
          <div class="journey-label">NOVAS CONVERSAS</div>
          <div class="journey-value">${formatNumber(input.conversations)}</div>
          <div class="journey-note">Contatos diretos iniciados</div>
          <div class="journey-rate">${formatPercent(conversationRate)} dos cliques</div>
        </div>
      </div>
    </section>

    <section class="section compact">
      <div class="section-heading">
        <div>
          <p class="eyebrow">OUTROS RESULTADOS</p>
          <h2>Conversões registradas pela Meta</h2>
        </div>
      </div>

      <div class="secondary-grid">
        <div class="metric-card">
          <p class="metric-label">OUTRAS CONVERSÕES</p>
          <p class="metric-value">${formatNumber(input.leads)}</p>
          <p class="metric-desc">Outras conversões que a Meta atribuiu aos anúncios no período.</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">CUSTO POR OUTRA CONVERSÃO</p>
          <p class="metric-value">${formatCurrency(costPerLead)}</p>
          <p class="metric-desc">Investimento médio por outra conversão atribuída.</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <strong>Pisos do Bosque</strong><br />
      Dados consultados da Meta Ads. Conversas e conversões seguem a atribuição
      informada pela própria plataforma. Relatório gerado em
      ${escapeHtml(generatedAtText)}.
    </footer>
  </main>

  <script>
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();
}
