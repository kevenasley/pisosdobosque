import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  saveConsent,
  applyConsent,
} from "@/lib/consent";
import { X } from "lucide-react";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      applyConsent(existing);
      setAnalytics(existing.analytics === "granted");
      setAds(existing.ads === "granted");
    } else {
      setOpen(true);
    }
    function reopen() {
      const cur = readConsent();
      if (cur) {
        setAnalytics(cur.analytics === "granted");
        setAds(cur.ads === "granted");
      }
      setCustomize(true);
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
  function saveCustom() {
    saveConsent({
      analytics: analytics ? "granted" : "denied",
      ads: ads ? "granted" : "denied",
    });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed bottom-4 right-4 z-[100] w-[calc(100vw-2rem)] max-w-[380px] rounded-lg border border-border bg-background p-4 shadow-xl"
    >
      <button
        onClick={() => setOpen(false)}
        aria-label="Fechar"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
      <h2 className="pr-6 text-sm font-semibold">Sua privacidade importa</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Usamos cookies para melhorar sua experiência, entender o uso do site e
        personalizar anúncios. Você pode aceitar, recusar ou personalizar.
      </p>

      {customize && (
        <div className="mt-3 space-y-2 rounded-md bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium">Necessários</p>
              <p className="text-[11px] text-muted-foreground">Sempre ativos</p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium">Analytics</p>
              <p className="text-[11px] text-muted-foreground">
                Mede visitas e desempenho
              </p>
            </div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium">Anúncios</p>
              <p className="text-[11px] text-muted-foreground">
                Remarketing e conversões
              </p>
            </div>
            <Switch checked={ads} onCheckedChange={setAds} />
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {!customize ? (
          <>
            <Button size="sm" onClick={acceptAll} className="flex-1">
              Aceitar todos
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={rejectAll}
              className="flex-1"
            >
              Recusar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCustomize(true)}
              className="w-full text-xs"
            >
              Personalizar
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={saveCustom} className="flex-1">
              Salvar preferências
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={acceptAll}
              className="flex-1"
            >
              Aceitar todos
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
