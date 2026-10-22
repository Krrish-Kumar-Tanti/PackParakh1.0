"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Scale, FileText, CheckCircle2, ShieldCheck, ChevronRight } from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { actRulesDict } from "@/lib/i18n-pages/actRules";

export default function ActAndRulesPage() {
  const { language } = useLanguage();
  const t = makePageT(language, actRulesDict);

  const sections = t.sections as { num: string; title: string; desc: string; badge: string }[];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <TopStatusBar />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold mb-4 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Rule Cards Grid */}
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {sec.num}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {sec.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
