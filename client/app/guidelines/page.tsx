"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Ruler, FileCheck, Layers } from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { guidelinesDict } from "@/lib/i18n-pages/guidelines";

export default function GuidelinesPage() {
  const { language } = useLanguage();
  const t = makePageT(language, guidelinesDict);
  const guidelines = t.guidelines as unknown as { title: string; role: string; items: string[] }[];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <TopStatusBar />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-4 uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {guidelines.map((g, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">{g.title}</h3>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full self-start">
                  {g.role}
                </span>
              </div>
              <ul className="space-y-3">
                {g.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
