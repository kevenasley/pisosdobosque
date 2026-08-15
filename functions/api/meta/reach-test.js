/**
 * Endpoint TEMPORÁRIO de diagnóstico para investigar divergência de Reach/Frequency.
 * Protegido pelo middleware em /api/meta/_middleware.js
 */

export async function onRequest(context) {
  const { env } = context;

  const META_TOKEN = env.META_ACCESS_TOKEN;
  const AD_ACCOUNT_ID = env.META_AD_ACCOUNT_ID;
  const API_VERSION = env.META_GRAPH_API_VERSION || 'v20.0';
  
  const CAMPAIGN_ID = "120255229344600405";
  const DATE = "2026-08-14";
  
  const fields = "date_start,date_stop,campaign_id,campaign_name,spend,impressions,reach,frequency";
  const time_range = JSON.stringify({ since: DATE, until: DATE });

  const headers = {
    'Authorization': `Bearer ${META_TOKEN}`,
    'Cache-Control': 'no-store'
  };

  const fetchMeta = async (path, params = {}) => {
    const urlParams = new URLSearchParams({
      ...params,
      access_token: META_TOKEN // redundante mas seguro para algumas chamadas da Graph API
    });
    const url = `https://graph.facebook.com/${API_VERSION}${path}?${urlParams.toString()}`;
    
    const response = await fetch(url, { headers: { 'Cache-Control': 'no-store' } });
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Meta API Error: ${data.error.message}`);
    }
    
    // Retornar o primeiro item do data array se existir
    return data.data && data.data.length > 0 ? data.data[0] : null;
  };

  try {
    // TESTE A — ENDPOINT DA CAMPANHA (Sem time_increment)
    const testA = await fetchMeta(`/${CAMPAIGN_ID}/insights`, {
      fields,
      time_range
    });

    // TESTE B — ENDPOINT DA CAMPANHA COM DIA (time_increment=1)
    const testB = await fetchMeta(`/${CAMPAIGN_ID}/insights`, {
      fields,
      time_range,
      time_increment: 1
    });

    // TESTE C — ENDPOINT DA CONTA (Filtrado por Campaign ID)
    const testC = await fetchMeta(`/act_${AD_ACCOUNT_ID}/insights`, {
      fields,
      time_range,
      level: 'campaign',
      filtering: JSON.stringify([{
        field: 'campaign.id',
        operator: 'EQUAL',
        value: CAMPAIGN_ID
      }])
    });

    const formatResult = (res) => {
      if (!res) return null;
      const impressions = parseFloat(res.impressions || 0);
      const reach = parseFloat(res.reach || 0);
      return {
        spend: parseFloat(res.spend || 0),
        impressions: impressions,
        reach: reach,
        frequency_api: parseFloat(res.frequency || 0),
        frequency_calculated: reach > 0 ? parseFloat((impressions / reach).toFixed(6)) : 0
      };
    };

    const result = {
      success: true,
      expected_ads_manager: {
        spend: 142.99,
        impressions: 15284,
        reach: 13587,
        frequency: 1.12
      },
      test_a_campaign: formatResult(testA),
      test_b_campaign_daily: formatResult(testB),
      test_c_account_level_campaign: formatResult(testC)
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
