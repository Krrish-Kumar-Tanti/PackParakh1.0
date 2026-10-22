"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  FileCheck2, 
  User, 
  Fingerprint, 
  Landmark, 
  Zap, 
  Database, 
  FileDigit, 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  X, 
  HelpCircle, 
  Phone, 
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { loginDict } from "@/lib/i18n-pages/login";
import { notifyAuthChange } from "@/lib/auth";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noticeParam = searchParams?.get("notice");
  const roleParam = searchParams?.get("role");

  const { language } = useLanguage();
  const t = makePageT(language, loginDict);
  const isHi = language === "hi";

  type TabType = "lmo" | "msme" | "sso" | "citizen";
  const [activeTab, setActiveTab] = useState<TabType>("lmo");

  useEffect(() => {
    if (roleParam && ["lmo", "msme", "sso", "citizen"].includes(roleParam)) {
      setActiveTab(roleParam as TabType);
    }
  }, [roleParam]);

  // Form Fields
  const [lmoState, setLmoState] = useState("Delhi (NCT)");
  const [badgeNo, setBadgeNo] = useState("");
  const [password, setPassword] = useState("");
  const [gstin, setGstin] = useState("");
  const [email, setEmail] = useState("");
  const [ssoToken, setSsoToken] = useState("");

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Validation Logic
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (activeTab === "lmo") {
      if (!badgeNo.trim()) {
        errs.badgeNo = t("validation.badgeRequired");
      } else if (badgeNo.trim().length < 5) {
        errs.badgeNo = t("validation.badgeFormat");
      }

      if (!password) {
        errs.password = t("validation.passwordRequired");
      } else if (password.length < 4) {
        errs.password = t("validation.passwordShort");
      }
    } else if (activeTab === "msme") {
      const gstinClean = gstin.trim().toUpperCase();
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinClean) {
        errs.gstin = t("validation.gstinRequired");
      } else if (!gstinRegex.test(gstinClean) && gstinClean.length !== 15) {
        errs.gstin = t("validation.gstinFormat");
      }

      if (!password) {
        errs.password = t("validation.brandKeyRequired");
      }
    } else if (activeTab === "sso") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        errs.email = t("validation.emailRequired");
      } else if (!emailRegex.test(email.trim())) {
        errs.email = t("validation.emailValid");
      }

      if (!ssoToken.trim()) {
        errs.ssoToken = t("validation.tokenRequired");
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "citizen") {
      setIsLoading(true);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user_authenticated", "true");
          localStorage.setItem("user_role", "citizen");
          notifyAuthChange();
        }
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          // Citizen routes directly to /scan according to implementation plan
          router.push("/scan");
        }, 300);
      }, 400);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate official gateway cryptographic verification
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user_authenticated", "true");
        localStorage.setItem("user_role", activeTab);
        if (activeTab === "lmo") {
          localStorage.setItem("user_badge", badgeNo || "DL-LMO-2026");
          localStorage.setItem("user_state", lmoState);
        } else if (activeTab === "msme") {
          localStorage.setItem("user_gstin", gstin.toUpperCase() || "07AAAAA0000A1Z5");
        }
        notifyAuthChange();
      }

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        // Return to further next page according to plan in files and implementation
        if (activeTab === "lmo") {
          router.push(`/scan?mode=field`);
        } else if (activeTab === "msme") {
          router.push(`/simulate?gstin=${encodeURIComponent(gstin.toUpperCase() || "07AAAAA0000A1Z5")}`);
        } else if (activeTab === "sso") {
          router.push(`/dashboard?role=controller&email=${encodeURIComponent(email || "controller@nic.in")}`);
        } else {
          router.push("/scan");
        }
      }, 400);
    }, 700);
  };

  return (
    <div className="w-full max-w-2xl relative z-10 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative overflow-hidden transition-all duration-300"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500"></div>

        {/* Google Session & Role Switcher Banner */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 mb-5 text-slate-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-600">{t("session.active")}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{t("session.step2")}</span>
          </div>
          <Link href="/select-role" className="text-blue-600 hover:text-blue-800 font-bold text-[11px] shrink-0">
            ← {t("session.switchRole")}
          </Link>
        </div>

        {/* Upper Hero Photo Banner - Strictly Contained Inside This Rectangular Box Only */}
        <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-2xl mb-6 border border-slate-200 shadow-xs">
          <img
            src="/images/two_step_verification.jpg"
            alt="PackParakh 2-Step Verification Gateway"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/95 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {isHi ? "चरण 2: क्रेडेंशियल एवं 2FA सत्यापन" : "Step 2: Credential & 2FA Verification"}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div>
              <p className="text-xs font-bold text-white drop-shadow">
                {isHi ? "विधिक मापविज्ञान अधिकारी एवं एमएसएमई पोर्टल" : "Legal Metrology Officer & MSME Portal"}
              </p>
              <p className="text-[10px] text-slate-300">
                {isHi ? "बायोमेट्रिक, पासवर्ड एवं ओटीपी सुरक्षा गेटवे" : "Biometric, Password & OTP Security Gateway"}
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded text-white backdrop-blur-md">
              SHA-256 BSA 2023
            </span>
          </div>
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {t("header.title")}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t("header.subtitle")}
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold">SHA-256 SECURED</span>
          </div>
        </div>

        {/* Role Navigation Tabs */}
        <div className="p-1 bg-slate-100/90 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1 mb-6">
          {[
            { id: "lmo", label: t("roles.lmo"), icon: ShieldCheck, color: "text-amber-600" },
            { id: "msme", label: t("roles.msme"), icon: FileCheck2, color: "text-blue-600" },
            { id: "sso", label: t("roles.sso"), icon: KeyRound, color: "text-indigo-600" },
            { id: "citizen", label: t("roles.citizen"), icon: User, color: "text-emerald-600" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setErrors({});
                }}
                className={cn(
                  "py-2.5 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                  isActive
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 scale-[1.01]"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", tab.color)} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* LMO OFFICER TAB */}
          {activeTab === "lmo" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <p className="leading-relaxed">
                  {t("descriptions.lmo")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t("fields.jurisdiction")}
                  </label>
                  <select
                    value={lmoState}
                    onChange={(e) => setLmoState(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800 font-medium"
                  >
                    <option>Delhi (NCT)</option>
                    <option>Maharashtra</option>
                    <option>Uttar Pradesh</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>Gujarat</option>
                    <option>West Bengal</option>
                    <option>Rajasthan</option>
                    <option>Madhya Pradesh</option>
                    <option>Punjab</option>
                    <option>Haryana</option>
                    <option>Bihar</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t("fields.badge")}
                  </label>
                  <input
                    type="text"
                    value={badgeNo}
                    onChange={(e) => {
                      setBadgeNo(e.target.value);
                      if (errors.badgeNo) setErrors((prev) => ({ ...prev, badgeNo: "" }));
                    }}
                    placeholder={t("fields.badgePlaceholder")}
                    className={cn(
                      "w-full border rounded-xl px-3 py-2.5 text-sm focus:ring-2 outline-none font-medium text-slate-800",
                      errors.badgeNo 
                        ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400" 
                        : "border-slate-200 focus:ring-blue-500"
                    )}
                  />
                  {errors.badgeNo && (
                    <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.badgeNo}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {t("fields.password")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {t("fields.forgot")}
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••••••••"
                  className={cn(
                    "w-full border rounded-xl px-3 py-2.5 text-sm focus:ring-2 outline-none text-slate-800 font-medium",
                    errors.password 
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400" 
                      : "border-slate-200 focus:ring-blue-500"
                  )}
                />
                {errors.password && (
                  <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* MSME BRAND TAB */}
          {activeTab === "msme" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-blue-50/90 border border-blue-200/80 rounded-2xl p-3.5 text-xs text-blue-900 flex gap-3">
                <FileCheck2 className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                <p className="leading-relaxed">
                  {t("descriptions.msme")}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t("fields.gstin")}
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => {
                    setGstin(e.target.value);
                    if (errors.gstin) setErrors((prev) => ({ ...prev, gstin: "" }));
                  }}
                  placeholder="07AAAAA0000A1Z5"
                  maxLength={15}
                  className={cn(
                    "w-full border rounded-xl px-3 py-2.5 text-sm uppercase tracking-wider font-mono focus:ring-2 outline-none text-slate-800",
                    errors.gstin 
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400" 
                      : "border-slate-200 focus:ring-blue-500"
                  )}
                />
                {errors.gstin && (
                  <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.gstin}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {t("fields.brandKey")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {t("fields.forgot")}
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••••••••"
                  className={cn(
                    "w-full border rounded-xl px-3 py-2.5 text-sm focus:ring-2 outline-none text-slate-800 font-medium",
                    errors.password 
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400" 
                      : "border-slate-200 focus:ring-blue-500"
                  )}
                />
                {errors.password && (
                  <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* SSO LOGIN TAB */}
          {activeTab === "sso" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-indigo-50/90 border border-indigo-200/80 rounded-2xl p-3.5 text-xs text-indigo-900 flex gap-3">
                <KeyRound className="h-5 w-5 shrink-0 text-indigo-600 mt-0.5" />
                <p className="leading-relaxed">
                  {t("descriptions.sso")}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t("fields.email")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="officer@nic.in"
                    className={cn(
                      "w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 outline-none text-slate-800 font-medium",
                      errors.email 
                        ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400" 
                        : "border-slate-200 focus:ring-blue-500"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {t("fields.parichay")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {t("fields.tokenHelp")}
                  </button>
                </div>
                <input
                  type="password"
                  value={ssoToken}
                  onChange={(e) => {
                    setSsoToken(e.target.value);
                    if (errors.ssoToken) setErrors((prev) => ({ ...prev, ssoToken: "" }));
                  }}
                  placeholder="••••••••"
                  className={cn(
                    "w-full border rounded-xl px-3 py-2.5 text-sm focus:ring-2 outline-none text-slate-800 font-medium",
                    errors.ssoToken 
                      ? "border-rose-400 bg-rose-50/20 focus:ring-rose-400" 
                      : "border-slate-200 focus:ring-blue-500"
                  )}
                />
                {errors.ssoToken && (
                  <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.ssoToken}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* CITIZEN TAB */}
          {activeTab === "citizen" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 flex gap-3">
                <User className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 mb-1">
                    {t("fields.citizenTitle")}
                  </p>
                  <p className="leading-relaxed text-emerald-800">
                    {t("fields.citizenDesc")}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("fields.citizenInstant")}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("fields.citizenMSP")}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("fields.citizenEvidence")}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full font-bold rounded-xl py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md",
                activeTab === "lmo" && "bg-slate-900 hover:bg-slate-800 text-white",
                activeTab === "msme" && "bg-blue-600 hover:bg-blue-700 text-white",
                activeTab === "sso" && "bg-indigo-600 hover:bg-indigo-700 text-white",
                activeTab === "citizen" && "bg-emerald-600 hover:bg-emerald-700 text-white",
                isLoading && "opacity-80 cursor-wait"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("status.authenticating")}</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{t("status.authenticated")}</span>
                </>
              ) : activeTab === "citizen" ? (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>{t("status.scan")}</span>
                </>
              ) : activeTab === "lmo" ? (
                <>
                  <Fingerprint className="h-4 w-4 text-amber-400" />
                  <span>{t("status.lmo")}</span>
                </>
              ) : activeTab === "msme" ? (
                <>
                  <span>{t("status.msme")}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 text-indigo-300" />
                  <span>{t("status.sso")}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Bottom Onboarding & Help Links */}
        <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-medium text-slate-600">
              {t("onboarding.title")}
            </span>
            <Link href="/helpdesk" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">
              {t("onboarding.request")}
            </Link>
          </div>
          <Link href="/act-and-rules" className="text-slate-500 hover:text-slate-800 font-semibold">
            {t("footer.mandates")}
          </Link>
        </div>
      </motion.div>

      {/* Forgot Password / Access Key Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {t("footer.help")}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("footer.helpDetail")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-slate-900">
                    {t("footer.lmo")}
                  </p>
                  <p>
                    {t("footer.lmoDetail")}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-slate-900">
                    {t("footer.msme")}
                  </p>
                  <p>
                    {t("footer.msmeDetail")}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{t("footer.helpline")} <strong>011-23386123</strong> / 1915</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{t("footer.nodal")} <strong>dir-wm-ca@nic.in</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  {t("footer.close")}
                </button>
                <Link
                  href="/helpdesk"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t("footer.ticket")}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = makePageT(language, loginDict);
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div>
        <TopStatusBar />
        <Navbar />

        <div className="flex flex-col items-center pt-10 pb-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Background Ambient Glow */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

          {/* Back to previous */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full max-w-2xl mb-4 flex justify-start relative z-10 px-2 sm:px-4"
          >
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/select-role");
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHi ? "वापस जाएं" : "Back to previous"}</span>
            </button>
          </motion.div>

          {/* Header Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mb-10 relative z-10"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs text-slate-700 text-xs font-bold mb-5 uppercase tracking-[0.18em]">
              <Landmark className="h-3.5 w-3.5 text-blue-600" />
              <span>{t("footer.ministry")}</span>
              <span className="text-slate-300">•</span>
              <span>{t("footer.directorate")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3 leading-[1.15]">
              {t("hero.title1")}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600">
                {t("hero.title2")}
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          {/* Suspense-wrapped login form */}
          <Suspense fallback={
            <div className="w-full max-w-2xl h-96 bg-white rounded-3xl border border-slate-200 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          }>
            <LoginForm />
          </Suspense>

          {/* Statutory Verification Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl w-full mx-auto relative z-10 px-2 sm:px-4">
            {[
              {
                label: t("metrics.auditSpeed"),
                value: "15m → In Seconds",
                highlight: true,
                icon: Zap,
                accentColor: "from-blue-500 via-blue-600 to-indigo-600",
                iconColor: "text-blue-600",
                iconBg: "bg-blue-50/80 group-hover:bg-blue-100/90",
              },
              {
                label: t("metrics.computeCost"),
                value: "₹0.12 / SKU",
                highlight: true,
                icon: Database,
                accentColor: "from-indigo-500 via-indigo-600 to-purple-600",
                iconColor: "text-indigo-600",
                iconBg: "bg-indigo-50/80 group-hover:bg-indigo-100/90",
              },
              {
                label: t("metrics.codifiedRules"),
                value: "24 PCR 2011",
                highlight: false,
                icon: FileCheck2,
                accentColor: "from-amber-500 via-amber-600 to-orange-600",
                iconColor: "text-amber-600",
                iconBg: "bg-amber-50/80 group-hover:bg-amber-100/90",
              },
              {
                label: t("metrics.evidenceChain"),
                value: "SHA-256 BSA",
                highlight: false,
                icon: FileDigit,
                accentColor: "from-emerald-500 via-teal-600 to-cyan-600",
                iconColor: "text-emerald-600",
                iconBg: "bg-emerald-50/80 group-hover:bg-emerald-100/90",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -5, 0] 
                }}
                transition={{ 
                  y: { 
                    repeat: Infinity, 
                    duration: 3.2 + i * 0.5, 
                    ease: "easeInOut" 
                  },
                  opacity: { 
                    duration: 0.4, 
                    delay: 0.2 + i * 0.08 
                  }
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.04, 
                  transition: { type: "spring", stiffness: 400, damping: 17 } 
                }}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-slate-300 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer select-none"
              >
                {/* Top Glowing Gradient Accent Bar on Hover */}
                <div className={cn("absolute top-0 inset-x-0 h-1 bg-gradient-to-r scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-2xl", stat.accentColor)} />

                {/* Ambient Spotlight Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Animated Icon with Smooth Scale & Lift */}
                <div className={cn("w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xs", stat.iconBg)}>
                  <stat.icon
                    className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5", stat.iconColor)}
                  />
                </div>

                {/* Stat Metric Value with Hover Color Transition */}
                <div className="text-lg sm:text-xl font-black mb-1 tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
                  {stat.value}
                </div>

                {/* Stat Label */}
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-slate-700 transition-colors duration-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
