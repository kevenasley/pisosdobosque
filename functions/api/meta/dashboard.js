const LATEST_GRAPH_API_VERSION = "v26.0";

function resolveGraphApiVersion(value) {
  const match = /^v(\d+)\.0$/.exec(String(value || ""));
  const major = match ? Number(match[1]) : 0;

  // v20.0 expired on 2026-09-24. If Cloudflare still has that old
  // environment value configured, ignore it instead of silently using it.
  return major >= 21 ? String(value) : LATEST_GRAPH_API_VERSION;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function onRequest(context) {
  const { request, env } = context;

  const META_ACCESS_TOKEN = env.META_ACCESS_TOKEN;
  const META_AD_ACCOUNT_ID = env.META_AD_ACCOUNT_ID;
  const META_GRAPH_API_VERSION = resolveGraphApiVersion(env.META_GRAPH_API_VERSION);

  if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
    return json({ success: false, error: "CONFIG_MISSING" }, 500);
  }

  const url = new URL(request.url);
  const preset = url.searchParams.get("preset");
  const isMaximum = preset === "maximum";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const fromDate = isMaximum ? null : parseDate(from);
  const toDate = isMaximum ? null : parseDate(to);

  if (!isMaximum && (!fromDate || !toDate)) {
    return json({ success: false, error: "INVALID_DATE_FORMAT" }, 400);
  }

  if (!isMaximum && toDate < fromDate) {
    return json({ success: false, error: "INVALID_DATE_RANGE" }, 400);
  }

  const diffDays = isMaximum
    ? null
    : Math.floor((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;

  // O período personalizado pode ser longo; mantemos apenas um limite de
  // segurança. Para todo o histórico, o frontend usa preset=maximum.
  if (!isMaximum && diffDays > 3660) {
    return json({ success: false, error: "RANGE_TOO_LARGE" }, 400);
  }

  async function fetchMetaInsights({ since, until, maximum = false }) {
    const params = new URLSearchParams({
      level: "campaign",
      fields:
        "date_start,date_stop,campaign_id,campaign_name,spend,impressions,actions",
      limit: "100",
    });

    if (maximum) {
      params.set("date_preset", "maximum");
    } else {
      params.set("time_range", JSON.stringify({ since, until }));

      // A granularidade diária é útil em períodos curtos. Em intervalos longos
      // agregamos por campanha para evitar milhares de linhas desnecessárias.
      const days =
        Math.floor(
          (parseDate(until).getTime() - parseDate(since).getTime()) / 86400000,
        ) + 1;
      if (days <= 90) {
        params.set("time_increment", "1");
      }
    }

    let allData = [];
    let nextUrl =
      `https://graph.facebook.com/${META_GRAPH_API_VERSION}/act_${META_AD_ACCOUNT_ID}/insights?${params.toString()}`;

    let pageCount = 0;
    const maxPages = 100;

    while (nextUrl && pageCount < maxPages) {
      const response = await fetch(nextUrl, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          "Cache-Control": "no-cache",
        },
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        const message =
          result?.error?.message ||
          `Meta API HTTP ${response.status}`;
        throw new Error(message);
      }

      allData = allData.concat(Array.isArray(result.data) ? result.data : []);
      nextUrl = result.paging?.next || null;
      pageCount += 1;
    }

    if (nextUrl) {
      throw new Error("META_PAGINATION_LIMIT_REACHED");
    }

    return allData;
  }

  let prevFrom = null;
  let prevTo = null;

  if (!isMaximum) {
    const prevToDate = new Date(fromDate);
    prevToDate.setUTCDate(prevToDate.getUTCDate() - 1);

    const prevFromDate = new Date(prevToDate);
    prevFromDate.setUTCDate(prevFromDate.getUTCDate() - (diffDays - 1));

    prevFrom = prevFromDate.toISOString().slice(0, 10);
    prevTo = prevToDate.toISOString().slice(0, 10);
  }

  try {
    const currentPromise = isMaximum
      ? fetchMetaInsights({ maximum: true })
      : fetchMetaInsights({ since: from, until: to });

    const previousPromise = isMaximum
      ? Promise.resolve([])
      : fetchMetaInsights({ since: prevFrom, until: prevTo });

    const [currentRaw, previousRaw] = await Promise.all([
      currentPromise,
      previousPromise,
    ]);

    const processData = (raw) => {
      const dailyMap = {};
      const campaignMap = {};

      let totalSpend = 0;
      let totalImpressions = 0;
      let totalConversations = 0;
      let totalLinkClicks = 0;
      let totalLeads = 0;

      raw.forEach((item) => {
        const spend = Number(item.spend) || 0;
        const impressions = Number(item.impressions) || 0;

        let conversations = 0;
        let linkClicks = 0;
        let leads = 0;

        if (Array.isArray(item.actions)) {
          item.actions.forEach((action) => {
            const value = Number(action.value) || 0;

            if (
              action.action_type ===
              "onsite_conversion.messaging_conversation_started_7d"
            ) {
              conversations += value;
            }

            if (action.action_type === "link_click") {
              linkClicks += value;
            }

            if (action.action_type === "lead") {
              leads += value;
            }
          });
        }

        totalSpend += spend;
        totalImpressions += impressions;
        totalConversations += conversations;
        totalLinkClicks += linkClicks;
        totalLeads += leads;

        const day = item.date_start;
        if (!dailyMap[day]) {
          dailyMap[day] = {
            date: day,
            spend: 0,
            impressions: 0,
            conversations: 0,
            link_clicks: 0,
            leads: 0,
          };
        }

        dailyMap[day].spend += spend;
        dailyMap[day].impressions += impressions;
        dailyMap[day].conversations += conversations;
        dailyMap[day].link_clicks += linkClicks;
        dailyMap[day].leads += leads;

        const campaignId = String(item.campaign_id || "");
        if (!campaignMap[campaignId]) {
          campaignMap[campaignId] = {
            campaign_id: campaignId,
            campaign_name: item.campaign_name || "Campanha sem nome",
            spend: 0,
            impressions: 0,
            conversations: 0,
            link_clicks: 0,
            leads: 0,
          };
        }

        campaignMap[campaignId].spend += spend;
        campaignMap[campaignId].impressions += impressions;
        campaignMap[campaignId].conversations += conversations;
        campaignMap[campaignId].link_clicks += linkClicks;
        campaignMap[campaignId].leads += leads;
      });

      const finalizeItem = (obj) => ({
        ...obj,
        cost_per_conversation:
          obj.conversations > 0 ? obj.spend / obj.conversations : null,
        link_ctr:
          obj.impressions > 0
            ? (obj.link_clicks / obj.impressions) * 100
            : null,
        link_cpc:
          obj.link_clicks > 0 ? obj.spend / obj.link_clicks : null,
        cpl: obj.leads > 0 ? obj.spend / obj.leads : null,
      });

      return {
        totals: finalizeItem({
          spend: totalSpend,
          impressions: totalImpressions,
          conversations: totalConversations,
          link_clicks: totalLinkClicks,
          leads: totalLeads,
        }),
        daily: Object.values(dailyMap)
          .map(finalizeItem)
          .sort((a, b) => a.date.localeCompare(b.date)),
        campaigns: Object.values(campaignMap)
          .map(finalizeItem)
          .sort((a, b) => b.spend - a.spend),
      };
    };

    const current = processData(currentRaw);
    const previous = processData(previousRaw);

    const calculateChange = (curr, prev) => {
      if (
        curr === null ||
        curr === undefined ||
        prev === null ||
        prev === undefined ||
        prev === 0
      ) {
        return null;
      }

      return ((curr - prev) / prev) * 100;
    };

    const comparison = {
      spend: {
        current: current.totals.spend,
        previous: previous.totals.spend,
        change_percent: calculateChange(
          current.totals.spend,
          previous.totals.spend,
        ),
      },
      conversations: {
        current: current.totals.conversations,
        previous: previous.totals.conversations,
        change_percent: calculateChange(
          current.totals.conversations,
          previous.totals.conversations,
        ),
      },
      cost_per_conversation: {
        current: current.totals.cost_per_conversation,
        previous: previous.totals.cost_per_conversation,
        change_percent: calculateChange(
          current.totals.cost_per_conversation,
          previous.totals.cost_per_conversation,
        ),
      },
      impressions: {
        current: current.totals.impressions,
        previous: previous.totals.impressions,
        change_percent: calculateChange(
          current.totals.impressions,
          previous.totals.impressions,
        ),
      },
      link_clicks: {
        current: current.totals.link_clicks,
        previous: previous.totals.link_clicks,
        change_percent: calculateChange(
          current.totals.link_clicks,
          previous.totals.link_clicks,
        ),
      },
      link_ctr: {
        current: current.totals.link_ctr,
        previous: previous.totals.link_ctr,
        change_percent: calculateChange(
          current.totals.link_ctr,
          previous.totals.link_ctr,
        ),
      },
      link_cpc: {
        current: current.totals.link_cpc,
        previous: previous.totals.link_cpc,
        change_percent: calculateChange(
          current.totals.link_cpc,
          previous.totals.link_cpc,
        ),
      },
      leads: {
        current: current.totals.leads,
        previous: previous.totals.leads,
        change_percent: calculateChange(
          current.totals.leads,
          previous.totals.leads,
        ),
      },
      cpl: {
        current: current.totals.cpl,
        previous: previous.totals.cpl,
        change_percent: calculateChange(
          current.totals.cpl,
          previous.totals.cpl,
        ),
      },
    };

    const maximumBounds = isMaximum
      ? currentRaw.reduce(
          (acc, item) => {
            const start = item.date_start || null;
            const stop = item.date_stop || null;
            return {
              from:
                !acc.from || (start && start < acc.from) ? start : acc.from,
              to:
                !acc.to || (stop && stop > acc.to) ? stop : acc.to,
            };
          },
          { from: null, to: null },
        )
      : null;

    return json({
      success: true,
      generated_at: new Date().toISOString(),
      meta_api_version: META_GRAPH_API_VERSION,
      period: isMaximum
        ? {
            mode: "maximum",
            from: maximumBounds?.from,
            to: maximumBounds?.to,
            days: null,
          }
        : { mode: "range", from, to, days: diffDays },
      previous_period: isMaximum ? null : { from: prevFrom, to: prevTo },
      totals: current.totals,
      comparison,
      daily: current.daily,
      campaigns: current.campaigns,
    });
  } catch (error) {
    console.error("[meta-dashboard]", error);
    return json(
      {
        success: false,
        error: error?.message || "META_API_ERROR",
        meta_api_version: META_GRAPH_API_VERSION,
      },
      500,
    );
  }
}
