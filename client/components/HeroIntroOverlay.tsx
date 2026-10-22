"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HeroIntroProps {
  onComplete?: () => void;
}

export default function HeroIntroOverlay({ onComplete }: HeroIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    // Check if user already saw the intro during this browser session
    const hasSeen = sessionStorage.getItem("packparakh_intro_seen");
    if (!hasSeen) {
      setIsVisible(true);
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  // Safety fallback: if video stalls or finishes, automatically dismiss after 4.5s
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      handleFinish();
    }, 4500);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleFinish = () => {
    try {
      sessionStorage.setItem("packparakh_intro_seen", "true");
    } catch {
      // Ignore storage errors in private browsing modes
    }
    setIsVisible(false);
    onComplete?.();
  };

  if (!mounted || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Silent Fullscreen Video */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src="/hero-intro.mp4"
              autoPlay
              muted
              playsInline
              onEnded={handleFinish}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Minimalist Glassmorphic Skip Button */}
          <div className="absolute top-6 right-6 z-[10000]">
            <button
              onClick={handleFinish}
              aria-label="Skip intro"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 hover:bg-slate-900/95 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
