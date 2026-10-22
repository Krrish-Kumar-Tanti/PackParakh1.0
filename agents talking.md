# 🛡️ PackParakh 1.0 — Open Code Handover & Context Dossier

> **Author & Lead:** Krrish Kumar Tanti  
> **Repository:** [https://github.com/Krrish-Kumar-Tanti/PackParakh1.0](https://github.com/Krrish-Kumar-Tanti/PackParakh1.0)  
> **Live Production URL:** [https://packparakh.vercel.app](https://packparakh.vercel.app)  
> **Target Authority:** Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution  

---

## ⚠️ STRICT BRANDING & ATTRIBUTION RULES
1. **NO SIH / Smart India Hackathon:** Do **NOT** mention "SIH", "Smart India Hackathon", "Problem Statement 26034", or "Team Parity" anywhere.
2. **NO HackAmongUs Mentions:** Do **NOT** mention HackAmongUs anywhere in the code or markdown.
3. **Sole Ownership:** This is strictly **Krrish Kumar Tanti's** sovereign GovTech project (**PackParakh 1.0**).

---

## 🎬 Hero Page Video Status (READY IN REPOSITORY)

### 1. File Location
The clean, high-resolution hero video has **already been added to the repository**:
```text
client/public/hero-intro.mp4
```

### 2. Watermark Status: ALREADY REMOVED ✅
- The Gemini logo was removed in Google AI Studio.
- **Do NOT** add any cropping, scaling, delogo, or watermark removal filters. The video is already clean and ready to play as-is.

### 3. Sound Requirements: NO SOUND (MUTED ONLY) 🔇
- Even though the video file may contain background audio, **DO NOT PLAY ANY SOUND**.
- The video element MUST be **`muted`** with no audio controls or un-mute buttons.
- It must be a silent, seamless, ultra-smooth cinematic visual experience.

---

## 💻 Exact Frontend Implementation for Open Code

### Component: `client/components/HeroIntroOverlay.tsx`
Create this component to provide an ultra-smooth, non-intrusive intro:

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HeroIntroProps {
  onComplete?: () => void;
}

export default function HeroIntroOverlay({ onComplete }: HeroIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only play once per browser session
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
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Fullscreen Silent Video */}
          <video
            ref={videoRef}
            src="/hero-intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleFinish}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Minimalist Glassmorphic Skip Button */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={handleFinish}
              className="px-4 py-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5 shadow-lg hover:scale-105"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Integration into `client/app/page.tsx`
Mount `<HeroIntroOverlay />` at the top of the landing page:
```tsx
import HeroIntroOverlay from "@/components/HeroIntroOverlay";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <HeroIntroOverlay />
      {/* Existing HomePage Content */}
    </main>
  );
}
```

---

## 🚀 Tasks for Open Code
1. Verify `client/public/hero-intro.mp4` is present (it is already placed there).
2. Create `client/components/HeroIntroOverlay.tsx` with **`muted`** audio and smooth crossfade.
3. Import and render it in `client/app/page.tsx`.
4. Ensure no existing layout, styling, or functionality is broken.
5. Verify build via `npm --prefix client run build`.
6. Push to `main` branch to trigger live Vercel production deployment.
