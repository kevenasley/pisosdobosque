import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Bem-vindo ao Painel!");
      navigate({ to: "/painel" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-elegant">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo-pisos-do-bosque.webp" alt="Pisos do Bosque" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-brand-green-teal">Painel de Marketing</CardTitle>
          <CardDescription>Acesse para acompanhar seus resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-brand-green/20 focus:border-brand-orange"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-brand-green/20 focus:border-brand-orange"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold h-12"
              disabled={loading}
            >
              {loading ? (
                "Carregando..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Entrar no Painel
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground gap-1">
            <Lock className="h-3 w-3" />
            Acesso Restrito
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
