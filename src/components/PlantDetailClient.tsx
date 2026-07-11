"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NoiseTexture from "@/components/NoiseTexture";
import { PlantCare } from "@/lib/plantsData";

interface PlantDetailClientProps {
  plant: PlantCare;
}

export default function PlantDetailClient({ plant }: PlantDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrevImage = () => {
    if (plant.images && plant.images.length > 0) {
      setActiveIndex((prev) => (prev === 0 ? plant.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (plant.images && plant.images.length > 0) {
      setActiveIndex((prev) => (prev === plant.images.length - 1 ? 0 : prev + 1));
    }
  };

  const cardClass = "relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/30 backdrop-blur-md p-6 space-y-3 cursor-default shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),inset_0_0_12px_rgba(245,239,200,0.02)]";
  const shimmer = <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5EFC8]/[0.03] to-transparent pointer-events-none animate-card-shimmer" />;
  const hasImages = plant.images && plant.images.length > 0;

  return (
    <div className="relative min-h-screen bg-[#231815] text-[#A5BCD6]/85 font-sans font-light flex flex-col justify-between py-16 px-6 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-[#F5EFC8]/[0.015] blur-[120px] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />

      <NoiseTexture />

      <div className="max-w-[850px] w-full mx-auto space-y-12 relative z-10">
        
        {/* Navigation Actions */}
        <div className="flex justify-between items-center">
          <Link href="/plants" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#F5EFC8]/70 hover:text-[#F5EFC8] transition-colors">
            &larr; Back to Catalog
          </Link>
          <button 
            onClick={handleShare}
            className="px-4 py-1.5 rounded-full border border-[#F5EFC8]/20 bg-transparent hover:bg-[#F5EFC8]/5 text-[#F5EFC8] font-sans text-[10px] uppercase tracking-widest transition-all cursor-pointer"
          >
            {copied ? "✓ Link Copied!" : "🔗 Share Guide"}
          </button>
        </div>

        {/* Plant Header / Title Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="relative inline-flex items-center justify-center">
            {/* Glowing circle back */}
            <div className="absolute w-24 h-24 rounded-full bg-[#F5EFC8]/10 blur-xl pointer-events-none" />
            <div className="relative text-6xl p-5 rounded-2xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/15 flex items-center justify-center w-24 h-24 shadow-2xl">
              {plant.icon}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A5BCD6]/55">Medicinal Herb Care Guide</p>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-transparent-yellow drop-shadow-[0_0_20px_rgba(245,239,200,0.1)]">
              {plant.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="px-3 py-0.5 text-[10px] rounded-full bg-[#F5EFC8]/5 border border-[#F5EFC8]/15 font-sans font-medium text-[#F5EFC8]">
                {plant.kannadaName}
              </span>
              <span className="text-[#A5BCD6]/40 text-xs">·</span>
              <span className="text-xs italic text-[#A5BCD6]/80 font-normal">
                {plant.scientificName}
              </span>
              {plant.commonNames && (
                <>
                  <span className="text-[#A5BCD6]/40 text-xs">·</span>
                  <span className="text-[11px] text-[#A5BCD6]/60">
                    ({plant.commonNames})
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/35 to-transparent mx-auto" />
        </motion.div>

        {/* Plant Description */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center max-w-[680px] mx-auto"
        >
          <p className="text-base sm:text-lg leading-relaxed text-[#A5BCD6]/90 font-light">
            {plant.description}
          </p>
        </motion.div>

        {/* Plant Image Gallery Slider (if available) */}
        {hasImages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="space-y-4 max-w-[650px] mx-auto w-full"
          >
            {/* Main Active Image Container */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#F5EFC8]/15 bg-[#231815]/50 group shadow-2xl flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={plant.images[activeIndex]}
                  alt={`${plant.name} - View ${activeIndex + 1}`}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover opacity-80"
                />
              </AnimatePresence>

              {/* Navigation Arrows (if > 1 image) */}
              {plant.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#231815]/80 border border-[#F5EFC8]/20 flex items-center justify-center text-[#F5EFC8] hover:bg-[#F5EFC8]/10 hover:border-[#F5EFC8]/45 transition-colors cursor-pointer select-none z-10 text-lg"
                    aria-label="Previous image"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#231815]/80 border border-[#F5EFC8]/20 flex items-center justify-center text-[#F5EFC8] hover:bg-[#F5EFC8]/10 hover:border-[#F5EFC8]/45 transition-colors cursor-pointer select-none z-10 text-lg"
                    aria-label="Next image"
                  >
                    &#8594;
                  </button>

                  {/* Bullet indicator overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {plant.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === activeIndex 
                            ? "bg-[#F5EFC8] w-4" 
                            : "bg-[#A5BCD6]/40 hover:bg-[#A5BCD6]/70"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {plant.images.length > 1 && (
              <div className="flex justify-center gap-3 overflow-x-auto py-1.5 px-2 no-scrollbar">
                {plant.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      idx === activeIndex 
                        ? "border-[#F5EFC8] scale-105 shadow-md shadow-[#F5EFC8]/10" 
                        : "border-[#F5EFC8]/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Thumbnail view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Parameters Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 max-w-[450px] mx-auto"
        >
          <div className="flex flex-col items-center p-4 rounded-2xl border border-[#F5EFC8]/10 bg-[#231815]/20 text-center">
            <span className="text-2xl mb-1">☀️</span>
            <span className="text-[10px] text-[#A5BCD6]/50 uppercase tracking-widest">Sunlight</span>
            <span className="text-sm font-medium text-white/90 capitalize mt-1">{plant.sunlightLevel} Sun</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl border border-[#F5EFC8]/10 bg-[#231815]/20 text-center">
            <span className="text-2xl mb-1">💧</span>
            <span className="text-[10px] text-[#A5BCD6]/50 uppercase tracking-widest">Watering</span>
            <span className="text-sm font-medium text-white/90 capitalize mt-1">{plant.waterLevel}</span>
          </div>
        </motion.div>

        {/* Section: Care Guidelines Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-lg sm:text-xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-2 uppercase flex items-center justify-between">
            <span>Essential Care Specifications</span>
            <span className="w-8 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sunlight card */}
            <div className={cardClass}>
              {shimmer}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-xl w-10 h-10 shrink-0">
                  ☀️
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic text-transparent-yellow font-medium">Sunlight Needs</h3>
                  <p className="text-sm leading-relaxed text-[#A5BCD6]/85 font-light">{plant.sunlight}</p>
                </div>
              </div>
            </div>

            {/* Water card */}
            <div className={cardClass}>
              {shimmer}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-xl w-10 h-10 shrink-0">
                  💧
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic text-transparent-yellow font-medium">Watering Schedule</h3>
                  <p className="text-sm leading-relaxed text-[#A5BCD6]/85 font-light">{plant.water} watering required. {plant.waterLevel === "low" ? "Allow soil to dry out between waterings." : plant.waterLevel === "moderate" ? "Water when the top 2-3 cm of soil is dry." : "Keep soil consistently damp."}</p>
                </div>
              </div>
            </div>

            {/* Soil card */}
            <div className={cardClass}>
              {shimmer}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-xl w-10 h-10 shrink-0">
                  🌱
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic text-transparent-yellow font-medium">Soil & Potting</h3>
                  <p className="text-sm leading-relaxed text-[#A5BCD6]/85 font-light">{plant.soil}</p>
                </div>
              </div>
            </div>

            {/* Fertilizer card */}
            <div className={cardClass}>
              {shimmer}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-xl w-10 h-10 shrink-0">
                  🍂
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic text-transparent-yellow font-medium">Feeding & Fertilizer</h3>
                  <p className="text-sm leading-relaxed text-[#A5BCD6]/85 font-light">{plant.fertilizer}</p>
                </div>
              </div>
            </div>

            {/* Pruning card */}
            <div className={cardClass}>
              {shimmer}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-xl w-10 h-10 shrink-0">
                  ✂️
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic text-transparent-yellow font-medium">Pruning & Harvesting</h3>
                  <p className="text-sm leading-relaxed text-[#A5BCD6]/85 font-light">{plant.pruning}</p>
                </div>
              </div>
            </div>

            {/* Pest Control card */}
            <div className={cardClass}>
              {shimmer}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-xl w-10 h-10 shrink-0">
                  🐛
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic text-transparent-yellow font-medium">Pest Protection</h3>
                  <p className="text-sm leading-relaxed text-[#A5BCD6]/85 font-light">{plant.pestControl}</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Section: Health & Medicinal Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-lg sm:text-xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-2 uppercase flex items-center justify-between">
            <span>Medicinal & Therapeutic Benefits</span>
            <span className="w-8 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <div className="relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-gradient-to-br from-[#4A2E27]/20 to-[#231815]/40 backdrop-blur-md p-8 shadow-xl">
            {shimmer}
            <div className="space-y-4">
              {plant.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4 items-start text-sm sm:text-base leading-relaxed text-[#A5BCD6]/90">
                  <span className="text-[#F5EFC8] text-lg select-none shrink-0 mt-0.5">✦</span>
                  <p className="font-light">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Care Summary Quick-Tip Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="rounded-2xl border border-dashed border-[#F5EFC8]/20 bg-[#F5EFC8]/[0.01] p-6 text-center"
        >
          <p className="text-[11px] font-mono text-[#F5EFC8]/70 uppercase tracking-wider mb-1 font-semibold">💡 {"Expert Grower's Tip"}</p>
          <p className="text-sm italic font-light text-[#A5BCD6]/85 leading-relaxed">
            &ldquo;{plant.careSummary}&rdquo;
          </p>
        </motion.div>

        {/* Footer Actions */}
        <div className="text-center pt-8 space-y-4">
          <Link href="/plants">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border border-[#F5EFC8]/35 bg-[#F5EFC8]/5 hover:bg-[#F5EFC8]/10 text-[#F5EFC8] font-sans text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Back to Catalog
            </motion.button>
          </Link>
          <div>
            <Link href="/" className="text-[11px] text-[#A5BCD6]/40 uppercase tracking-widest hover:underline hover:text-[#A5BCD6]/60">
              Return to eInvite
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="pt-20 text-center">
        <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#A5BCD6]/25 font-light">
          Rotaract Club of Swarna Bengaluru · Rotaract Club of Bengaluru Nava Chaitanya
        </p>
      </div>
    </div>
  );
}
