"use client";

import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineStep = 0 | 1 | 2 | 3 | 4 | 5;

const steps = [
  { num: "01", name: "Ingestion & Scale" },
  { num: "02", name: "Dual-Script OCR" },
  { num: "03", name: "24-Rule Engine" },
  { num: "04", name: "Evidence Vault" },
  { num: "05", name: "e-District Slip" },
];

export default function PipelineStepper({
  currentStep,
  isProcessing = false,
}: {
  currentStep: number | PipelineStep;
  isProcessing?: boolean;
}) {
  const activeIndex = Math.max(0, Math.min(5, Number(currentStep)));
  const progressPercent = Math.max(0, Math.min(100, ((activeIndex - 1) / (steps.length - 1)) * 100));

  const currentStepData = steps[Math.max(0, Math.min(steps.length - 1, activeIndex - 1))] || steps[0];

  return (
    <div className="w-full bg-[#070e1e] border border-slate-800/80 shadow-lg relative rounded-3xl mb-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-blue-600/10 blur-[90px] pointer-events-none rounded-3xl"></div>

      {/* ─── MOBILE VIEW (< 640px) ─── */}
      <div className="block sm:hidden p-4 relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-[11px] font-black flex items-center justify-center shadow-xs">
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>{currentStepData.num}</span>
              )}
            </div>
            <span className="text-xs font-black text-white tracking-wide">
              {currentStepData.name}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-md">
            Stage {activeIndex}/5
          </span>
        </div>

        {/* 5-segment progress bars */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = activeIndex > stepNum || (activeIndex === 5 && stepNum === 5 && !isProcessing);
            const isCurrent = activeIndex === stepNum && !isDone;

            return (
              <div
                key={step.num}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  isDone
                    ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                    : isCurrent
                    ? "bg-blue-500 animate-pulse shadow-xs shadow-blue-500/50"
                    : "bg-slate-800"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* ─── DESKTOP / TABLET VIEW (>= 640px) ─── */}
      <div className="hidden sm:block py-4 px-6 sm:px-8 overflow-x-auto relative z-10">
        <div className="max-w-5xl mx-auto min-w-[560px]">
          <div className="relative flex items-start justify-between">
            {/* Continuous progress track centered horizontally behind the 36px circles (top = 18px) */}
            <div className="absolute top-[18px] left-6 right-6 -translate-y-1/2 h-[2px] bg-slate-800 z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const stepNum = index + 1;
              const isCompleted = activeIndex > stepNum || (activeIndex === 5 && stepNum === 5 && !isProcessing);
              const isActive = activeIndex === stepNum && !isCompleted;

              return (
                <div
                  key={step.num}
                  className="relative z-10 flex flex-col items-center text-center w-28 sm:w-32"
                >
                  {/* Number Circle Badge (fixed 36x36, centered on the track) */}
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all bg-[#070e1e]",
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-4 ring-[#070e1e]"
                        : isActive
                        ? "border-2 border-blue-400 text-white bg-blue-600 shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20 scale-110"
                        : "border border-slate-700 text-slate-400 bg-slate-900 ring-4 ring-[#070e1e]"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : isActive && isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <span>{step.num}</span>
                    )}
                  </div>

                  {/* Step Label: strictly below circle, uniform top offset, no vertical staggering */}
                  <div className="mt-2.5 h-8 flex items-start justify-center">
                    <span
                      className={cn(
                        "text-[10px] font-extrabold uppercase tracking-wider leading-tight text-center transition-colors px-1",
                        isCompleted
                          ? "text-emerald-400"
                          : isActive
                          ? "text-white"
                          : "text-slate-500"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
