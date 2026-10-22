"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function SlidingTestimonial() {
  const { t } = useLanguage();
  const items = [...t.testimonials.items, ...t.testimonials.items]; // doubled for seamless loop

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    "Field LMO Officer":         { bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200/60" },
    "MSME Packaging":            { bg: "bg-blue-50",   text: "text-blue-800",   border: "border-blue-200/60"  },
    "Public Consumer Rights":    { bg: "bg-emerald-50",text: "text-emerald-800",border: "border-emerald-200/60"},
    "E-Com Compliance":          { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200/60" },
    // Hindi badges
    "फील्ड LMO अधिकारी":        { bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200/60" },
    "MSME पैकेजिंग":            { bg: "bg-blue-50",   text: "text-blue-800",   border: "border-blue-200/60"  },
    "सार्वजनिक उपभोक्ता अधिकार":{ bg: "bg-emerald-50",text: "text-emerald-800",border: "border-emerald-200/60"},
    "ई-कॉम अनुपालन":            { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200/60" },
  };

  const getColor = (badge: string) =>
    roleColors[badge] ?? { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200/60" };

  return (
    <div className="relative overflow-hidden select-none">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

      <div className="flex gap-5 animate-x-slider" style={{ width: "max-content" }}>
        {items.map((item, idx) => {
          const c = getColor(item.badge);
          return (
            <div
              key={idx}
              className="w-72 shrink-0 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-3"
            >
              {/* Avatar row */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-base shrink-0">
                  {item.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.profession}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                "{item.description}"
              </p>

              {/* Role badge */}
              <span className={`self-start text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                {item.badge}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
