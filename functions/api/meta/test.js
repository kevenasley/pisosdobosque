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
    const url = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/act_${META_AD_ACCOUNT_ID}?fields=id,name`;

    const response = await fetch(url, {
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

    return new Response(
      JSON.stringify({
        success: true,
        account_id: data.id,
        account_name: data.name,
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
