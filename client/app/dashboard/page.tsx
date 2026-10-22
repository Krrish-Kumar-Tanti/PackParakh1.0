"use client";

import React, { useState, Suspense } from "react";
import {
  ShieldCheck, TrendingDown, TrendingUp, Clock, AlertTriangle,
  Building2, Search, Filter, Download, ArrowUpRight, ChevronRight,
  BarChart3, Award, FileText, CheckCircle2,
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { dashboardDict } from "@/lib/i18n-pages/dashboard";

interface BrandOffender {
  id: string;
  brand: string;
  company: string;
  violationsCount: number;
  primaryInfraction: string;
  category: string;
  penaltyClause: string;
  penaltyAmount: string;
  escalationTier: "FIRST" | "SECOND" | "CRITICAL";
  status: "NOTICE_SENT" | "PENDING_HEARING" | "COMPOUNDED";
}

const BRAND_DATA: BrandOffender[] = [
  {
    id: "BO-01",
    brand: "QuickSnack Namkeen",
    company: "Desi Snacks Confectionery Pvt Ltd",
    violationsCount: 14,
    primaryInfraction: "Missing Unit Sale Price (USP) & illegal 'gms' symbol",
    category: "Food & Beverages",
    penaltyClause: "Section 36(1) / Section 29 LM Act",
    penaltyAmount: "₹ 50,000",
    escalationTier: "SECOND",
    status: "PENDING_HEARING",
  },
  {
    id: "BO-02",
    brand: "GlowRadiance Serum",
    company: "Apex Wellness Imports Ltd",
    violationsCount: 9,
    primaryInfraction: "Rule 6(1)(g) Country of Origin omitted on e-com listing",
    category: "Cosmetics",
    penaltyClause: "GSR 418(E) / Sec 36 LM Act",
    penaltyAmount: "₹ 25,000",
    escalationTier: "FIRST",
    status: "NOTICE_SENT",
  },
  {
    id: "BO-03",
    brand: "PureGhee Gold 1L",
    company: "Swastik Dairy Products Ltd",
    violationsCount: 22,
    primaryInfraction: "Shrinkflation short-fill (880ml packed as 1000ml)",
    category: "Dairy & Oils",
    penaltyClause: "Section 30 (Under-filling Penalty)",
    penaltyAmount: "₹ 1,00,000",
    escalationTier: "CRITICAL",
    status: "PENDING_HEARING",
  },
  {
    id: "BO-04",
    brand: "TurboPower Cable 65W",
    company: "VoltTech Accessories LLP",
    violationsCount: 5,
    primaryInfraction: "Address not declared; QR pilot expired",
    category: "Electronics",
    penaltyClause: "GSR 577(E) / Sec 36",
    penaltyAmount: "₹ 25,000",
    escalationTier: "FIRST",
    status: "COMPOUNDED",
  },
  {
    id: "BO-05",
    brand: "Royal Chai Masala 500g",
    company: "Royal Heritage Beverages Pvt Ltd",
    violationsCount: 0,
    primaryInfraction: "None — 100% PCR 2011 Verified Benchmark",
    category: "Food & Beverages",
    penaltyClause: "NIL (Compliant)",
    penaltyAmount: "₹ 0",
    escalationTier: "FIRST",
    status: "COMPOUNDED",
  },
];

const DISTRICT_DATA = [
  { districtEn: "South Delhi (NCT)", districtHi: "दक्षिण दिल्ली", compliant: 1840, violations: 280, pct: 86.8 },
  { districtEn: "Pune Urban (MH)", districtHi: "पुणे शहर", compliant: 1520, violations: 310, pct: 83.1 },
  { districtEn: "Lucknow Central (UP)", districtHi: "लखनऊ केंद्रीय", compliant: 1290, violations: 420, pct: 75.4 },
  { districtEn: "Bengaluru South (KA)", districtHi: "बेंगलुरु दक्षिण", compliant: 1980, violations: 190, pct: 91.2 },
  { districtEn: "Mumbai Suburban (MH)", districtHi: "मुंबई उपनगर", compliant: 2150, violations: 380, pct: 85.0 },
];

function DashboardContent() {
  const { language } = useLanguage();
  const t = makePageT(language, dashboardDict);
  const [selectedState, setSelectedState] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [issuedNotices, setIssuedNotices] = useState<Record<string, boolean>>({});

  const handleIssueNotice = (id: string) => {
    setIssuedNotices((prev) => ({ ...prev, [id]: true }));
  };

  const filteredBrands = BRAND_DATA.filter((b) => {
    const matchesSearch =
      b.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <AuthGuard>
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
            {t("home")}
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">
            {t("breadcrumb")}
          </span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Header & State Filter ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="animate-fade-in delay-100 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {t("pill")}
            </div>
            <h1 className="animate-fade-in delay-150 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {t("title")}
            </h1>
            <p className="animate-fade-in delay-200 text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          <div className="animate-fade-in delay-200 flex items-center gap-2 self-start md:self-auto">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ALL">{t("panIndia")}</option>
              <option value="DL">Delhi (NCT)</option>
              <option value="MH">Maharashtra</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="KA">Karnataka</option>
              <option value="TN">Tamil Nadu</option>
            </select>

            <a
              href="/verify"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("publicTracker")}</span>
            </a>
          </div>
        </div>

        {/* ─── 4 Macro KPI Counters ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            {
              titleKey: "audits",
              value: "142,890",
              icon: BarChart3,
              accent: "blue",
              bg: "bg-blue-50",
              border: "border-blue-200/80",
              trend: "up",
            },
            {
              titleKey: "defect",
              value: "14.2%",
              icon: TrendingDown,
              accent: "emerald",
              bg: "bg-emerald-50",
              border: "border-emerald-200/80",
              trend: "down",
            },
            {
              titleKey: "notices",
              value: "8,412",
              icon: FileText,
              accent: "amber",
              bg: "bg-amber-50",
              border: "border-amber-200/80",
              trend: "up",
            },
            {
              titleKey: "hours",
              value: "35,722 h",
              icon: Clock,
              accent: "violet",
              bg: "bg-violet-50",
              border: "border-violet-200/80",
              trend: "up",
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                style={{ animationDelay: `${250 + i * 80}ms` }}
                className={`animate-fade-in bg-white rounded-3xl border ${kpi.border} p-5 shadow-xs flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-500">
                    {t(`kpis.${kpi.titleKey}.title`)}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{t(`kpis.${kpi.titleKey}.sub`)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── District Compliance & Violation Breakdown Chart ─── */}
        <div className="animate-fade-in delay-500 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-black text-slate-900">
                {t("districtTitle")}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("districtSub")}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
                {t("compliant")}
              </span>
              <span className="flex items-center gap-1.5 text-red-600">
                <span className="w-3 h-3 rounded-md bg-red-500 inline-block" />
                {t("breaches")}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {DISTRICT_DATA.map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {language === "hi" ? d.districtHi : d.districtEn}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {t("districtStat", { pct: d.pct, compliant: t("compliantShort"), pass: d.compliant, fail: d.violations })}
                  </span>
                </div>
                {/* Visual Bar */}
                <div className="h-3.5 w-full bg-red-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${d.pct}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Brand Repeat Offender Ledger ─── */}
        <div className="animate-fade-in delay-650 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-black text-slate-900">
                  {t("ledgerTitle")}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("ledgerSub")}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">{t("table.brand")}</th>
                  <th className="py-3 px-4">{t("table.category")}</th>
                  <th className="py-3 px-4">{t("table.violations")}</th>
                  <th className="py-3 px-4">{t("table.infraction")}</th>
                  <th className="py-3 px-4">{t("table.clause")}</th>
                  <th className="py-3 px-4 text-right">{t("table.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBrands.map((b) => {
                  const noticeIssued = issuedNotices[b.id];
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{b.brand}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.company}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{b.category}</td>
                      <td className="py-3.5 px-4">
                        {b.violationsCount === 0 ? (
                          <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {t("table.clean")}
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              b.violationsCount > 15
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {t("table.incidents", { count: b.violationsCount })}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">{b.primaryInfraction}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] text-slate-800 font-bold">{b.penaltyClause}</div>
                        <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                          {t("table.compounding")} {b.penaltyAmount}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {b.violationsCount === 0 ? (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {t("table.certified")}
                          </span>
                        ) : noticeIssued ? (
                          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                            {t("table.noticeDispatched")}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleIssueNotice(b.id)}
                            className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-2xs"
                          >
                            {t("table.issueNotice")}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

          {/* ─── Footer ─── */}
          <footer className="animate-fade-in delay-800 mt-12 border-t border-slate-200/80 pt-6 text-center text-xs text-slate-500">
            <p className="font-bold text-slate-700">
              {t("footer1")}
            </p>
            <p className="mt-1">{t("footer2")}</p>
          </footer>
        </main>
      </div>
    </AuthGuard>
  );
}

export default function DashboardPage() {
  const { language } = useLanguage();
  const t = makePageT(language, dashboardDict);
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">{t("loading")}</div>}>
      <DashboardContent />
    </Suspense>
  );
}
