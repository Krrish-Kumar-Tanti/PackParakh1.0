"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

interface HeroIntroProps {
  onComplete?: () => void;
}

export default function HeroIntroOverlay({ onComplete }: HeroIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUserTap, setNeedsUserTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    // Attempt direct programmatic autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setNeedsUserTap(false);
        })
        .catch((err) => {
          console.warn("[HeroIntro] Autoplay prevented by browser:", err);
          // If browser strictly blocks autoplay, show tap-to-play overlay
          setNeedsUserTap(true);
        });
    }

    // Generous fallback: dismiss after 10s so user is never stuck
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 10000);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleFinish = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setNeedsUserTap(false);
        })
        .catch(() => handleFinish());
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="hero-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Fullscreen Video */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            <video
              ref={videoRef}
              src="/hero-intro.mp4"
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              onPlay={() => setIsPlaying(true)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Browser Tap-to-Play fallback if browser blocks silent autoplay */}
          {needsUserTap && (
            <div 
              onClick={handleManualPlay}
              className="absolute inset-0 z-[100000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 transition-transform mb-3">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
              <p className="text-white text-xs font-semibold tracking-wider uppercase">Tap to Play Intro</p>
            </div>
          )}

          {/* Top Skip Button */}
          <div className="absolute top-6 right-6 z-[100001]">
            <button
              onClick={handleFinish}
              aria-label="Skip intro"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
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
