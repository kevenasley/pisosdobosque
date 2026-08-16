import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import LoginPage from "@/components/dashboard/LoginPage";

export const Route = createFileRoute("/painel/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ search }) => {
    // If not in a browser, skip (during SSG we want the login page to be generated)
    if (typeof window === "undefined") return;
    
    // Check if there is already a session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // If the redirect search param is /painel/login itself, go to /painel to avoid loops
      const target = search.redirect && !search.redirect.includes("/painel/login") 
        ? search.redirect 
        : "/painel";
        
      throw redirect({
        to: target,
      });
    }
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { title: "Login | Painel Pisos do Bosque" },
    ],
  }),
  component: LoginPage,
});

