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

---

# 📌 CURRENT IMPLEMENTATION STATUS — HANDOVER (LATEST)

> This section supersedes the older template/tasks above. The source of truth is the code in the repository.

## ✅ Commits already pushed to `origin/main`
- `80d6daa` — `fix(ui): reveal all homepage copy on scroll with later trigger`
- `127ee2a` — `feat(ui): add scroll-reveal animations to homepage sections`
- `c96371a` — `feat(ui): persist hero intro per session and add replay controls`

Build verified locally: `npm --prefix client run build` passes, all 20 routes generated.

## 1. Hero intro — `client/components/HeroIntroOverlay.tsx`
- Fullscreen `/hero-intro.mp4` with literal `autoPlay`, `muted`, `playsInline`, `preload="auto"`.
- Poster fallback: `/images/gavel_impact_strike.jpg`.
- **Zero audio / zero unmute controls.**
- Session persistence: `sessionStorage` key `packparakh_intro_seen` is written when the video ends, the user skips, or the safety timeout fires.
- Smooth exit crossfade via `AnimatePresence` (0.8s).
- Glassmorphic **Skip to App** button in the top-right.
- Autoplay-blocked fallback shows a “Click to Start 3D Intro” tap target.
- Replay support through `isOpen` / `onClose`; the homepage has a “Watch 3D Intro” CTA and a floating “3D Video” launcher.
- Replay is explicitly allowed after the initial once-per-session auto-play.

## 2. Homepage integration — `client/app/page.tsx`
- `<HeroIntroOverlay isOpen={showHeroIntro} onClose={...} />` is mounted at the top of the landing page.
- Scroll reveal is set up in a single `useEffect` using `revealRootRef`:
  - Manual `data-reveal` attributes on section pills, headings, subheadings, FAQ cards, helpline, testimonial strip.
  - Runtime auto-tagging adds `data-reveal="text"` to every `h2`, `h3`, and `p` inside `#trust-strip`, `#how-it-works`, `#eligibility`, and `#faq`.
  - Two IntersectionObservers are intentional:
    - Boxes: threshold `0.12`, rootMargin `0px 0px -10% 0px`.
    - Text: threshold `0.45`, rootMargin `0px 0px -18% 0px` (delays the text reveal so it is visible while scrolling).
  - Each target is unobserved after revealing and gets `scroll-reveal-visible`.
  - Per-parent stagger is applied through `--scroll-reveal-delay`.
- Do **not** remove the runtime text tagging — card boxes already animated via Framer Motion, but the headings/body copy needed their own reveal.

## 3. Scroll-reveal CSS — `client/app/globals.css`
- `.scroll-reveal-ready [data-reveal]` applies the hidden state.
- `scroll-reveal-up` (text) and `scroll-reveal-up-box` (cards) animations: 850ms, 44px/72px rise, slight scale on boxes.
- Uses the independent `translate` and `scale` properties, **not** `transform`, so existing Tailwind hover transforms and Framer Motion animations stay intact.
- `prefers-reduced-motion` fallback uses an opacity-only fade.
- If JS is disabled or hydration fails, content remains visible because the hidden state is only applied after the effect adds `scroll-reveal-ready`.

## ✅ Verification already performed
- Headless Chrome (production build) confirmed:
  - Section `h2` and card `h3` start at `opacity: 0`, `translate: 0 44px`.
  - On scroll they become `opacity: 1`, `translate: 0`, with `animationName: scroll-reveal-up`.
  - The surrounding card boxes reveal via Framer Motion.
- No files outside the homepage/hero component were changed.
- `/scan`, `/simulate`, `/dashboard`, `/evidence`, `/verdict`, navbar, footer, and shared components were not touched.

## ⚠️ BLOCKING ISSUE: Vercel is not deploying the new pushes
The code is committed and pushed, but the live production site is still stale.

Evidence:
- Latest GitHub deployment is still `7f1c05c` (old commit), not `80d6daa`.
- `https://packparakh.vercel.app` returns **0** `data-reveal` attributes and has no `scroll-reveal` CSS.
- Local Vercel CLI auth is expired:
  - `vercel whoami` → `Error: The specified token is not valid. Use vercel login to generate a new token.`

### What the next agent must do
1. **Preferred:** Open the Vercel dashboard for project `packparakh` → Deployments → redeploy the latest `main` commit, or reconnect the GitHub integration so pushes auto-deploy.
2. **Or via CLI (interactive auth required):**
   ```bash
   vercel login
   # then from the client/ directory:
   vercel link        # choose the EXISTING "packparakh" project — do NOT create a new project
   vercel --prod
   ```
3. **Do not** create a new Vercel project or change project settings.
4. After deployment, verify:
   ```bash
   curl -sL https://packparakh.vercel.app/ | grep -o 'data-reveal' | wc -l   # must be > 0
   curl -sL https://packparakh.vercel.app/ | grep -o 'scroll-reveal' | head
   ```
   Then hard-refresh the site with `Cmd+Shift+R` (or open the fresh deployment URL).

## 🔄 If the scroll animation must be undone
- Remove **only** the scroll reveal while keeping the hero intro:
  ```bash
  git revert 80d6daa 127ee2a
  git push origin main
  ```
  (Or, before pushing, reset those commits.)
- Remove all recent UI work: revert `80d6daa`, `127ee2a`, and `c96371a`.
- Do **not** force-push `main`.

## 🚫 Do not
- Do not add audio, sound controls, or an unmute button to the intro.
- Do not remove `muted`, `autoPlay`, or `playsInline` from the video.
- Do not modify other routes or break existing homepage cards/navigation/footer styles.
- Do not delete the `packparakh_intro_seen` session key logic.
