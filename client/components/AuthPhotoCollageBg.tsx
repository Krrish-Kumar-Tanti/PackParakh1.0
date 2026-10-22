"use client";

import React from "react";

interface PhotoItem {
  src: string;
  title: string;
  tag: string;
}

const COLUMN_1: PhotoItem[] = [
  {
    src: "/images/kirana_store_field_audit.jpg",
    title: "Offline Kirana Field Audit",
    tag: "LMO Enforcement",
  },
  {
    src: "/images/macro_font_calibration.jpg",
    title: "Rule 7 Font Caliper Audit",
    tag: "3-Tier Calibration",
  },
  {
    src: "/images/doca_command_center.jpg",
    title: "DoCA Command Center",
    tag: "National Analytics",
  },
  {
    src: "/images/form_v_evidence_seal.jpg",
    title: "Form-V Seizure Memo",
    tag: "Sec 63 BSA 2023",
  },
];

const COLUMN_2: PhotoItem[] = [
  {
    src: "/images/packparakh_hero_showcase.jpg",
    title: "Multi-Modal Architecture",
    tag: "24 PCR Rules",
  },
  {
    src: "/images/lmo_inspection_kit.jpg",
    title: "Mobile Inspection Kit",
    tag: "Coin Calibration",
  },
  {
    src: "/images/ecom_quickcommerce_audit.jpg",
    title: "E-Commerce GSR 418(E)",
    tag: "Marketplace Audit",
  },
  {
    src: "/images/citizen_consumer_scan.jpg",
    title: "Citizen Consumer Scan",
    tag: "Public Portal",
  },
];

const COLUMN_3: PhotoItem[] = [
  {
    src: "/images/msme_preprint_studio.jpg",
    title: "MSME Packaging Simulator",
    tag: "Pre-Print Verification",
  },
  {
    src: "/images/doca_command_center.jpg",
    title: "State Controller Directory",
    tag: "Command Grid",
  },
  {
    src: "/images/kirana_store_field_audit.jpg",
    title: "Mandi Packaging Raid",
    tag: "Field Inspection",
  },
  {
    src: "/images/macro_font_calibration.jpg",
    title: "Vernier Digital Caliper",
    tag: "Micro Precision",
  },
];

const COLUMN_4: PhotoItem[] = [
  {
    src: "/images/form_v_evidence_seal.jpg",
    title: "Court-Admissible Evidence",
    tag: "SHA-256 Tamper-Proof",
  },
  {
    src: "/images/two_step_verification.jpg",
    title: "2-Step Statutory Clearance",
    tag: "2FA Cryptographic Gateway",
  },
  {
    src: "/images/lmo_inspection_kit.jpg",
    title: "Weighing Scale Audit",
    tag: "Physical Verification",
  },
  {
    src: "/images/ecom_quickcommerce_audit.jpg",
    title: "Quick-Commerce Delivery",
    tag: "Rule 9 Compliance",
  },
];

function CollageCard({ item }: { item: PhotoItem }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900/90 group">
      <div className="relative w-full h-44 sm:h-56 overflow-hidden">
        {/* Native <img> guarantees immediate rendering without next/image container collapse */}
        <img
          src={item.src}
          alt={item.title}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 block"
        />
        {/* Subtle inner dark gradient on each photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Card tag / title pill */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-white truncate drop-shadow-md">
            {item.title}
          </span>
          <span className="text-[9px] font-bold bg-amber-500/30 text-amber-200 border border-amber-300/40 px-2 py-0.5 rounded-md shrink-0 backdrop-blur-md">
            {item.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

function ScrollingColumn({
  items,
  animationClass,
}: {
  items: PhotoItem[];
  animationClass: string;
}) {
  // Duplicate array so translateY(-50%) creates an uninterrupted infinite loop
  const duplicated = [...items, ...items];

  return (
    <div className="relative overflow-hidden h-[200vh]">
      <div className={`flex flex-col gap-4 ${animationClass}`}>
        {duplicated.map((item, idx) => (
          <CollageCard key={`${item.title}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function AuthPhotoCollageBg() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950 select-none"
    >
      {/* Moving Photo Collage Grid (tilted 2deg for modern SaaS perspective) */}
      <div className="absolute inset-x-[-5%] top-[-10%] bottom-[-10%] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 transform -rotate-2 scale-105 opacity-75">
        <div className="block">
          <ScrollingColumn items={COLUMN_1} animationClass="animate-collage-up" />
        </div>
        <div className="block">
          <ScrollingColumn items={COLUMN_2} animationClass="animate-collage-down" />
        </div>
        <div className="hidden md:block">
          <ScrollingColumn items={COLUMN_3} animationClass="animate-collage-up-slow" />
        </div>
        <div className="hidden md:block">
          <ScrollingColumn items={COLUMN_4} animationClass="animate-collage-down-slow" />
        </div>
      </div>



      {/* Semi-transparent Vignette Overlay: Leaves photos clearly visible while centering focus on the login card */}
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.3)_0%,rgba(2,6,23,0.75)_100%)]" />

      {/* Subtle GovTech ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
