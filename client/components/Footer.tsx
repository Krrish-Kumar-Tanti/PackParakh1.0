"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Landmark, ShieldCheck, Phone, Mail, ExternalLink, FileText, ChevronRight, HelpCircle, Lock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth, getAuthUser } from "@/lib/auth";
import { makePageT } from "@/lib/i18n-page";
import { footerDict } from "@/lib/i18n-pages/footer";

export default function Footer() {
  const { language } = useLanguage();
  const t = makePageT(language, footerDict);
  const router = useRouter();
  const user = useAuth();

  // Guarded navigation: if not authenticated, send to sign-in with ?next=
  const handleGuardedNav = (href: string) => {
    const authed = !!getAuthUser();
    if (authed) {
      router.push(href);
    } else {
      router.push(`/gmail-login?notice=auth-required&next=${encodeURIComponent(href)}`);
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 relative z-10">
      {/* Top Ministry Ribbon — COMPACT */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-100 text-[12px]">
                {t("ministry.title")}
              </p>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {t("ministry.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t("status.badge")}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 font-mono text-[10px]">{t("status.sipId")}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Directory — COMPACT: py-6, reduced gaps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          
          {/* Col 1: Brand & Purpose */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-white tracking-tight">PackParakh</span>
                  <span className="text-[11px] text-blue-400 font-bold">(पैक-परख)</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {t("brand.tagline")}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
              {t("brand.description")}
            </p>

            <div className="pt-1 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">
                  <strong>{t("contact.helplineLabel")}</strong>{" "}
                  <a href="tel:1915" className="text-blue-400 hover:underline font-bold">1915</a> {t("contact.helplineTollFree")} {t("contact.helplineSms", { number: "8800001915" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">
                  <strong>{t("contact.nodalLabel")}</strong>{" "}
                  <a href="mailto:dir-wm-ca@nic.in" className="text-blue-400 hover:underline">dir-wm-ca@nic.in</a>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Inspection Services — AUTH-GATED */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-200 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              {t("services.title")}
              <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] font-mono bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700">
                <Lock className="w-2.5 h-2.5" /> auth
              </span>
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleGuardedNav("/scan")}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left w-full cursor-pointer group"
                  title={user ? "Open Package Scanner" : "Sign in required — redirects to login"}
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span>{t("services.scanner")}</span>
                  {!user && <Lock className="w-2.5 h-2.5 text-slate-500 ml-auto" />}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGuardedNav("/scan?mode=field")}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left w-full cursor-pointer group"
                  title={user ? "Open LMO Field Audit" : "Sign in required"}
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span>{t("services.raidAudit")}</span>
                  {!user && <Lock className="w-2.5 h-2.5 text-slate-500 ml-auto" />}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGuardedNav("/simulate")}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left w-full cursor-pointer group"
                  title={user ? "Open MSME Studio" : "Sign in required"}
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span>{t("services.studio")}</span>
                  {!user && <Lock className="w-2.5 h-2.5 text-slate-500 ml-auto" />}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGuardedNav("/login")}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left w-full cursor-pointer group"
                  title="Secure Access Gateway"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span>{t("services.login")}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleGuardedNav("/helpdesk")}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left w-full cursor-pointer group"
                  title={user ? "Open Grievance" : "Sign in required"}
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span>{t("services.helpdesk")}</span>
                  {!user && <Lock className="w-2.5 h-2.5 text-slate-500 ml-auto" />}
                </button>
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 mt-2 leading-tight">🔒 Requires Sign-In — redirects to authentication.</p>
          </div>

          {/* Col 3: Legal & Regulatory Citations */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-200 mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              {t("acts.title")}
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <Link href="/act-and-rules" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Legal Metrology Act, 2009</span>
                </Link>
              </li>
              <li>
                <Link href="/act-and-rules#pcr" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>PCR 2011 (Packaged Commodities)</span>
                </Link>
              </li>
              <li>
                <Link href="/guidelines#font-size" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Rule 7 Font Height Standards</span>
                </Link>
              </li>
              <li>
                <Link href="/guidelines#usp" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t("acts.uspMandate")}</span>
                </Link>
              </li>
              <li>
                <Link href="/guidelines#bsa" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t("acts.bsa")}</span>
                </Link>
              </li>
              <li>
                <Link href="/act-and-rules#jan-vishwas" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t("acts.janVishwas")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & Helpdesk */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-200 mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              {t("policies.title")}
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <Link href="/guidelines" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t("policies.guidelines")}</span>
                </Link>
              </li>
              <li>
                <Link href="/helpdesk" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t("policies.helpdesk")}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t("policies.nodalOfficers")}</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                  <span>consumeraffairs.nic.in</span>
                </a>
              </li>
              <li>
                <a
                  href="https://consumerhelpline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                  <span>consumerhelpline.gov.in</span>
                </a>
              </li>
              <li>
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                  <span>CPGRAMS (pgportal.gov.in)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal Strip — COMPACT */}
      <div className="border-t border-slate-800 bg-slate-950 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span>{t("bottom.copyright", { year: "2026" })}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <Link href="/guidelines" className="hover:text-slate-400 transition-colors">
              {t("bottom.privacy")}
            </Link>
            <Link href="/guidelines" className="hover:text-slate-400 transition-colors">
              {t("bottom.terms")}
            </Link>
            <Link href="/guidelines" className="hover:text-slate-400 transition-colors hidden md:inline">
              {t("bottom.accessibility")}
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors hidden md:inline">
              {t("bottom.hyperlink")}
            </Link>
          </div>
          <div className="text-[10px] text-slate-500 hidden lg:block shrink-0">
            {t("bottom.compliance")}
          </div>
        </div>
      </div>
    </footer>
  );
}
