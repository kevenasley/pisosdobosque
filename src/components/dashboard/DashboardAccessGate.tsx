import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isDashboardEmailAllowed } from "@/lib/admin-access";

type GateState = "loading" | "signed_out" | "authorized" | "denied";

export function DashboardAccessGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("loading");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    let active = true;

    async function resolveSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const sessionEmail = data.session?.user?.email?.toLowerCase();

      if (!data.session) {
        setState("signed_out");
        return;
      }

      if (!isDashboardEmailAllowed(sessionEmail)) {
        await supabase.auth.signOut();
        if (active) setState("denied");
        return;
      }

      setState("authorized");
    }

    void resolveSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      const sessionEmail = session?.user?.email?.toLowerCase();

      if (!session) {
        setState("signed_out");
        return;
      }

      if (!isDashboardEmailAllowed(sessionEmail)) {
        await supabase.auth.signOut();
        if (active) setState("denied");
        return;
      }

      setState("authorized");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function sendMagicLink(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!isDashboardEmailAllowed(normalizedEmail)) {
      setState("denied");
      setMessage("Este e-mail não possui acesso ao painel.");
      return;
    }

    setSending(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/painel`
        : "https://pisosdobosque.com/painel";

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    setSending(false);
    setMessage(
      error
        ? "Não foi possível enviar o link de acesso. Tente novamente."
        : "Link de acesso enviado. Abra o e-mail e clique para entrar.",
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    setState("signed_out");
  }

  if (state === "authorized") {
    return (
      <>
        <div className="fixed right-4 top-4 z-[80]">
          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-slate-50"
          >
            Sair do painel
          </button>
        </div>
        {children}
      </>
    );
  }

  if (state === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-600">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
          {state === "denied" ? <LockKeyhole className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>
        <h1 className="mt-5 text-center text-2xl font-bold text-slate-900">
          Painel de Marketing
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
          Acesso restrito à equipe autorizada da Pisos do Bosque.
        </p>

        <form onSubmit={sendMagicLink} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="dashboard-email">
            E-mail autorizado
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="dashboard-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (state === "denied") setState("signed_out");
                setMessage("");
              }}
              placeholder="seuemail@empresa.com"
              required
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {sending ? "Enviando..." : "Receber link de acesso"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 rounded-lg px-3 py-2 text-center text-xs leading-relaxed ${
              state === "denied"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
