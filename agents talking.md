# 🛡️ PackParakh 1.0 — Open Code Handover & Context Dossier

> **Author & Lead:** Krrish Kumar Tanti  
> **Repository:** [https://github.com/Krrish-Kumar-Tanti/PackParakh1.0](https://github.com/Krrish-Kumar-Tanti/PackParakh1.0)  
> **Live Production URL:** [https://packparakh.vercel.app](https://packparakh.vercel.app)  
> **Target Authority:** Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution  

---

## ⚠️ STRICT BRANDING & ATTRIBUTION RULES
1. **NO SIH / Smart India Hackathon:** Do **NOT** mention "SIH", "Smart India Hackathon", "Problem Statement 26034", or "Team Parity" anywhere. All traces have been removed from the repository.
2. **NO HackAmongUs Mentions:** Do **NOT** mention HackAmongUs in any user-facing code or markdown.
3. **Sole Ownership:** This is strictly **Krrish Kumar Tanti's** sovereign GovTech project (**PackParakh 1.0**).

---

## 📋 What Has Been Built & Tested So Far

1. **Repository Setup (`PackParakh 1.0`)**:
   - Full clean codebase migrated from the legacy repository.
   - All role-specific Markdown files, team dossiers, and non-code clutter were excluded.
   - Next.js 15.5.25 frontend (`client/`), Node/Express backend (`server/`), and shared Zod/rules engine (`shared/`).

2. **Core Engine & Rules (`shared/rules.ts`)**:
   - **24 Codified Statutory Rules** enforcing the Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011), GSR 226(E) for Unit Sale Pricing, GSR 418(E) for E-Commerce Country of Origin filters, and Table-I Font Height thresholds.
   - **BSA 2023 Section 63 Evidence Chain:** SHA-256 cryptographic evidence hashing for court-ready Form-V seizure notices.
   - **Test Suite Status:** **122/122 unit tests passing (100%)** + **8/8 statutory verification assertions passing**.

3. **Gemini Vision AI Integration**:
   - Active Google Gemini API Key configured in private environment files (`server/.env` and `client/.env.local`).
   - Prioritizes active models: `gemini-3.8-flash`, `gemini-3-flash-preview`, and `gemini-flash-latest`.
   - Older deprecated models (`gemini-2.0-flash` / `gemini-2.5-flash`) were purged.

4. **Deployment & CI/CD**:
   - Deployed live on Vercel at `https://packparakh.vercel.app`.
   - Automatic webhook triggers set on `PackParakh1.0/main`. Every push automatically builds and updates the live site.

---

## 🎬 Current Task: Hero Page Intro Video & Gemini Watermark Removal

### 1. Goal
When a user visits `https://packparakh.vercel.app`, a cinematic 4-second video plays:
- **Scene 1:** A heavy judge's gavel swings down and powerfully strikes a wooden sound block with an explosion of glowing golden sparks/embers.
- **Scene 2:** The golden dust particles push forward and morph into the 3D embossed metallic gold **PackParakh (पैक-परख)** emblem.
- **Scene 3:** The video seamlessly dissolves into the main home page.

### 2. Assets Provided in the Project
- **Frame 1 (Gavel Strike):** `client/public/images/gavel_impact_strike.jpg`
- **Frame 2 (3D Logo):** `client/public/images/packparakh_3d_logo.jpg`
- **Rendered Video:** User will supply the downloaded MP4 file to `client/public/hero-intro.mp4`.

---

## 🛠️ How to Remove the Gemini Watermark / Logo from the Video

Google Flow adds a subtle watermark/spark icon in the bottom-right of the video. Use any of the following 3 techniques to remove or hide it:

### Method A: CSS Scaling & Cropping (Zero Quality Loss, No Re-encoding Needed) - RECOMMENDED
Wrap the `<video>` element inside a container with `overflow: hidden` and scale it slightly so the watermark is clipped outside the viewport:
```tsx
<div className="relative w-full h-full overflow-hidden flex items-center justify-center">
  <video
    src="/hero-intro.mp4"
    autoPlay
    muted
    playsInline
    className="w-full h-full object-cover scale-[1.08] translate-y-[-1%]"
  />
</div>
```
*(Scaling by `1.08` smoothly pushes the corner watermark outside the visible screen without noticeably cropping the central gavel or logo action).*

### Method B: FFmpeg Command Line Crop / Delogo
If re-encoding the video file locally:
```bash
# 1. Subtle bottom-right crop:
ffmpeg -i client/public/hero-intro.mp4 -vf "crop=in_w:in_h-60:0:0" -c:a copy client/public/hero-intro-clean.mp4

# OR 2. Delogo filter over the watermark coordinates:
ffmpeg -i client/public/hero-intro.mp4 -vf "delogo=x=W-120:y=H-120:w=100:h=100" -c:a copy client/public/hero-intro-clean.mp4
```

### Method C: Online AI Watermark Remover
Upload the MP4 to [123apps.com/remove-watermark](https://online-video-cutter.com/remove-watermark) or CapCut / Runway Inpaint, select the watermark box, and export clean MP4.

---

## 💻 Exact Frontend Implementation Plan for Open Code

### Component: `client/components/HeroIntroOverlay.tsx`
Create a high-performance, accessible React component:
```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";

interface HeroIntroProps {
  onComplete?: () => void;
}

export default function HeroIntroOverlay({ onComplete }: HeroIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const hasSeenIntro = sessionStorage.getItem("packparakh_intro_seen");
    if (hasSeenIntro) {
      setIsVisible(false);
      onComplete?.();
    }
  }, [onComplete]);

  const handleFinish = () => {
    sessionStorage.setItem("packparakh_intro_seen", "true");
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Watermark-clipped video wrapper */}
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              src="/hero-intro.mp4"
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={handleFinish}
              className="w-full h-full object-cover scale-[1.08] pointer-events-none"
            />
          </div>

          {/* Top Controls: Sound & Skip */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-3 py-2 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors flex items-center gap-1.5"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? "Sound Off" : "Sound On"}</span>
            </button>

            <button
              onClick={handleFinish}
              className="px-4 py-2 rounded-full bg-amber-500/80 hover:bg-amber-500 text-slate-950 text-xs font-bold backdrop-blur-md border border-amber-300/30 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>Skip Intro</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Integration into `client/app/page.tsx`
Import and place `<HeroIntroOverlay />` at the top of the landing page:
```tsx
import HeroIntroOverlay from "@/components/HeroIntroOverlay";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <HeroIntroOverlay />
      {/* Existing Homepage Content */}
    </main>
  );
}
```

---

## 🚀 Final Deliverables for Open Code
1. Place the clean video file into `client/public/hero-intro.mp4`.
2. Apply the `scale-[1.08]` clipping technique in `HeroIntroOverlay.tsx` to eliminate the Gemini logo watermark.
3. Test locally via `npm run dev` and ensure `packparakh_intro_seen` properly controls session playback.
4. Run `npm --prefix client run build` to confirm 0 compilation errors.
5. Push to `main` branch to trigger live Vercel production deployment.
