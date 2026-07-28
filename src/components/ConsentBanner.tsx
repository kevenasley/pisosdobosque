import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  saveConsent,
  applyConsent,
} from "@/lib/consent";
import { X } from "lucide-react";

export function ConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      setOpen(true);
    }
    function reopen() {
      setOpen(true);
    }
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  function close() {
    setVisible(false);
    window.setTimeout(() => setOpen(false), 300);
  }
  function acceptAll() {
    saveConsent({ analytics: "granted", ads: "granted" });
    close();
  }
  function rejectAll() {
    saveConsent({ analytics: "denied", ads: "denied" });
    close();
  }

  if (!mounted || !open) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className={`fixed bottom-6 right-6 z-[100] w-[calc(100vw-2rem)] max-w-[380px] rounded-2xl border border-border bg-background p-5 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-out md:bottom-8 md:right-8 md:max-w-[420px] md:p-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <button
        onClick={close}
        aria-label="Fechar"
        className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:right-4 md:top-4"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-7 text-xs leading-relaxed text-muted-foreground md:text-sm">
        Usamos cookies para melhorar sua experiência e medir anúncios.
      </p>
      <div className="mt-4 flex gap-2.5 md:mt-5">
        <Button
          size="sm"
          onClick={acceptAll}
          className="flex-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Aceitar
        </Button>
        <Button
          size="sm"
          onClick={rejectAll}
          className="flex-1 bg-[#F3F4F6] text-foreground hover:bg-[#E5E7EB] hover:text-foreground"
        >
          Recusar
        </Button>
      </div>
    </div>
  );
}
