"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  User, 
  AtSign,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthPhotoCollageBg from "@/components/AuthPhotoCollageBg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { gmailLoginDict } from "@/lib/i18n-pages/gmailLogin";
import { notifyAuthChange } from "@/lib/auth";
import { cn } from "@/lib/utils";

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

function GmailLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = makePageT(language, gmailLoginDict);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demoAccounts = [
    {
      name: "Rajesh Kumar (LMO)",
      email: "officer.rajesh.lmo@gmail.com",
      role: "State Metrology Enforcement Officer",
      tag: "Govt / LMO",
    },
    {
      name: "Priya Packaging Industries",
      email: "compliance.msme.brands@gmail.com",
      role: "MSME FMCG Brand Manufacturer",
      tag: "MSME Brand",
    },
    {
      name: "Amit Sharma",
      email: "citizen.consumer.audit@gmail.com",
      role: "Public Consumer Citizen",
      tag: "Citizen",
    },
  ];

  const handleGoogleLogin = (targetEmail?: string) => {
    setIsLoading(true);
    const chosenEmail = targetEmail || email.trim() || "officer.rajesh.lmo@gmail.com";
    if (typeof window !== "undefined") {
      localStorage.setItem("google_user_email", chosenEmail);
      notifyAuthChange();
    }
    setTimeout(() => {
      const next = searchParams?.get("next");
      const notice = searchParams?.get("notice");
      // If user was gated (auth-required), preserve intended destination
      if (next) {
        // Check if next is a protected workflow — go via role selector or direct
        // For direct workflow access, honor next so auth-gate is seamless
        try {
          const decoded = decodeURIComponent(next);
          // If next is protected audit flow, go directly to it for smoother UX
          // Otherwise default to role selection
          if (decoded.startsWith("/audit")) {
            router.push("/scan?mode=field");
            return;
          }
          if (decoded.startsWith("/scan") || decoded.startsWith("/simulate") || decoded.startsWith("/verdict") || decoded.startsWith("/dashboard")) {
            router.push(decoded);
            return;
          }
        } catch {}
        router.push(decodeURIComponent(next));
        return;
      }
      router.push("/select-role");
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    handleGoogleLogin(email.trim());
  };

  return (
    <div className="relative min-h-screen font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Animated Photo Collage Background */}
      <AuthPhotoCollageBg />

      {/* Top Header Navigation & Content */}
      <div className="relative z-10">
        <TopStatusBar />
        <Navbar />

        <main className="flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Top Back Link */}
            <div className="mb-4">
              <Link 
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("nav.backHome")}</span>
              </Link>
            </div>

            {/* Auth Card with complete zero transparency (100% solid white, no blur/opacity) */}
            <div className="relative w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl transition-all">
              {/* Card Header */}
              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-1 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {t("header.title")}
                </h1>
                <p className="text-xs text-slate-500 max-w-xs">
                  {t("header.subtitle")}
                </p>
              </div>

              {/* Main Auth Body */}
              <div className="space-y-4">
                {/* Primary Google Auth Button */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleGoogleLogin()}
                  className="w-full h-11 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-sm font-semibold flex items-center justify-center gap-2.5 rounded-xl transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <GoogleIcon className="w-4 h-4 shrink-0 text-slate-800" />
                  )}
                  <span>{isLoading ? t("google.signingIn") : t("google.continue")}</span>
                </Button>

                {/* Demo Quick Accounts */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {t("demo.label")}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full border border-blue-200">
                      1-Click Auth
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => {
                          setSelectedDemo(acc.email);
                          setEmail(acc.email);
                          setPassword("••••••••••••");
                          handleGoogleLogin(acc.email);
                        }}
                        className={cn(
                          "w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between hover:shadow-sm",
                          selectedDemo === acc.email
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-[11px] shrink-0">
                            {acc.name[0]}
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 truncate">{acc.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0 ml-2 border border-slate-200">
                          {acc.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* OR Separator */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white text-slate-400 px-3 text-[11px] font-bold tracking-widest">
                      {t("or")}
                    </span>
                  </div>
                </div>

                {/* Email and Password Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
                  <p className="text-slate-500 text-xs">
                    {t("form.intro")}
                  </p>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block">
                      {t("form.email")}
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="your.email@example.com"
                        className="peer ps-9 h-11 bg-white border-slate-300 text-slate-900 rounded-xl"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                        <AtSign className="size-4" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {/* Password Input (Below Email Login) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        {t("form.password")}
                      </label>
                      <button
                        type="button"
                        className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                      >
                        {t("form.forgot")}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="••••••••••••"
                        className="peer ps-9 pe-10 h-11 bg-white border-slate-300 text-slate-900 rounded-xl"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                        <Lock className="size-4" aria-hidden="true" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 absolute inset-y-0 end-0 flex items-center justify-center pe-3 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button: Explicit 'Sign In' button */}
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isLoading}
                    className="w-full h-11 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-sm font-semibold rounded-xl transition-all mt-4 cursor-pointer"
                  >
                    <span>
                      {isLoading
                        ? t("form.signingIn")
                        : t("form.signIn")}
                    </span>
                  </Button>
                </form>
              </div>

              {/* Privacy Policy Footer */}
              <div className="p-4 mt-4 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-xs">
                  {t("privacy.intro")}{" "}
                  <Link className="text-blue-600 hover:underline font-medium" href="/policy">
                    {t("privacy.policy")}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default function GmailLoginPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Sign In...</div>}>
      <GmailLoginContent />
    </React.Suspense>
  );
}
