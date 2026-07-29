import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMapsConfig } from "@/lib/maps-config.functions";

declare global {
  interface Window {
    google?: any;
    __initPisosMap?: () => void;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    window.__initPisosMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__initPisosMap&libraries=marker&language=pt-BR&region=BR`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Falha ao carregar Google Maps"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

type Props = {
  mapsUrl: string;
  className?: string;
};

export function InteractiveMap({ mapsUrl, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Só começa qualquer trabalho de Maps quando o container se aproxima da viewport.
  useEffect(() => {
    if (inView || !containerRef.current) return;
    const el = containerRef.current;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  const fetchConfig = useServerFn(getMapsConfig);
  const { data } = useQuery({
    queryKey: ["maps-config"],
    queryFn: () => fetchConfig(),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: inView,
  });

  useEffect(() => {
    if (!data?.apiKey || !mapRef.current) return;
    let cancelled = false;

    loadMapsScript(data.apiKey)
      .then(() => {
        if (cancelled || !mapRef.current || !window.google?.maps) return;
        const center = { lat: data.lat, lng: data.lng };
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "cooperative",
          styles: [
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        new window.google.maps.Marker({
          position: center,
          map,
          title: "Pisos do Bosque",
        });
        setReady(true);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
    };
  }, [data]);

  // Fallback: iframe estático se está in-view mas não temos chave ou falhou
  if (inView && (!data?.apiKey || failed)) {
    return (
      <iframe
        title="Localização Pisos do Bosque"
        src="https://www.google.com/maps?q=Pisos+do+Bosque+Av.+Capit%C3%A3o+Garibaldi+Pinto+dos+Santos+488+Cachoeirinha+RS&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
        allowFullScreen
      />
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <div ref={mapRef} className="h-full w-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          {inView ? "Carregando mapa…" : "Mapa"}
        </div>
      )}
      {ready && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir no Google Maps"
          className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-brand-green shadow-md hover:bg-white"
        >
          Ampliar
        </a>
      )}
    </div>
  );
}
