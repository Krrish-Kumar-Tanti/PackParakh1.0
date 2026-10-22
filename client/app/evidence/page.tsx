"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  ShieldCheck, Copy, Check, FileDown, Share2, Mail, MessageSquare,
  Lock, MapPin, Calendar, Award, AlertOctagon, ChevronRight,
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import PipelineStepper from "@/components/PipelineStepper";
import { useLanguage } from "@/lib/LanguageContext";
import { makePageT } from "@/lib/i18n-page";
import { evidenceDict } from "@/lib/i18n-pages/evidence";
import { getCurrentScan, ScanResult } from "@/lib/scanData";
import { API_BASE_URL } from "@/lib/api";

function EvidenceVaultContent() {
  const { language } = useLanguage();
  const t = makePageT(language, evidenceDict);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [downloadingMemo, setDownloadingMemo] = useState(false);
  const [downloadingAck, setDownloadingAck] = useState(false);

  useEffect(() => {
    setScan(getCurrentScan());
  }, []);

  if (!scan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-xs text-slate-500">{t("loading")}</div>
      </div>
    );
  }

  const referenceId = `DOCA/DL/2026/${scan.scanId.slice(-6).toUpperCase()}-8F3A`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(scan.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      t("whatsappText", {
        referenceId,
        productName: scan.productName,
        score: scan.complianceScore,
        hash: scan.sha256Hash.slice(0, 16),
        verifyUrl: `http://localhost:3000/verify/${referenceId}`,
      })
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDownloadMemo = async () => {
    setDownloadingMemo(true);
    try {
      const pdfUrl = `${API_BASE_URL}/api/reports/${scan.scanId}/pdf?download=1`;
      const res = await fetch(pdfUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scan),
      });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        const element = document.createElement("a");
        element.href = blobUrl;
        const productSlug = (scan.productName || "Packaged-Commodity")
          .replace(/[^a-zA-Z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 32);
        const timeStr = new Date(scan.timestamp || Date.now()).toISOString().slice(11, 19).replace(/:/g, "");
        const safeRef = (referenceId || scan.scanId || "MEMO").replace(/[/:]/g, "-").slice(-6).toUpperCase();
        element.download = `Form-V-${productSlug}-${timeStr}-${safeRef}.pdf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      } else {
        window.open(pdfUrl, "_blank");
      }
    } catch (err) {
      console.warn("Form-V PDF download error, opening link:", err);
      window.open(`${API_BASE_URL}/api/reports/${scan.scanId}/pdf?download=1`, "_blank");
    } finally {
      setDownloadingMemo(false);
    }
  };

  const handleDownloadAckSlip = async () => {
    setDownloadingAck(true);
    try {
      const slug = referenceId.replace(/[/:]/g, "-");
      const pdfUrl = `${API_BASE_URL}/api/v1/acknowledgements/${slug}/pdf?download=1`;
      const res = await fetch(pdfUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        const element = document.createElement("a");
        element.href = blobUrl;
        element.download = `e-District-Acknowledgement-${slug}.pdf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      } else {
        window.open(pdfUrl, "_blank");
      }
    } catch (err) {
      console.warn("Ack slip PDF error, opening link:", err);
      window.open(`${API_BASE_URL}/api/v1/acknowledgements/${referenceId.replace(/[/:]/g, "-")}/pdf?download=1`, "_blank");
    } finally {
      setDownloadingAck(false);
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
          <a href="/verdict" className="hover:text-amber-700 transition-colors font-medium">
            {t("breadcrumb.verdict")}
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">
            {t("breadcrumb.evidenceVault")}
          </span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pipeline Stepper - Stage 4/5 Active */}
        <PipelineStepper currentStep={4} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cryptographic Chain & Form-V Memo */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 63 BSA 2023 Digital Certificate Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      {t("certificate.title")}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {t("certificate.subtitle")}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> {t("certificate.sealed")}
                </span>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="p-4 bg-slate-900 rounded-2xl text-slate-200 font-mono space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    {t("hashPanel.title")}
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedHash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{t("hashPanel.copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{t("hashPanel.copy")}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-xs break-all text-amber-300 font-bold selection:bg-amber-500">
                  {scan.sha256Hash}
                </div>
              </div>

              {/* Geotagged Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <MapPin className="w-3 h-3 text-red-500" /> {t("metadata.geotag")}
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">
                    28.6139° N, 77.2090° E
                  </div>
                  <div className="text-[10px] text-slate-500">{t("metadata.location")}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Calendar className="w-3 h-3 text-blue-500" /> {t("metadata.timestamp")}
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">
                    {new Date(scan.timestamp).toLocaleTimeString()} IST
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <ShieldCheck className="w-3 h-3 text-amber-500" /> {t("metadata.custody")}
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1 truncate">
                    {scan.officerBadgeNo || "DL-LMO-2026-0842"}
                  </div>
                  <div className="text-[10px] text-slate-500">{t("metadata.dept")}</div>
                </div>
              </div>

              {/* Form-V Seizure Memo Download Button */}
              <div className="pt-2">
                <button
                  onClick={handleDownloadMemo}
                  disabled={downloadingMemo}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <FileDown className="w-4 h-4 text-amber-400" />
                  {downloadingMemo
                    ? t("memo.generating")
                    : t("memo.download")}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Screen 5B e-District Acknowledgement Slip */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-widest text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-full uppercase">
                  {t("ack.screen")}
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold">
                  {t("ack.activeCase")}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">
                  {t("ack.title")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("ack.subtitle")}
                </p>
              </div>

              {/* Deterministic Reference ID Card */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    {t("ack.refLabel")}
                  </span>
                  <span className="text-sm font-black font-mono text-slate-900">{referenceId}</span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedRef ? t("ack.copied") : t("ack.copy")}
                </button>
              </div>

              {/* Statutory Notice Timeline */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  <span>{t("ack.timeline")}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t("ack.timelineDesc")}
                </p>
              </div>

              {/* Delivery Triggers (Email + WhatsApp + Slip) */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSendEmail}
                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {emailSent
                      ? t("ack.emailQueued")
                      : t("ack.sendEmail")}
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t("ack.whatsapp")}</span>
                  </button>
                </div>

                <button
                  onClick={handleDownloadAckSlip}
                  disabled={downloadingAck}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  {downloadingAck
                    ? t("ack.exporting")
                    : t("ack.export")}
                </button>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href={`/verify/${encodeURIComponent(referenceId)}`}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t("tracker.verify")}</span>
                  </a>

                  <a
                    href="/dashboard"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t("tracker.dashboard")}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EvidencePage() {
  const { language } = useLanguage();
  const t = makePageT(language, evidenceDict);
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">{t("loading")}</div>}>
      <EvidenceVaultContent />
    </Suspense>
  );
}