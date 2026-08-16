import { cn } from "@/lib/utils";
import { useState } from "react";

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
          <span className="text-lg">Meta Ads</span>
        </button>
        <button
          onClick={() => onChange("google")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all",
            active === "google" ? "bg-brand-green-teal text-white" : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <span className="text-lg">Google Ads</span>
        </button>
      </div>
    </div>
  );
}
