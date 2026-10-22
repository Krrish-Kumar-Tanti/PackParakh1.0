"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { simulateDict } from "@/lib/i18n-pages/simulate";

export default function SimulatorPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = makePageT(language, simulateDict);
  const [area, setArea] = useState(120);
  const [weight, setWeight] = useState(200);

  // Statutory PCR 2011 Table-I Rule 7 Calculation
  const calculateRequiredFont = (netQty: number) => {
    if (netQty <= 50) return 1.5;
    if (netQty <= 200) return 2.0;
    if (netQty <= 500) return 4.0;
    return 6.0;
  };

  const requiredFontHeight = calculateRequiredFont(weight);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <TopStatusBar />
        <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Back Link — history-aware, falls back to home */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back")}</span>
          </button>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {t("heading")}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Sliders & Live Package Preview */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div className="space-y-8">
              {/* Slider 1: Area */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-900">
                      {t("pdpLabel")}
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">{t("pdpDesc")}</p>
                  </div>
                  <div className="text-base font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                    {area} cm²
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                  <span>10 cm²</span>
                  <span>500 cm²</span>
                </div>
              </div>

              {/* Slider 2: Weight */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-900">
                      {t("weightLabel")}
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">{t("weightDesc")}</p>
                  </div>
                  <div className="text-base font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100">
                    {weight} g/ml
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="5000"
                  step="5"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                  <span>5 g</span>
                  <span>5,000 g</span>
                </div>
              </div>
            </div>

            {/* Visual Package Preview */}
            <div className="mt-8 min-h-[260px] bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 border border-slate-800">
              <span className="absolute top-4 left-5 text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {t("liveLabel")}
              </span>

              {/* Dynamic Pack Mockup */}
              <div
                className="bg-white border border-slate-200 shadow-2xl flex flex-col relative transition-all duration-300 ease-out overflow-hidden rounded-2xl"
                style={{
                  width: `${Math.max(160, Math.min(320, area * 1.5))}px`,
                  height: `${Math.max(120, Math.min(240, area * 1.1))}px`,
                }}
              >
                <div className="h-5 bg-gradient-to-r from-blue-600 to-indigo-600 w-full flex items-center justify-center">
                  <div className="h-1 w-12 bg-white/40 rounded-full"></div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{t("premiumProduct")}</div>
                  <div
                    className="font-black text-slate-900 transition-all duration-300"
                    style={{ fontSize: `${Math.max(16, requiredFontHeight * 4.5)}px` }}
                  >
                    {weight >= 1000 ? `${weight / 1000} kg` : `${weight} g`}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">{t("netQuantity")}</div>
                </div>

                <div className="px-3 pb-2 flex justify-between items-end opacity-50">
                  <div className="h-4 w-12 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_1.5px,transparent_1.5px,transparent_3px)]"></div>
                  <div className="text-[8px] font-mono font-bold text-slate-600">{t("areaPrefix")} {area}cm²</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Statutory Feedback (Dark Navy Panel) */}
          <div className="lg:col-span-5 bg-[#0f172a] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
<h2 className="text-base font-bold flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-emerald-400" />
                    {t("feedbackTitle")}
                  </h2>
                <span className="text-[10px] font-mono bg-slate-800/90 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
                  {t("zeroLatency")}
                </span>
              </div>

              <div className="space-y-6">
                {/* Rule 7 Card */}
                <div className="bg-slate-800/70 border border-emerald-500/30 rounded-2xl p-5">
                  <div className="text-xs text-emerald-400 font-extrabold tracking-wider mb-2 uppercase">
                    {t("rule7Title")}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{requiredFontHeight.toFixed(1)}</span>
                    <span className="text-slate-400 font-mono text-xs">{t("fontHeightUnit")}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 border-t border-slate-700/60 pt-2">
                    {t("rule7Desc")}
                  </p>
                </div>

                {/* Rule 12 Dual Unit */}
                <div className="bg-slate-800/70 border border-blue-500/30 rounded-2xl p-5">
                  <div className="text-xs text-blue-400 font-extrabold tracking-wider mb-2 uppercase">
                    {t("rule12Title")}
                  </div>
                  <div className="text-base font-mono text-white bg-slate-900 px-3 py-2 rounded-xl inline-block border border-slate-700">
                    {weight >= 1000 ? `${weight / 1000} kg` : `${weight} g (${(weight / 1000).toFixed(3)} kg)`}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {weight < 1000 ? t("rule12Under") : t("rule12Over")}
                  </p>
                </div>

                {/* Mandatory Checklist */}
                <div className="bg-slate-800/70 border border-amber-500/30 rounded-2xl p-5">
                  <div className="text-xs text-amber-400 font-extrabold tracking-wider mb-3 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> {t("checklistTitle")}
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <li className="flex gap-2"><span>[ ]</span> {t("checklistMrp")}</li>
                    <li className="flex gap-2"><span>[ ]</span> {t("checklistMonth")}</li>
                    <li className="flex gap-2"><span>[ ]</span> {t("checklistCare")}</li>
                    <li className="flex gap-2"><span>[ ]</span> {t("checklistMfr")}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between text-[11px] text-slate-400">
              <span>{t("actLabel")}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t("pcrVerified")}
              </span>
            </div>
          </div>
        </div>
        </main>
      </div>
    </AuthGuard>
  );
}
