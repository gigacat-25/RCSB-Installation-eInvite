"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeRevealProps {
  onComplete: () => void;
}

export default function WelcomeReveal({ onComplete }: WelcomeRevealProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Stage 1: Display Ganesha and "gurobhuo namaha" (0 to 3.2 seconds)
    const t1 = setTimeout(() => {
      setStep(1);
    }, 3200);

    // Stage 2: Fade out completely and trigger home reveal (3.2 to 4.0 seconds)
    const t2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
      {/* Central warm gold glow behind Ganesha */}
      <motion.div
        className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-transparent-yellow/[0.12] blur-[110px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [1, 1.25, 1.15], opacity: [0.5, 0.85, 0.7] }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      />

      {/* Ambient blue glow for color depth */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-cerulean-blue/[0.08] blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.75 }}
        transition={{ duration: 3.8, ease: "easeOut" }}
      />

      {/* Ganesha & Text container */}
      <div className="relative z-40 text-center px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="ganesha-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.96 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center"
            >
              {/* Ganesha Image (Fades & Scales up slowly) */}
              <motion.img
                src="/ganesha.png"
                alt="Ganesha"
                className="w-[180px] sm:w-[240px] h-auto object-contain drop-shadow-[0_0_35px_rgba(245,239,200,0.18)]"
                initial={{ scale: 0.82, y: 22 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Sanskrit Salutation */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.95, y: 0 }}
                transition={{ delay: 0.75, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-2xl font-serif italic text-transparent-yellow tracking-[0.25em] uppercase mt-8 text-center drop-shadow-[0_0_20px_rgba(245,239,200,0.22)]"
              >
                gurobhuo namaha
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
