import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export function DashboardHeader({ loading, onRefresh }: { loading: boolean; onRefresh: () => void }) {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-brand-green/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <img src="/logo-pisos-do-bosque.webp" alt="Logo" className="h-8 md:h-10" />
        <div className="flex gap-2 md:gap-4">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 md:mr-2", loading && "animate-spin")} />
            <span className="hidden md:inline">Atualizar</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/painel/login" }))}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
