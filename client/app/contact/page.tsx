"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Mail, Phone, Building2, Send, CheckCircle2 } from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { contactDict } from "@/lib/i18n-pages/contact";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = makePageT(language, contactDict);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <TopStatusBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <span className="text-[10px] font-black tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
                {t("headquarters")}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {t("dirTitle")}
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                {t("dirSub")}
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{t("address")}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t("phone")}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t("email")}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-md">
              <h3 className="text-sm font-bold mb-1">{t("zonalTitle")}</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                {t("zonalDesc")}
              </p>
            </div>
          </div>

          {/* Right: Direct Message Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t("formTitle")}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {t("formSub")}
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">{t("successTitle")}</h4>
                  <p className="text-xs text-emerald-700">
                    {t("successDesc")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t("form.fullName")}</label>
                    <input
                      type="text"
                      required
                      placeholder={t("form.fullNamePlaceholder")}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t("form.email")}</label>
                    <input
                      type="email"
                      required
                      placeholder={t("form.emailPlaceholder")}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t("form.category")}</label>
                    <select className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 text-slate-700">
                      <option>{t("form.categoryOptions.0")}</option>
                      <option>{t("form.categoryOptions.1")}</option>
                      <option>{t("form.categoryOptions.2")}</option>
                      <option>{t("form.categoryOptions.3")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t("form.message")}</label>
                    <textarea
                      rows={4}
                      required
                      placeholder={t("form.messagePlaceholder")}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" /> {t("form.submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
