import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const testMetaConnection = createServerFn({ method: "POST" })
  .handler(async () => {
    // 1. Authenticate user
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      return { 
        success: false, 
        error: "Unauthorized", 
        message: "No authorization header found" 
      };
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return { 
        success: false, 
        error: "Unauthorized", 
        message: "Invalid session" 
      };
    }

    // 2. Read Secrets
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
    const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v20.0";

    if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
      return {
        success: false,
        error: "CONFIG_MISSING",
        message: "Meta secrets are not configured in the environment"
      };
    }

    // 3. Meta API Call
    try {
      const url = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/act_${META_AD_ACCOUNT_ID}?fields=id,name&access_token=${META_ACCESS_TOKEN}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          meta_error: result.error?.code,
          message: result.error?.message || "Meta API error"
        };
      }

      return {
        success: true,
        account_id: result.id,
        account_name: result.name
      };
    } catch (e: any) {
      return {
        success: false,
        error: "FETCH_ERROR",
        message: e.message || "Failed to contact Meta API"
      };
    }
  });
