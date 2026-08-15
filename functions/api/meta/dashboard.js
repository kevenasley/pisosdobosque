export async function onRequest(context) {
  const { request, env, data } = context;

  const META_ACCESS_TOKEN = env.META_ACCESS_TOKEN;
  const META_AD_ACCOUNT_ID = env.META_AD_ACCOUNT_ID;
  const META_GRAPH_API_VERSION = env.META_GRAPH_API_VERSION || "v20.0";

  // 1. Parse dates from query params
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to) {
    return new Response(JSON.stringify({ success: false, error: "MISSING_DATES" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  // Basic validation for YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(from) || !dateRegex.test(to)) {
    return new Response(JSON.stringify({ success: false, error: "INVALID_DATE_FORMAT" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffDays = Math.ceil(Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays > 90) {
    return new Response(JSON.stringify({ success: false, error: "RANGE_TOO_LARGE" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  // 2. Fetch data from Meta
  async function fetchMetaInsights(since, until) {
    let allData = [];
    let nextUrl = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/act_${META_AD_ACCOUNT_ID}/insights?level=campaign&time_increment=1&time_range={"since":"${since}","until":"${until}"}&fields=date_start,date_stop,campaign_id,campaign_name,spend,impressions,actions&limit=100`;

    let pageCount = 0;
    while (nextUrl && pageCount < 10) {
      const response = await fetch(nextUrl, {
        headers: { "Authorization": `Bearer ${META_ACCESS_TOKEN}` }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || "Meta API Error");
      }

      const result = await response.json();
      allData = allData.concat(result.data || []);
      nextUrl = result.paging?.next || null;
      pageCount++;
    }
    return allData;
  }

  // 3. Calculate previous period
  const prevToDate = new Date(fromDate);
  prevToDate.setDate(prevToDate.getDate() - 1);
  const prevFromDate = new Date(prevToDate);
  prevFromDate.setDate(prevFromDate.getDate() - (diffDays - 1));

  const prevFrom = prevFromDate.toISOString().split('T')[0];
  const prevTo = prevToDate.toISOString().split('T')[0];

  try {
    const [currentRaw, previousRaw] = await Promise.all([
      fetchMetaInsights(from, to),
      fetchMetaInsights(prevFrom, prevTo)
    ]);

    // 4. Processing logic
    const processData = (raw) => {
      const dailyMap = {};
      const campaignMap = {};
      
      let totalSpend = 0;
      let totalImpressions = 0;
      let totalConversations = 0;
      let totalLinkClicks = 0;
      let totalLeads = 0;

      raw.forEach(item => {
        const spend = Number(item.spend) || 0;
        const impressions = Number(item.impressions) || 0;
        
        let conversations = 0;
        let linkClicks = 0;
        let leads = 0;

        if (item.actions) {
          item.actions.forEach(a => {
            if (a.action_type === "onsite_conversion.messaging_conversation_started_7d") conversations += Number(a.value) || 0;
            if (a.action_type === "link_click") linkClicks += Number(a.value) || 0;
            if (a.action_type === "lead") leads += Number(a.value) || 0;
          });
        }

        totalSpend += spend;
        totalImpressions += impressions;
        totalConversations += conversations;
        totalLinkClicks += linkClicks;
        totalLeads += leads;

        // Daily aggregation
        const day = item.date_start;
        if (!dailyMap[day]) {
          dailyMap[day] = { date: day, spend: 0, impressions: 0, conversations: 0, link_clicks: 0, leads: 0 };
        }
        dailyMap[day].spend += spend;
        dailyMap[day].impressions += impressions;
        dailyMap[day].conversations += conversations;
        dailyMap[day].link_clicks += linkClicks;
        dailyMap[day].leads += leads;

        // Campaign aggregation
        const cid = item.campaign_id;
        if (!campaignMap[cid]) {
          campaignMap[cid] = { campaign_id: cid, campaign_name: item.campaign_name, spend: 0, impressions: 0, conversations: 0, link_clicks: 0, leads: 0 };
        }
        campaignMap[cid].spend += spend;
        campaignMap[cid].impressions += impressions;
        campaignMap[cid].conversations += conversations;
        campaignMap[cid].link_clicks += linkClicks;
        campaignMap[cid].leads += leads;
      });

      const finalizeItem = (obj) => ({
        ...obj,
        cost_per_conversation: obj.conversations > 0 ? obj.spend / obj.conversations : null,
        link_ctr: obj.impressions > 0 ? (obj.link_clicks / obj.impressions) * 100 : null,
        link_cpc: obj.link_clicks > 0 ? obj.spend / obj.link_clicks : null,
        cpl: obj.leads > 0 ? obj.spend / obj.leads : null
      });

      return {
        totals: finalizeItem({
          spend: totalSpend,
          impressions: totalImpressions,
          conversations: totalConversations,
          link_clicks: totalLinkClicks,
          leads: totalLeads
        }),
        daily: Object.values(dailyMap).map(finalizeItem).sort((a, b) => a.date.localeCompare(b.date)),
        campaigns: Object.values(campaignMap).map(finalizeItem).sort((a, b) => b.spend - a.spend)
      };
    };

    const current = processData(currentRaw);
    const previous = processData(previousRaw);

    // 5. Comparison
    const calculateChange = (curr, prev) => {
      if (!prev || prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    };

    const comparison = {
      spend: { current: current.totals.spend, previous: previous.totals.spend, change_percent: calculateChange(current.totals.spend, previous.totals.spend) },
      conversations: { current: current.totals.conversations, previous: previous.totals.conversations, change_percent: calculateChange(current.totals.conversations, previous.totals.conversations) },
      cost_per_conversation: { current: current.totals.cost_per_conversation, previous: previous.totals.cost_per_conversation, change_percent: calculateChange(current.totals.cost_per_conversation, previous.totals.cost_per_conversation) },
      impressions: { current: current.totals.impressions, previous: previous.totals.impressions, change_percent: calculateChange(current.totals.impressions, previous.totals.impressions) },
      link_clicks: { current: current.totals.link_clicks, previous: previous.totals.link_clicks, change_percent: calculateChange(current.totals.link_clicks, previous.totals.link_clicks) },
      link_ctr: { current: current.totals.link_ctr, previous: previous.totals.link_ctr, change_percent: calculateChange(current.totals.link_ctr, previous.totals.link_ctr) },
      link_cpc: { current: current.totals.link_cpc, previous: previous.totals.link_cpc, change_percent: calculateChange(current.totals.link_cpc, previous.totals.link_cpc) },
      leads: { current: current.totals.leads, previous: previous.totals.leads, change_percent: calculateChange(current.totals.leads, previous.totals.leads) },
      cpl: { current: current.totals.cpl, previous: previous.totals.cpl, change_percent: calculateChange(current.totals.cpl, previous.totals.cpl) },
    };

    return new Response(JSON.stringify({
      success: true,
      generated_at: new Date().toISOString(),
      period: { from, to, days: diffDays },
      previous_period: { from: prevFrom, to: prevTo },
      totals: current.totals,
      comparison,
      daily: current.daily,
      campaigns: current.campaigns
    }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  }
}
