"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, Search, ArrowRight, FileCheck, Award,
  CheckCircle2, ChevronRight, Lock,
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { verifyDict } from "@/lib/i18n-pages/verify";

const SAMPLE_TOKENS = [
  { id: "DOCA/DL/2026/991A-8F3A", labelKey: "samples.royalChai", status: "PASS" },
  { id: "DOCA/MH/2026/410C-8F3A", labelKey: "samples.greenTea", status: "REVIEW" },
  { id: "DOCA/UP/2026/804D-8F3A", labelKey: "samples.namkeen", status: "FAIL" },
];

export default function VerifySearchPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = makePageT(language, verifyDict);
  const [inputToken, setInputToken] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      router.push(`/verify/${encodeURIComponent(inputToken.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="animate-fade-in-down">
        <TopStatusBar />
      </div>

      <div className="animate-fade-in-down delay-50">
        <Navbar />
      </div>

      {/* Breadcrumb */}
      <div className="animate-fade-in delay-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <a href="/" className="hover:text-amber-700 transition-colors font-medium">
            {t("breadcrumb.home")}
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">
            {t("breadcrumb.current")}
          </span>
        </nav>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="animate-fade-in delay-100 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-extrabold tracking-widest uppercase mb-4 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            {t("badge")}
          </div>
          <h1 className="animate-fade-in delay-150 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t("heading")}
          </h1>
          <p className="animate-fade-in delay-200 text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* ─── Search Bar Card ─── */}
        <div className="animate-fade-in delay-250 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>{t("searchButton")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ─── Quick Sample Cases ─── */}
        <div className="animate-fade-in delay-350 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
            {t("quickSampleTitle")}
          </h3>

          <div className="space-y-2">
            {SAMPLE_TOKENS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => router.push(`/verify/${encodeURIComponent(sample.id)}`)}
                className="w-full p-4 rounded-2xl border border-slate-200/80 hover:border-amber-300 bg-slate-50/60 hover:bg-amber-50/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-mono text-xs font-black text-slate-900 group-hover:text-amber-900">
                    {sample.id}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t(sample.labelKey)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      sample.status === "PASS"
                        ? "bg-emerald-100 text-emerald-800"
                        : sample.status === "REVIEW"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sample.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
