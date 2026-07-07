"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeRevealProps {
  onComplete: () => void;
}

export default function WelcomeReveal({ onComplete }: WelcomeRevealProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Stage 1: "Welcome." (0 to 1.8 seconds)
    const t1 = setTimeout(() => {
      setStep(1);
    }, 1800);

    // Stage 2: "Your invitation awaits." (1.8 to 3.8 seconds)
    const t2 = setTimeout(() => {
      setStep(2);
    }, 3800);

    // Stage 3: Complete and trigger homepage reveal
    const t3 = setTimeout(() => {
      onComplete();
    }, 4100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
      {/* Central expanding ray of light */}
      <motion.div
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-transparent-yellow/[0.14] blur-[110px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [1, 1.4, 1.25], opacity: [0.6, 0.95, 0.75] }}
        transition={{ duration: 3.8, ease: "easeOut" }}
      />

      {/* Ambient floating dust sparkles specific to the transition */}
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full bg-cerulean-blue/[0.09] blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1.6, opacity: 0.85 }}
        transition={{ duration: 4.0, ease: "easeOut" }}
      />

      {/* Sequential Text Messages */}
      <div className="relative z-40 text-center px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h2
              key="welcome"
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 1.03 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-transparent-yellow drop-shadow-[0_0_20px_rgba(245,239,200,0.22)]"
            >
              Welcome!
            </motion.h2>
          )}

          {step === 1 && (
            <motion.h2
              key="awaits"
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 1.03 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl md:text-5xl font-sans font-light tracking-[0.25em] uppercase text-cerulean-blue drop-shadow-[0_0_25px_rgba(165,188,214,0.25)]"
            >
              Your invitation awaits.
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
