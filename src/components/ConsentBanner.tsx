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
      className={`fixed z-[100] transition-all duration-300 ease-out
        left-3 right-3 bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)]
        md:left-auto md:right-8 md:bottom-8 md:w-[420px]
        rounded-xl md:rounded-2xl border border-border bg-background shadow-2xl ring-1 ring-black/5
        p-3 md:p-6 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
    >
      <button
        onClick={close}
        aria-label="Fechar"
        className="absolute right-4 top-4 hidden rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:block"
      >
        <X className="h-4 w-4" />
      </button>


      {/* Mobile: compact single-row layout */}
      <div className="flex items-center gap-2 md:hidden">
        <p className="flex-1 text-[11px] leading-snug text-muted-foreground">
          Usamos cookies para melhorar sua experiência e medir anúncios.
        </p>
        <div className="flex shrink-0 flex-col gap-1.5">
          <button
            onClick={acceptAll}
            className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm active:scale-[0.97]"
          >
            Aceitar
          </button>
          <button
            onClick={rejectAll}
            className="rounded-md bg-[#F3F4F6] px-3 py-1.5 text-[11px] font-medium text-foreground hover:bg-[#E5E7EB]"
          >
            Recusar
          </button>
        </div>
      </div>

      {/* Desktop: original stacked layout */}
      <div className="hidden md:block">
        <p className="pr-7 text-sm leading-relaxed text-muted-foreground">
          Usamos cookies para melhorar sua experiência e medir anúncios.
        </p>
        <div className="mt-5 flex gap-2.5">
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
    </div>
  );
}
