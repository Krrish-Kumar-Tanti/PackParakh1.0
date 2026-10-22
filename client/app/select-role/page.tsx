"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  FileCheck2, 
  User, 
  Landmark, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Sparkles,
  Building2,
  CheckCircle2,
  Lock,
  ChevronRight
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { selectRoleDict } from "@/lib/i18n-pages/selectRole";

export default function SelectRolePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = makePageT(language, selectRoleDict);
  const isHi = language === "hi";

  const [userEmail, setUserEmail] = useState<string>("officer.rajesh.lmo@gmail.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("google_user_email");
      if (stored) {
        setUserEmail(stored);
      }
    }
  }, []);

  const handleSelectRole = (role: "lmo" | "msme" | "citizen") => {
    // Navigates directly to the current login page with the selected role!
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div>
        <TopStatusBar />
        <Navbar />

        <div className="flex flex-col items-center pt-10 pb-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

          {/* Back to previous */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full max-w-6xl mb-4 flex justify-start relative z-10"
          >
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/gmail-login");
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHi ? "वापस जाएं" : "Back to previous"}</span>
            </button>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mb-8 relative z-10"
          >
            {/* Google Logged In Ribbon */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xs text-slate-700 text-xs font-bold mb-4 max-w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-slate-500">{t("auth.googleAuthenticated")}</span>
              <span className="font-mono text-blue-600 font-bold truncate max-w-[180px] sm:max-w-none">{userEmail}</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <Link href="/gmail-login" className="text-slate-500 hover:text-slate-900 text-[11px] underline shrink-0">
                {t("auth.switchAccount")}
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3 leading-[1.15]">
              {t("heading.title")}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              {t("heading.subtitle")}
            </p>
          </motion.div>

          {/* The Three Option Cards */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {/* OPTION 1: LEGAL METROLOGY OFFICER (LMO) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Hero Background Image */}
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src="/images/kirana_store_field_audit.jpg"
                  alt="Kirana store field audit"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-amber-800/40 to-white"></div>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-amber-900 border border-amber-200 shadow-sm">
                    {t("cards.lmo.option")}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-8 pt-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">
                    {t("cards.lmo.title")}
                  </h2>
                  <p className="text-xs text-amber-800 font-bold mb-4">
                    {t("cards.lmo.role")}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {t("cards.lmo.description")}
                  </p>

                  <div className="border-t border-slate-100 pt-4 mb-6 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{t("cards.lmo.features.0")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{t("cards.lmo.features.1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{t("cards.lmo.features.2")}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectRole("lmo")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm group-hover:bg-amber-600"
                >
                  <span>{t("cards.lmo.button")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* OPTION 2: MSME BRAND MANUFACTURER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Hero Background Image */}
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src="/images/macro_font_calibration.jpg"
                  alt="Macro font calibration"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-800/40 to-white"></div>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-md">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-blue-900 border border-blue-200 shadow-sm">
                    {t("cards.msme.option")}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-8 pt-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">
                    {t("cards.msme.title")}
                  </h2>
                  <p className="text-xs text-blue-800 font-bold mb-4">
                    {t("cards.msme.role")}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {t("cards.msme.description")}
                  </p>

                  <div className="border-t border-slate-100 pt-4 mb-6 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{t("cards.msme.features.0")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{t("cards.msme.features.1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{t("cards.msme.features.2")}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectRole("msme")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm group-hover:bg-blue-600"
                >
                  <span>{t("cards.msme.button")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* OPTION 3: PUBLIC CONSUMER CITIZEN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Hero Background Image */}
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src="/images/ecom_quickcommerce_audit.jpg"
                  alt="E-commerce quick commerce audit"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-emerald-800/40 to-white"></div>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-emerald-900 border border-emerald-200 shadow-sm">
                    {t("cards.citizen.option")}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-8 pt-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">
                    {t("cards.citizen.title")}
                  </h2>
                  <p className="text-xs text-emerald-800 font-bold mb-4">
                    {t("cards.citizen.role")}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {t("cards.citizen.description")}
                  </p>

                  <div className="border-t border-slate-100 pt-4 mb-6 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t("cards.citizen.features.0")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t("cards.citizen.features.1")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t("cards.citizen.features.2")}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectRole("citizen")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm group-hover:bg-emerald-600"
                >
                  <span>{t("cards.citizen.button")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
