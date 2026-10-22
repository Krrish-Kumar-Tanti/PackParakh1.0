"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, VolumeX, X } from "lucide-react";

const SESSION_KEY = "packparakh_intro_seen";

interface HeroIntroProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export default function HeroIntroOverlay({
  isOpen = true,
  onClose,
  onComplete,
}: HeroIntroProps) {
  const [active, setActive] = useState(isOpen);
  const [needsUserTap, setNeedsUserTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const sessionCheckedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCloseRef.current = onClose;
    onCompleteRef.current = onComplete;
  }, [onClose, onComplete]);

  const markSeen = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // sessionStorage may be unavailable in strict privacy modes
    }
  }, []);

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    markSeen();
    setActive(false);
    onCloseRef.current?.();
    onCompleteRef.current?.();
  }, [markSeen]);

  useEffect(() => {
    // Auto-play the intro only once per browser session. An explicit replay
    // (isOpen toggled back to true) still works after the initial viewing.
    if (!sessionCheckedRef.current) {
      sessionCheckedRef.current = true;
      let alreadySeen = false;
      try {
        alreadySeen = sessionStorage.getItem(SESSION_KEY) === "true";
      } catch {
        alreadySeen = false;
      }
      if (alreadySeen) {
        setActive(false);
        onCloseRef.current?.();
        return;
      }
    }

    setActive(isOpen);
    if (isOpen) {
      finishedRef.current = false;
      setNeedsUserTap(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!active) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    finishedRef.current = false;
    video.muted = true;
    video.defaultMuted = true;

    try {
      video.currentTime = 0;
    } catch {
      // Ignore seek errors before metadata is ready
    }

    const playAttempt = video.play();
    if (playAttempt !== undefined) {
      playAttempt
        .then(() => {
          if (!cancelled) setNeedsUserTap(false);
        })
        .catch(() => {
          if (!cancelled) setNeedsUserTap(true);
        });
    }

    // Safety fallback so the homepage is never blocked indefinitely.
    const safetyTimer = setTimeout(() => {
      if (!cancelled) handleFinish();
    }, 9000);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [active, handleFinish]);

  const handleTapToPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video
      .play()
      .then(() => setNeedsUserTap(false))
      .catch(() => handleFinish());
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="hero-intro-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black overflow-hidden select-none"
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            <video
              ref={videoRef}
              src="/hero-intro.mp4"
              poster="/images/gavel_impact_strike.jpg"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>

          {needsUserTap && (
            <div
              onClick={handleTapToPlay}
              className="absolute inset-0 z-[1000000] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 mb-4"
              >
                <Play className="w-9 h-9 fill-current ml-1" />
              </motion.div>
              <p className="text-white font-bold text-sm tracking-widest uppercase">
                Click to Start 3D Intro
              </p>
              <span className="text-white/60 text-xs mt-1">
                Statutory Legal Metrology Enforcement Engine
              </span>
            </div>
          )}

          <div className="absolute top-6 left-6 right-6 z-[1000001] flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 text-white/80 text-xs backdrop-blur-md border border-white/10">
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Silent Presentation</span>
            </div>

            <button
              onClick={handleFinish}
              aria-label="Skip intro"
              type="button"
              className="pointer-events-auto group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Skip to App</span>
              <X className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
