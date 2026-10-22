"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowLeft,
  ChevronDown, ChevronUp, Download, FileText, Share2,
  Copy, Check, ExternalLink, RefreshCw, X, MessageSquare, Image as ImageIcon
} from "lucide-react";
import TopStatusBar from "@/components/TopStatusBar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/LanguageContext";
import { getCurrentScan, ScanResult, saveCurrentScan, DEMO_PRESETS } from "@/lib/scanData";
import { API_BASE_URL, confirmReviewGate, createAcknowledgement } from "@/lib/api";
import { makePageT } from "@/lib/i18n-page";
import { verdictDict } from "@/lib/i18n-pages/verdict";

function VerdictWorkspace() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = makePageT(language, verdictDict);
  const [scan, setScan] = useState<ScanResult | null>(null);

  // Accordion state
  const [expandedRule, setExpandedRule] = useState<string | null>("rule6");

  // Micrometer Gate state
  const [isConfirmingGate, setIsConfirmingGate] = useState(false);
  const [gateDecision, setGateDecision] = useState<"confirmed" | "rejected" | null>(null);

  // e-District Slip Modal state
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);
  const [isGeneratingAck, setIsGeneratingAck] = useState(false);
  const [ackData, setAckData] = useState<any | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Multi-panel image selector: user can pick which photo to inspect
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0);

  // Load scan from localStorage or default to review preset for demonstration
  useEffect(() => {
    const data = getCurrentScan();
    if (data) {
      setScan(data);
    } else {
      setScan(DEMO_PRESETS.review);
    }
  }, []);

  if (!scan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          {t("loading")}
        </div>
      </div>
    );
  }

  const isPass = scan.verdict === "PASS" || gateDecision === "confirmed";
  const isFail = scan.verdict === "FAIL" || gateDecision === "rejected";
  const isReview = scan.verdict === "REVIEW" && !isPass && !isFail;

  // Multi-panel helpers: pick the image the user is inspecting right now.
  const panelImages = scan.capturedImages && scan.capturedImages.length > 0
    ? scan.capturedImages
    : scan.capturedImage
    ? [scan.capturedImage]
    : [];
  const activePanelUrl = panelImages[selectedPanelIndex] ?? panelImages[0] ?? null;
  const hasMultiplePanels = panelImages.length > 1;

  // Only show bounding boxes that belong to the currently selected panel.
  // If NO boxes carry an originImage tag at all (older saved scans / stale
  // server), show everything so the view never goes blank.
  const boxesAreTagged = scan.boundingBoxes.some((b) => typeof b.originImage === "number");
  const activePanelBoxes = hasMultiplePanels && boxesAreTagged
    ? scan.boundingBoxes.filter((b) => b.originImage === selectedPanelIndex)
    : scan.boundingBoxes;

  // Fields the optical engine could not read clearly. In a REVIEW verdict the
  // officer must visually confirm these against the physical label (or flag them
  // as missing from the capture) before Form-V sealing.
  const ef = scan.extractedFields;
  const dateFields: { key: string; label: string; value: string }[] = [];
  if (ef.expiryDate) dateFields.push({ key: "expiryDate", label: t("fieldLabels.expiry"), value: ef.expiryDate.text || t("fieldLabels.notRead") });
  if (ef.mfgDate) dateFields.push({ key: "mfgDate", label: t("fieldLabels.mfg"), value: ef.mfgDate.text || t("fieldLabels.notRead") });
  const flaggedDateFields = dateFields.filter((f) =>
    f.key === "expiryDate" ? ef.expiryDate.valid !== true : ef.mfgDate.valid !== true
  );
  const reviewFields = isReview && flaggedDateFields.length > 0 ? flaggedDateFields : dateFields;

  // Handle HITL review decision (yes/no). The "Yes" path seals the memo after
  // the officer visually verifies the OCR'd value on the physical label; the
  // "No" path records an OFFICER_REJECTED audit event and downgrades the scan.
  const handleGateDecision = async (confirmed: boolean) => {
    setIsConfirmingGate(true);
    try {
      if (scan.scanId) {
        await confirmReviewGate(
          scan.scanId,
          confirmed
            ? t("gateNote.confirmed")
            : t("gateNote.rejected"),
          undefined,
          confirmed
        );
      }
    } catch (err) {
      console.warn("Backend confirm gate note:", err);
    } finally {
      setIsConfirmingGate(false);
      setGateDecision(confirmed ? "confirmed" : "rejected");
      let updated: ScanResult;
      if (confirmed) {
        updated = {
          ...scan,
          verdict: "PASS",
          complianceScore: 100,
          violations: [],
        };
      } else {
        updated = {
          ...scan,
          verdict: "FAIL",
          complianceScore: Math.max(0, Math.min(scan.complianceScore, 40)),
          violations: [
            {
              ruleNumber: t("gateViolation.ruleNumber"),
              title: t("gateViolation.title"),
              description: t("gateViolation.description"),
              penaltyClause: t("gateViolation.penaltyClause"),
              severity: "CRITICAL",
              deduction: scan.complianceScore - Math.max(0, Math.min(scan.complianceScore, 40)),
              recommendation: t("gateViolation.recommendation"),
            },
            ...scan.violations.filter((v) => v.severity === "CRITICAL"),
          ],
        };
      }
      setScan(updated);
      saveCurrentScan(updated);
    }
  };

  // Handle Form-V PDF download
  const handleDownloadFormV = async () => {
    try {
      const pdfUrl = `${API_BASE_URL}/api/reports/${scan.scanId}/pdf?download=1`;
      // Send active scan payload so PDF matches live scan details (100/100, exact product & MRP)
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
        const safeId = (scan.scanId || "MEMO").slice(-6).toUpperCase();
        element.download = `Form-V-${productSlug}-${timeStr}-${safeId}.pdf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      } else {
        window.open(pdfUrl, "_blank");
      }
    } catch {
      window.open(`${API_BASE_URL}/api/reports/${scan.scanId}/pdf?download=1`, "_blank");
    }
  };

  // Handle e-District Slip Generation
  const handleGenerateAck = async () => {
    setIsGeneratingAck(true);
    try {
      const res = await createAcknowledgement({
        scanId: scan.scanId,
        stateCode: "DL",
        contactEmail: "consumer.support@packparakh.gov.in",
      });
      setAckData(res);
      setIsAckModalOpen(true);
    } catch (err) {
      console.warn("Generating fallback ack slip:", err);
      const fallbackRef = `DOCA/DL/2026/${scan.scanId.slice(-6).toUpperCase()}-8B7F`;
      setAckData({
        referenceId: fallbackRef,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        verifyUrl: `http://localhost:3000/verify/${encodeURIComponent(fallbackRef)}`,
        whatsappLink: `https://wa.me/?text=${encodeURIComponent(
          t("whatsappText", {
            ref: fallbackRef,
            product: scan.productName,
            score: scan.complianceScore,
          })
        )}`,
      });
      setIsAckModalOpen(true);
    } finally {
      setIsGeneratingAck(false);
    }
  };

  const handleCopyRef = () => {
    if (ackData?.referenceId) {
      navigator.clipboard.writeText(ackData.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Calculate deductions
  const totalDeduction = scan.violations.reduce((acc, v) => acc + (v.deduction || 0), 0) || (isReview ? 15 : isFail ? 55 : 0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        <TopStatusBar />
        <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Back Link — history-aware, falls back to /scan */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/scan");
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </button>
        </div>

        {/* 2-Column Responsive Layout matching Screenshot 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT COLUMN: Optical Evidence Viewport ─── */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
              {/* Dark Top Bar */}
              <div className="bg-[#070e1e] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{t("topBar.source")}</span>
                </div>
                <div className="text-slate-400">
                  {t("topBar.hash")} <span className="text-slate-200">{scan.sha256Hash ? `${scan.sha256Hash.slice(0, 4)}...${scan.sha256Hash.slice(-4)}` : "8f4e...9a2c"}</span>
                </div>
              </div>

              {/* Inspection Preview Canvas */}
              <div className="relative bg-slate-900 aspect-[4/3] flex items-center justify-center overflow-hidden">
                {activePanelUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img
                      src={activePanelUrl}
                      alt={t("alt.main", { n: selectedPanelIndex + 1 })}
                      className="w-full h-full object-contain"
                    />
                    {/* Bounding box overlays on top of the real photo */}
                    <div className="absolute inset-0 pointer-events-none p-4">
                      {activePanelBoxes && activePanelBoxes.length > 0 ? (
                        activePanelBoxes.map((b, i) => (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              top: `${Math.min(98, Math.max(0, (b.box_2d[0] / 10) - 1))}%`,
                              left: `${Math.min(98, Math.max(0, (b.box_2d[1] / 10) - 1))}%`,
                              height: `${Math.min(100, Math.max(2, (b.box_2d[2] - b.box_2d[0]) / 10))}%`,
                              width: `${Math.min(100, Math.max(2, (b.box_2d[3] - b.box_2d[1]) / 10))}%`,
                            }}
                            className={`border-2 rounded-md pointer-events-none ${
                              b.status === "PASS"
                                ? "border-emerald-400 bg-emerald-500/20"
                                : b.status === "FAIL"
                                ? "border-rose-400 bg-rose-500/20"
                                : "border-amber-400 bg-amber-500/20"
                            }`}
                          >
                            <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-black/80 text-white -top-3.5 left-0 absolute whitespace-nowrap">
                              {b.label}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{t("reticle")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Simulated Packaging Label Canvas for Demo Presets */
                  <div className="w-full h-full bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs relative">
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                        {scan.brandName || t("canvas.sampleBrand")}
                      </span>
                      <h3 className="text-sm font-black text-slate-800 mt-0.5">
                        {scan.productName || t("canvas.sampleProduct")}
                      </h3>
                    </div>

                    <div className="relative border-2 border-emerald-500 bg-emerald-500/10 rounded-lg p-2.5 my-1">
                      <span className="absolute -top-2.5 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                        {t("canvas.passBadge", { qty: "200g" })}
                      </span>
                      <div className="text-xs font-bold text-slate-800">
                        {t("canvas.netWeight", { value: scan.extractedFields.netQuantity.value, unit: scan.extractedFields.netQuantity.unit })}
                      </div>
                    </div>

                    {isReview && (
                      <div className="relative border-2 border-dashed border-amber-500 bg-amber-500/10 rounded-lg p-2.5 my-1">
                        <span className="absolute -top-2.5 left-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                          {t("canvas.reviewBadge", { pct: "68%" })}
                        </span>
                        <div className="text-xs font-semibold text-slate-700">
                          {t("canvas.mfgGlare", { date: scan.extractedFields.mfgDate.text || "08/2026" })}
                        </div>
                      </div>
                    )}

                    {isFail && (
                      <div className="relative border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-lg p-2.5 my-1">
                        <span className="absolute -top-2.5 left-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                          {t("canvas.failBadge")}
                        </span>
                        <div className="text-xs font-bold text-rose-900">
                          {t("canvas.missingUsp")}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 font-mono text-center">
                      {t("canvas.mrp", { mrp: scan.extractedFields.mrp.text })}
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-panel thumbnail strip: tap to switch which photo shows the boxes */}
              {hasMultiplePanels && (
                <div className="bg-[#070e1e] px-3 py-2.5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {panelImages.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedPanelIndex(i)}
                      className={`shrink-0 w-11 h-11 rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                        selectedPanelIndex === i
                          ? "border-emerald-400 shadow-lg shadow-emerald-400/30 scale-110"
                          : "border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={t("alt.thumb", { n: i + 1 })} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                    {t("panelCounter", { n: selectedPanelIndex + 1, total: panelImages.length })}
                  </span>
                </div>
              )}

              {/* Bottom Metadata Bar */}
              <div className="bg-[#070e1a] px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div>{t("metaBar.lens", { mode: scan.calibrationMode || "TIER A" })}{hasMultiplePanels ? t("metaBar.panelOf", { n: selectedPanelIndex + 1, total: panelImages.length }) : ""}</div>
                <div>{t("metaBar.timestamp")}{new Date(scan.timestamp).toLocaleTimeString("en-GB")}</div>
              </div>
            </div>

            {/* Packaging Fields Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4 shadow-2xs space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{t("fields.declaredMrp")}</span>
                <span className="font-bold text-slate-900">
                  {scan.extractedFields.mrp.declared && scan.extractedFields.mrp.declared > 0
                    ? t("fields.mrpValue", { value: scan.extractedFields.mrp.declared.toFixed(2) })
                    : scan.extractedFields.mrp.text && scan.extractedFields.mrp.text !== "0"
                    ? scan.extractedFields.mrp.text
                    : t("fields.notDetected")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{t("fields.netQuantity")}</span>
                <span className="font-bold text-slate-900">
                  {scan.extractedFields.netQuantity.value && scan.extractedFields.netQuantity.value > 0
                    ? t("fields.netQtyValue", { value: scan.extractedFields.netQuantity.value, unit: scan.extractedFields.netQuantity.unit || "g" })
                    : t("fields.notDetected")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{t("fields.unitSalePrice")}</span>
                <span className="font-bold text-slate-900">
                  {scan.extractedFields.unitSalePrice.declared && scan.extractedFields.unitSalePrice.declared !== "N/A"
                    ? scan.extractedFields.unitSalePrice.declared
                    : scan.extractedFields.unitSalePrice.calculated && scan.extractedFields.unitSalePrice.calculated !== "N/A"
                    ? scan.extractedFields.unitSalePrice.calculated
                    : t("fields.notAvailable")}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{t("fields.countryOfOrigin")}</span>
                <span className="font-bold text-slate-900">{scan.extractedFields.countryOfOrigin.text || "India"}</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Statutory Adjudication & Rules ─── */}
          <div className="lg:col-span-6 space-y-5">
            {/* Top Score Banner Card */}
            <div
              className={`rounded-2xl border p-5 sm:p-6 flex items-center justify-between shadow-2xs transition-all ${
                isPass
                  ? "bg-emerald-50/80 border-emerald-200"
                  : isReview
                  ? "bg-[#fffbeb] border-amber-200"
                  : "bg-rose-50/80 border-rose-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPass ? "bg-emerald-500" : isReview ? "bg-amber-500" : "bg-rose-500"
                    }`}
                  ></span>
                  <span
                    className={`text-xs font-black tracking-wider uppercase ${
                      isPass ? "text-emerald-900" : isReview ? "text-amber-900" : "text-rose-900"
                    }`}
                  >
                    {isPass
                      ? t("status.pass")
                      : isReview
                      ? t("status.review")
                      : t("status.fail")}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {scan.complianceScore}{" "}
                  <span className="text-lg sm:text-xl font-bold text-slate-400 font-normal">{t("scoreOutOf")}</span>
                </div>
              </div>

              <div className="shrink-0">
                {isPass ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 stroke-[1.5]" />
                ) : isReview ? (
                  <AlertTriangle className="w-12 h-12 text-amber-500 stroke-[1.5]" />
                ) : (
                  <XCircle className="w-12 h-12 text-rose-500 stroke-[1.5]" />
                )}
              </div>
            </div>

            {/* Dark Status Box with Action Button */}
            <div className="bg-[#070e1e] rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                    {isPass
                      ? t("statusBox.pass")
                      : isReview
                      ? t("statusBox.review")
                      : t("statusBox.fail")}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {isPass
                      ? t("statusBody.pass")
                      : isReview
                      ? t("statusBody.review")
                      : t("statusBody.fail")}
                  </p>
                </div>
              </div>

              {/* Human-in-the-loop confirmation (shown when in review) */}
              {isReview && (
                <div className="pt-1 space-y-3">
                  <div className="bg-slate-900/60 rounded-xl border border-slate-700/70 divide-y divide-slate-800">
                    {reviewFields.map((f) => (
                      <div key={f.key} className="flex items-center justify-between gap-3 px-3 py-2.5">
                        <span className="text-[11px] font-bold text-slate-300">{f.label}</span>
                        <span className="text-[11px] font-mono text-amber-200 max-w-[55%] truncate" title={f.value}>
                          "{f.value}"
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {t("gate.question")}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isConfirmingGate}
                      onClick={() => handleGateDecision(true)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {isConfirmingGate ? t("gate.recording") : t("gate.yes")}
                    </button>
                    <button
                      type="button"
                      disabled={isConfirmingGate}
                      onClick={() => handleGateDecision(false)}
                      className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
                    >
                      <XCircle className="w-4 h-4" />
                      {isConfirmingGate ? t("gate.recording") : t("gate.no")}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    {t("gate.note")}
                  </p>
                </div>
              )}
            </div>

            {/* Explainable Deduction Waterfall */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  {t("waterfall.title")}
                </h3>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-mono">
                  {t("waterfall.pts", { pts: totalDeduction })}
                </span>
              </div>

              <div className="space-y-2">
                {scan.violations.length > 0 ? (
                  scan.violations.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-start gap-3"
                    >
                      <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-mono shrink-0">
                        {t("violations.deduction", { deduction: v.deduction })}
                      </span>
                      <div className="text-xs">
                        <strong className="text-slate-900 font-bold block">{t("violations.title", { rule: v.ruleNumber, title: v.title })}</strong>
                        <span className="text-slate-600 leading-snug">{v.description}</span>
                      </div>
                    </div>
                  ))
                ) : isReview ? (
                  <>
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-3">
                      <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono shrink-0">
                        {t("waterfallReview.a.deduction")}
                      </span>
                      <div className="text-xs">
                        <strong className="text-slate-900 font-bold block">{t("waterfallReview.a.rule")}</strong>
                        <span className="text-slate-600">{t("waterfallReview.a.detail")}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-3">
                      <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono shrink-0">
                        {t("waterfallReview.b.deduction")}
                      </span>
                      <div className="text-xs">
                        <strong className="text-slate-900 font-bold block">{t("waterfallReview.b.rule")}</strong>
                        <span className="text-slate-600">{t("waterfallReview.b.detail")}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t("waterfall.zero")}
                  </div>
                )}
              </div>
            </div>

            {/* Codified PCR 2011 Rule Execution Accordions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {t("accordion.title")}
              </h3>

              <div className="space-y-2">
                {[
                  {
                    id: "rule5",
                    title: t("accordion.rule5.title"),
                    status: isFail ? "FAIL" : "REVIEW",
                    detail: t("accordion.rule5.detail"),
                  },
                  {
                    id: "rule6",
                    title: t("accordion.rule6.title"),
                    status: isPass ? "PASS" : "REVIEW",
                    detail: t("accordion.rule6.detail"),
                  },
                  {
                    id: "rule7",
                    title: t("accordion.rule7.title"),
                    status: isFail ? "FAIL" : "PASS",
                    detail: t("accordion.rule7.detail"),
                  },
                  {
                    id: "rule6_11",
                    title: t("accordion.rule611.title"),
                    status: isFail ? "FAIL" : "PASS",
                    detail: t("accordion.rule611.detail"),
                  },
                ].map((r) => (
                  <div key={r.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedRule(expandedRule === r.id ? null : r.id)}
                      className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        {r.status === "PASS" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : r.status === "REVIEW" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="text-xs font-bold text-slate-800">{r.title}</span>
                      </div>
                      {expandedRule === r.id ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                    {expandedRule === r.id && (
                      <div className="p-3 bg-white text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                        {r.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Form-V Seizure Memo & e-District Slip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadFormV}
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{t("actions.formV")}</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingAck}
                onClick={handleGenerateAck}
                className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAck ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span>{t("actions.ack")}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ─── OFFICIAL E-DISTRICT SLIP MODAL ─── */}
      {isAckModalOpen && ackData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsAckModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] font-black tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-2">
                {t("modal.ministry")}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {t("modal.title")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t("modal.subtitle")}
              </p>
            </div>

            {/* Reference ID Pill */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {t("modal.refId")}
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-slate-900">
                  {ackData.referenceId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs text-slate-600 mb-6 bg-white p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span>{t("modal.hearingDue")}</span>
                <strong className="text-slate-900 font-bold">
                  {new Date(ackData.dueDate || Date.now() + 7 * 86400000).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{t("modal.jurisdiction")}</span>
                <strong className="text-slate-900 font-bold">{t("modal.delhi")}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t("modal.statutoryMandate")}</span>
                <strong className="text-slate-900 font-bold">{t("modal.mandateValue")}</strong>
              </div>
            </div>

            {/* Action Buttons inside Modal */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => window.open(ackData.whatsappLink, "_blank")}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" /> {t("modal.shareWhatsapp")}
              </button>
              <Link
                href={`/verify/${encodeURIComponent(ackData.referenceId)}`}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <ExternalLink className="w-4 h-4" /> {t("modal.track")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  </AuthGuard>
  );
}

export default function VerdictPage() {
  const { language } = useLanguage();
  const t = makePageT(language, verdictDict);
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">{t("suspenseLoading")}</div>}>
      <VerdictWorkspace />
    </Suspense>
  );
}
