"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#231815] text-[#A5BCD6]/85 font-sans font-light flex flex-col justify-between py-16 px-6 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-[#F5EFC8]/[0.015] blur-[120px] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />

      <div className="max-w-[500px] w-full mx-auto my-auto space-y-8 relative z-10 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ganesha.png"
              alt="Ganesha Emblem"
              className="w-[60px] sm:w-[75px] h-auto object-contain drop-shadow-[0_0_12px_rgba(245,239,200,0.1)] opacity-[0.8]"
            />
          </div>
          <div className="space-y-1.5 mt-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A5BCD6]/55 font-light">UGAMA AARAMBHA 2K26</p>
            <h1 className="text-4xl font-serif italic text-transparent-yellow">
              Page Not Found
            </h1>
            <p className="text-[10px] text-white/40 tracking-wider">
              ERROR 404
            </p>
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/35 to-transparent mx-auto mt-4" />
        </div>

        <p className="text-sm font-sans font-light text-[#A5BCD6]/70 leading-relaxed">
          The page you are looking for might have been moved, deleted, or does not exist.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(245,239,200,0.12)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-full border border-[#F5EFC8]/40 bg-[#F5EFC8]/[0.04] text-[#F5EFC8] font-sans font-light tracking-widest text-xs uppercase transition-all duration-300 backdrop-blur-md cursor-pointer hover:bg-[#F5EFC8]/[0.10] hover:border-[#F5EFC8]/70"
            >
              Return Home
            </motion.button>
          </Link>
        </div>
      </div>

      <div className="text-center text-[9px] uppercase tracking-[0.28em] text-[#A5BCD6]/25 font-light">
        Rotaract Swarna Bengaluru · Rotaract Bengaluru Nava Chaitanya
      </div>
    </div>
  );
}
