import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: "https://pisosdobosque.com/painel",
        },
      });

      if (error) {
        // Human-friendly error messages
        if (error.message.includes("Signups are disabled")) {
          toast.error("Este e-mail não possui acesso autorizado ao painel.");
        } else if (error.message.includes("rate limit")) {
          toast.error("Muitas tentativas. Por favor, aguarde um momento.");
        } else {
          toast.error("Não foi possível enviar o link. Verifique o e-mail informado.");
        }
        return;
      }

      setSent(true);
      setCooldown(60);
      toast.success("Link de acesso enviado!");
    } catch (error) {
      toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-elegant overflow-hidden">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-pisos-do-bosque.webp" 
              alt="Pisos do Bosque" 
              className="h-16 w-auto object-contain" 
            />
          </div>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="login-header"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CardTitle className="text-2xl font-bold text-brand-green-teal">Acesse seu painel</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Digite seu e-mail para receber um link seguro de acesso.
                </CardDescription>
              </motion.div>
            ) : (
              <motion.div
                key="success-header"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-center mb-2">
                  <div className="bg-brand-green/10 p-3 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-brand-green" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-brand-green-teal">Confira seu e-mail</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Enviamos um link seguro para acessar o Painel de Marketing.
                </CardDescription>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSendMagicLink}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-brand-green-teal font-medium">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu-email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 h-12 border-brand-green/20 focus:ring-brand-orange focus:border-brand-orange transition-all"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold h-12 text-lg shadow-md transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar link de acesso
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6 py-2"
              >
                <p className="text-brand-green-teal/80 text-sm">
                  Você pode fechar esta página depois de abrir o link recebido.
                </p>
                
                <div className="pt-4 border-t border-brand-green/10">
                  <Button
                    variant="ghost"
                    onClick={() => handleSendMagicLink()}
                    disabled={loading || cooldown > 0}
                    className="text-muted-foreground hover:text-brand-orange text-xs font-medium"
                  >
                    {cooldown > 0 
                      ? `Enviar novamente (${cooldown}s)` 
                      : "Não recebeu o e-mail? Enviar novamente"
                    }
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold gap-2">
            <span className="h-px w-8 bg-brand-green/10" />
            Acesso Restrito
            <span className="h-px w-8 bg-brand-green/10" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
