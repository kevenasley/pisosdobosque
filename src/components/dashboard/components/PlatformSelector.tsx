import { cn } from "@/lib/utils";
import metaIcon from "@/assets/icons/meta-icon.svg.asset.json";
import googleIcon from "@/assets/icons/google-icon.svg.asset.json";

export function PlatformSelector({ active, onChange }: { active: "meta" | "google"; onChange: (p: "meta" | "google") => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex bg-white p-1 rounded-lg border border-brand-green/10 shadow-sm w-full">
        <button
          onClick={() => onChange("meta")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all",
            active === "meta" ? "bg-brand-green-teal text-white" : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <img src={metaIcon.url} alt="Meta" className="w-4 h-4 md:w-5 md:h-5 object-contain" />
          <span>Meta Ads</span>
        </button>
        <button
          onClick={() => onChange("google")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all",
            active === "google" ? "bg-brand-green-teal text-white" : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <img src={googleIcon.url} alt="Google" className="w-4 h-4 md:w-5 md:h-5 object-contain" />
          <span>Google Ads</span>
        </button>
      </div>
    </div>
  );
}
