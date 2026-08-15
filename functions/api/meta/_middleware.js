export async function onRequest(context) {
  const { request, env } = context;

  // 1. Get secrets from environment
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "SERVER_CONFIG_ERROR",
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

  // 2. Extract Bearer token from Authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "UNAUTHORIZED",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const token = authHeader.split(" ")[1];

  // Security check: NEVER allow the publishable key itself as an auth token
  if (token === SUPABASE_PUBLISHABLE_KEY) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "UNAUTHORIZED",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    // 3. Validate token with Supabase Auth
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!authResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "UNAUTHORIZED",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const user = await authResponse.json();

    // 4. Store user in context and proceed
    context.data.user = {
      id: user.id,
      email: user.email,
    };

    return context.next();
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "AUTH_VERIFICATION_FAILED",
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
