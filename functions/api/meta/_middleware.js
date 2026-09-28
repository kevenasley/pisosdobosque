const ALLOWED_EMAILS = new Set([
  "adm@pisosdobosque.com.br",
  "daianeavellar477@gmail.com",
  "kevenasleygestor@gmail.com",
]);

const FALLBACK_SUPABASE_URL = "\"https://egaomfnfjgfwisaupdvk.supabase.co\"";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "\"sb_publishable_yYbk8gkZFXUpn6g7xaTb5g_57u8b5VP\"";

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequest(context) {
  const authHeader = context.request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return json({ success: false, error: "UNAUTHORIZED" }, 401);
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return json({ success: false, error: "UNAUTHORIZED" }, 401);
  }

  const supabaseUrl =
    context.env.SUPABASE_URL ||
    context.env.VITE_SUPABASE_URL ||
    FALLBACK_SUPABASE_URL;
  const supabaseKey =
    context.env.SUPABASE_PUBLISHABLE_KEY ||
    context.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    FALLBACK_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return json({ success: false, error: "AUTH_CONFIG_MISSING" }, 500);
  }

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });

    if (!userResponse.ok) {
      return json({ success: false, error: "UNAUTHORIZED" }, 401);
    }

    const user = await userResponse.json();
    const email = String(user?.email || "").trim().toLowerCase();

    if (!ALLOWED_EMAILS.has(email)) {
      return json({ success: false, error: "FORBIDDEN" }, 403);
    }

    context.data.dashboardUser = { id: user.id, email };
    return context.next();
  } catch (error) {
    console.error("[dashboard-auth]", error);
    return json({ success: false, error: "AUTH_CHECK_FAILED" }, 500);
  }
}
