import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function DashboardHeader({ loading, onRefresh }: { loading: boolean; onRefresh: () => void }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "relative z-50 border-b bg-white transition-all duration-300 md:sticky md:top-0",
        scrolled ? "border-border/60 shadow-sm" : "border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a
          href="/painel"
          onClick={(e) => {
            e.preventDefault();
            navigate({ to: "/painel" });
          }}
          className="transition-opacity duration-200 hover:opacity-80"
        >
          <img
            src="/logo-pisos-do-bosque.webp"
            alt="Pisos do Bosque"
            width={2730}
            height={655}
            className="w-auto h-10 md:h-12"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </a>

        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={loading}
            className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          >
            <RefreshCw className={cn("h-4 w-4 md:mr-2", loading && "animate-spin")} />
            <span className="hidden md:inline">Atualizar</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/painel/login" }))}
            className="text-brand-green hover:bg-brand-cream"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
