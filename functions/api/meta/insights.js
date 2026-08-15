export async function onRequestGet(context) {
  const { env } = context;

  const META_ACCESS_TOKEN = env.META_ACCESS_TOKEN;
  const META_AD_ACCOUNT_ID = env.META_AD_ACCOUNT_ID;
  const META_GRAPH_API_VERSION = env.META_GRAPH_API_VERSION;

  // Validate configuration
  if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID || !META_GRAPH_API_VERSION) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "CONFIG_MISSING",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    const fields = [
      "date_start",
      "date_stop",
      "campaign_id",
      "campaign_name",
      "spend",
      "impressions",
      "reach",
      "clicks",
      "ctr",
      "cpc",
      "cpm",
      "frequency",
      "actions",
      "cost_per_action_type"
    ].join(",");

    const params = new URLSearchParams({
      level: "campaign",
      date_preset: "last_7d",
      time_increment: "1",
      limit: "100",
      fields: fields
    });

    let allRows = [];
    let nextUrl = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/act_${META_AD_ACCOUNT_ID}/insights?${params.toString()}`;
    let pageCount = 0;
    const MAX_PAGES = 10; // Security limit to avoid infinite loops

    while (nextUrl && pageCount < MAX_PAGES) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            meta_error: {
              message: data.error?.message || "Erro desconhecido na Meta API",
              code: data.error?.code || "unknown",
              type: data.error?.type || "OAuthException",
            },
          }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          }
        );
      }

      if (data.data && Array.isArray(data.data)) {
        allRows = allRows.concat(data.data.map(row => ({
          date_start: row.date_start,
          date_stop: row.date_stop,
          campaign_id: row.campaign_id,
          campaign_name: row.campaign_name,
          spend: row.spend,
          impressions: row.impressions,
          reach: row.reach,
          clicks: row.clicks,
          ctr: row.ctr,
          cpc: row.cpc,
          cpm: row.cpm,
          frequency: row.frequency,
          actions: row.actions || [],
          cost_per_action_type: row.cost_per_action_type || []
        })));
      }

      nextUrl = data.paging?.next || null;
      pageCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        period: "last_7d",
        count: allRows.length,
        rows: allRows,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Erro ao processar requisição server-side",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
