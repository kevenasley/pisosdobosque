import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3 md:px-8">
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
            className="h-8 w-auto sm:h-9 md:h-12"
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
            className="h-10 w-10 rounded-xl border-brand-green p-0 text-brand-green hover:bg-brand-green hover:text-white md:h-9 md:w-auto md:px-3"
          >
            <RefreshCw className={cn("h-4 w-4 md:mr-2", loading && "animate-spin")} aria-hidden="true" />
            <span className="sr-only md:not-sr-only">Atualizar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
