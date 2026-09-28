import { cn } from "@/lib/utils";

export function PlatformSelector({ active, onChange }: { active: "meta" | "google"; onChange: (p: "meta" | "google") => void }) {
  return (
    <div className="mx-auto mt-3 max-w-7xl px-3 sm:mt-4 sm:px-4 md:mt-6">
      <div className="flex w-full overflow-hidden rounded-xl border border-brand-green/10 bg-white p-1 shadow-sm">
        <button
          onClick={() => onChange("meta")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-xs font-bold transition-all whitespace-nowrap sm:py-3 sm:text-sm",
            active === "meta" ? "bg-brand-green-teal text-white" : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <img 
            src="/meta-ads.svg" 
            alt="" 
            aria-hidden="true"
            className={cn(
              "w-[18px] h-[18px] md:w-[20px] md:h-[20px] object-contain flex-shrink-0",
              active === "meta" && "brightness-0 invert"
            )} 
          />
          <span>Meta Ads</span>
        </button>
        {/* Google Ads tab hidden for now */}
        {false && (
          <button
            onClick={() => onChange("google")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-md text-sm font-bold transition-all whitespace-nowrap",
              active === "google" ? "bg-brand-green-teal text-white" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <img 
              src="/google-ads.svg" 
              alt="" 
              aria-hidden="true"
              className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] object-contain flex-shrink-0"
            />
            <span>Google Ads</span>
          </button>
        )}
      </div>
    </div>
  );
}
