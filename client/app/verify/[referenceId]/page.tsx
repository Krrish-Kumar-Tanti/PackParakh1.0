"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText,
  Printer, ArrowLeft, Lock, Award, Share2, ChevronRight,
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { verifyRefDict } from "@/lib/i18n-pages/verifyRef";

import { getCurrentScan, ScanResult } from "@/lib/scanData";

export default function VerifyDetailPage() {
  const params = useParams();
  const rawId = (params?.referenceId as string) || "DOCA/DL/2026/991A-8F3A";
  const referenceId = decodeURIComponent(rawId);
  const { language } = useLanguage();
  const t = makePageT(language, verifyRefDict);
  const [printed, setPrinted] = useState(false);

  // Dynamic Scan Synchronization
  const [scan, setScan] = useState<ScanResult | null>(null);

  React.useEffect(() => {
    const active = getCurrentScan();
    if (active) {
      setScan(active);
    }
  }, []);

  const formVCitation = t("formCitation");
  const productName = scan?.productName || "Packaged Retail Commodity";
  const entityValue = `${scan?.brandName || "Inspected Brand"} · ${scan?.jurisdictionState || "Delhi (NCT)"}`;
  const score = scan?.complianceScore ?? 100;
  const scorePts = `${score} / 100 PTS`;
  const passStatus = score >= 90 ? t("passStatus") : score >= 70 ? "PENDING REVIEW" : "STATUTORY SEIZURE MANDATED";
  const chainLabel = t("chainLabel");
  const authenticStatus = t("authentic");
  const hashValue = scan?.sha256Hash || "e89b4f2c019d384029471b84920c5d9eb3214a51e604f81c9a0937a4c7402601";
  
  const scanDate = scan?.timestamp ? new Date(scan.timestamp) : new Date();
  const filedDate = scanDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const hearingDate = new Date(scanDate.getTime() + 7 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const officerBadge = scan?.officerBadgeNo || "DL-LMO-0842";
  const jurisdictionValue = scan?.jurisdictionState || "Delhi (NCT)";

  const handlePrint = () => {
    setPrinted(true);
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const steps = [
    {
      num: "01",
      name: t("stepNames.submitted"),
      date: scanDate.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST",
      done: true,
      desc: "steps.submitted",
    },
    {
      num: "02",
      name: t("stepNames.review"),
      date: scanDate.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST",
      done: true,
      desc: "steps.review",
      vars: { officer: officerBadge },
    },
    {
      num: "03",
      name: score >= 90 ? "STATUTORY SEALED" : t("stepNames.notice"),
      date: scanDate.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST",
      done: true,
      desc: score >= 90 ? "actions.dashboard" : "steps.notice",
    },
    {
      num: "04",
      name: score >= 90 ? "CLOSED / COMPLIANT" : t("stepNames.closed"),
      date: score >= 90 ? "Zero Violations" : "Pending Hearing",
      done: score >= 90,
      desc: "steps.closed",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans print:bg-white">
      <div className="print:hidden animate-fade-in-down">
        <TopStatusBar />
      </div>

      <div className="print:hidden animate-fade-in-down delay-50">
        <Navbar />
      </div>

      {/* Breadcrumb */}
      <div className="print:hidden animate-fade-in delay-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <a href="/" className="hover:text-amber-700 transition-colors font-medium">
            {t("breadcrumb.home")}
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <a href="/verify" className="hover:text-amber-700 transition-colors font-medium">
            {t("breadcrumb.portal")}
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold font-mono">{referenceId}</span>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Certificate Header */}
        <div className="animate-fade-in delay-100 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {t("badge")}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-mono">
            {t("tokenId", { id: referenceId })}
          </p>
        </div>

        {/* ─── State Stepper (4 Stages) ─── */}
        <div className="animate-fade-in delay-200 bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs mb-8 print:border-none">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 sm:mb-6">
            {t("timeline")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  s.done
                    ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-950"
                    : "bg-slate-50 border-slate-200/70 text-slate-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold opacity-70">{s.num}</span>
                    {s.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs font-black">
                    {s.name}
                  </div>
                  <p className="text-[10px] mt-1 leading-snug opacity-80">
                    {t(s.desc, s.vars)}
                  </p>
                </div>
                <div className="text-[9px] font-mono font-bold mt-3 opacity-60">
                  {s.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Case Details Card ─── */}
        <div className="animate-fade-in delay-350 bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                {formVCitation}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                {productName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t("entity", { entity: entityValue })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-medium">{t("verdict")}</span>
              <span className="text-lg font-black text-emerald-700 font-mono">{scorePts}</span>
              <span className="text-[10px] font-bold text-emerald-600 block">{passStatus}</span>
            </div>
          </div>

          {/* Cryptographic Proof Row */}
          <div className="p-4 bg-slate-900 rounded-2xl text-slate-300 font-mono space-y-1.5 border border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Lock className="w-3.5 h-3.5" />
                {chainLabel}
              </span>
              <span className="text-emerald-400 font-bold">{authenticStatus}</span>
            </div>
            <div className="text-xs text-amber-300 font-bold break-all">
              {hashValue}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("metadata.filed")}</span>
              <span className="font-bold text-slate-900 font-mono">{filedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("metadata.hearing")}</span>
              <span className="font-bold text-red-600 font-mono">{hearingDate}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("metadata.officer")}</span>
              <span className="font-bold text-slate-900 font-mono">{officerBadge}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{t("metadata.jurisdiction")}</span>
              <span className="font-bold text-slate-900">{jurisdictionValue}</span>
            </div>
          </div>

          {/* Print & Action Buttons */}
          <div className="print:hidden pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{t("actions.print")}</span>
            </button>

            <a
              href="/dashboard"
              className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{t("actions.dashboard")}</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
