import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import LoginPage from "@/components/dashboard/LoginPage";


export const Route = createFileRoute("/painel/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return; // Skip during SSG/SSR
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      throw redirect({
        to: search.redirect || "/painel",
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

