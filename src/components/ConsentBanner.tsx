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
  const [open, setOpen] = useState(false);

  useEffect(() => {
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

  function acceptAll() {
    saveConsent({ analytics: "granted", ads: "granted" });
    setOpen(false);
  }
  function rejectAll() {
    saveConsent({ analytics: "denied", ads: "denied" });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed bottom-4 right-4 z-[100] w-[calc(100vw-2rem)] max-w-[360px] rounded-lg border border-border bg-background p-4 shadow-xl"
    >
      <button
        onClick={() => setOpen(false)}
        aria-label="Fechar"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-xs leading-relaxed text-muted-foreground">
        Usamos cookies para melhorar sua experiência e medir anúncios.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={acceptAll} className="flex-1">
          Aceitar
        </Button>
        <Button size="sm" variant="outline" onClick={rejectAll} className="flex-1">
          Recusar
        </Button>
      </div>
    </div>
  );
}
