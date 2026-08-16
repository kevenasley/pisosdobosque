export async function onRequest(context) {
  const { request, env } = context;
  
  // 1. Get Authorization header
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ success: false, error: "UNAUTHORIZED" }),
      { 
        status: 401, 
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store" 
        } 
      }
    );
  }

  const token = authHeader.split(" ")[1];
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase configuration in environment");
    return new Response(
      JSON.stringify({ success: false, error: "SERVER_CONFIGURATION_ERROR" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 2. Validate token with Supabase Auth
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, error: "UNAUTHORIZED" }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-store" 
          } 
        }
      );
    }

    const userData = await userResponse.json();

    // 3. Store valid user in context.data
    context.data.user = {
      id: userData.id,
      email: userData.email
    };

    // 4. Continue to the next handler
    return context.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "INTERNAL_SERVER_ERROR" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
