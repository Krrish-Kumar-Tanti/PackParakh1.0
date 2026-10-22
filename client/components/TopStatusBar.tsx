"use client";

import React, { useEffect, useState, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, LANG_MAP, REVERSE_LANG_MAP } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import { fetchSystemStatus, SystemStatusResponse } from "@/lib/api";

export default function TopStatusBar() {
  const { language, setLanguage, t } = useLanguage();
  const [telemetry, setTelemetry] = useState<SystemStatusResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const LANGUAGES = Object.keys(LANG_MAP);
  const currentDisplayName = REVERSE_LANG_MAP[language] || "English";

  useEffect(() => {
    fetchSystemStatus().then((data) => setTelemetry(data)).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-slate-950/40 backdrop-blur-md text-slate-200 font-medium py-2 sm:py-2.5 px-4 sm:px-8 relative z-50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] font-mono">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] shrink-0"></span>
        <span className="tracking-wide text-slate-200 text-xs sm:text-[13px] font-semibold leading-relaxed hidden sm:inline">
          {t("top.status.text")} <span className="text-emerald-400 font-bold">{t("top.status.active")}</span> {t("top.status.vision")} <span className="text-emerald-400 font-bold">{t("top.status.online")}</span> {t("top.status.evidence")} <span className="text-emerald-400 font-bold">{t("top.status.secured")}</span>
        </span>
        {/* Mobile compact status */}
        <span className="text-slate-200 text-xs font-semibold sm:hidden">
          {t("statusBar.directorate")} • <span className="text-emerald-400">{t("top.status.active")}</span>
        </span>
      </div>

      {/* Language Selector Dropdown — Unnati's 5-language with Globe */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group flex items-center gap-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/40 hover:border-blue-400/60 rounded-xl pl-3 pr-2 py-1.5 text-xs text-blue-50 hover:text-white transition-all cursor-pointer min-w-[150px] justify-between shadow-sm backdrop-blur-sm",
            isOpen && "bg-blue-500/30 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="font-semibold tracking-wide">{currentDisplayName}</span>
          </div>
          <ChevronDown className={cn("h-3.5 w-3.5 text-blue-400/70 group-hover:text-blue-300 transition-transform duration-200", isOpen && "rotate-180 text-blue-300")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150 origin-top-right ring-1 ring-white/5">
            <div className="p-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLanguage(LANG_MAP[l]);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-xs transition-all rounded-lg flex items-center justify-between cursor-pointer",
                    currentDisplayName === l
                      ? "bg-blue-500/20 text-blue-300 font-bold border border-blue-500/20"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium"
                  )}
                >
                  <span>{l}</span>
                  {currentDisplayName === l && <Check className="h-3.5 w-3.5 text-blue-400" />}
                </button>
              ))}
            </div>
            <div className="px-3 py-2 bg-slate-800/50 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono">
              {t("top.status.text")} • 5 languages
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
