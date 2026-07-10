"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants, useScroll, useSpring } from "framer-motion";
import RSVPFlow from "@/components/RSVPFlow";
import {
  EVENT,
  HOST_CLUBS,
  EVENT_DETAILS,
  GUESTS,
  INDUCTION,
  LEADERSHIP,
  RSVP_CONTACTS,
  PRIMARY_CLUB,
} from "@/lib/constants";

interface InvitationHomepageProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

interface DecorativeProps {
  type: "sparkle" | "circle" | "flourish" | "constellation" | "confetti" | "star";
  color: "yellow" | "blue" | "red";
  className?: string;
  mouseOffset: { x: number; y: number };
  parallaxFactor: number;
  floatYRange: number[];
  floatDuration: number;
  floatDelay?: number;
  isMobile?: boolean;
}

// Reusable animated rigging for subtle floating decorative flourishes
function DecorativeElement({
  type,
  color,
  className = "",
  mouseOffset,
  parallaxFactor,
  floatYRange,
  floatDuration,
  floatDelay = 0,
}: DecorativeProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Completely skip rendering these heavy elements on mobile to save frames
  if (isMobile) return null;

  const colorClass =
    color === "yellow" ? "text-transparent-yellow" :
      color === "blue" ? "text-cerulean-blue" : "text-[#4D0E12]";

  const renderSVG = () => {
    switch (type) {
      case "sparkle":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L15 7L22 12L15 17L12 22L9 17L2 12L9 7Z" />
          </svg>
        );
      case "star":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        );
      case "circle":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
            <circle cx="12" cy="12" r="8" />
          </svg>
        );
      case "flourish":
        return (
          <svg viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full h-full">
            <path d="M5 22 C 30 2, 70 2, 95 22" />
            <circle cx="50" cy="8" r="1.3" fill="currentColor" />
          </svg>
        );
      case "constellation":
        return (
          <svg viewBox="0 0 40 40" fill="currentColor" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 1.5" className="w-full h-full">
            <circle cx="8" cy="8" r="1.2" />
            <circle cx="32" cy="12" r="0.9" />
            <circle cx="20" cy="28" r="1.1" />
            <line x1="8" y1="8" x2="32" y2="12" className="opacity-30" />
            <line x1="32" y1="12" x2="20" y2="28" className="opacity-30" />
          </svg>
        );
      case "confetti":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <polygon points="6,2 18,5 15,22 3,19" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      style={{
        x: mouseOffset.x * parallaxFactor,
        y: mouseOffset.y * parallaxFactor,
      }}
      className={`absolute pointer-events-none z-10 ${className} ${colorClass}`}
    >
      <motion.div
        animate={{
          y: floatYRange,
          rotate: type === "flourish" || type === "constellation" ? [0, 3, -3, 0] : [0, 360],
          opacity: [0.06, 0.15, 0.06],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        className="w-full h-full"
      >
        {renderSVG()}
      </motion.div>
    </motion.div>
  );
}

export default function InvitationHomepage({ scrollContainerRef }: InvitationHomepageProps) {
  const [activeSections, setActiveSections] = useState<Record<string, boolean>>({});
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const setSectionActive = (sectionId: string) => {
    setActiveSections((prev) => {
      if (prev[sectionId]) return prev;
      return { ...prev, [sectionId]: true };
    });
  };

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle cursor moves for micro parallax response (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMouseOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  const containerVariants: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const fadeUpVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
  };

  const cardHoverVariants: Variants = {
    hover: isMobile ? {} : {
      y: -8,
      scale: 1.02,
      borderColor: "rgba(245, 239, 200, 0.35)",
      boxShadow: "0 22px 45px -15px rgba(0, 0, 0, 0.75), 0 0 20px rgba(245, 239, 200, 0.07)",
    },
  };

  const markerVariants: Variants = {
    inactive: { borderColor: "rgba(165, 188, 214, 0.45)", backgroundColor: "#231815", boxShadow: "none", scale: 1 },
    active: {
      borderColor: "#F5EFC8",
      backgroundColor: "#F5EFC8",
      boxShadow: "0 0 10px rgba(245, 239, 200, 0.55)",
      scale: 1.15,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  // Reusable card class
  const cardClass = "relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/30 backdrop-blur-md p-6 space-y-2 cursor-default shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),inset_0_0_12px_rgba(245,239,200,0.02)]";
  const shimmer = <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5EFC8]/[0.03] to-transparent pointer-events-none animate-card-shimmer" />;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative z-30 max-w-[950px] w-full mx-auto px-6 py-16 md:py-24 text-white"
    >
      {/* ── Title Header ── */}
      <motion.div variants={fadeUpVariants} className="relative space-y-4 md:space-y-6 mb-16 md:mb-20 text-center">
        <DecorativeElement type="sparkle" color="yellow" className="w-4 h-4 left-[5%] top-[-20px]" mouseOffset={mouseOffset} parallaxFactor={1.3} floatYRange={[0, -15, 0]} floatDuration={11} />
        <DecorativeElement type="circle" color="blue" className="w-5 h-5 right-[8%] top-[-10px]" mouseOffset={mouseOffset} parallaxFactor={0.8} floatYRange={[0, 12, 0]} floatDuration={14} floatDelay={1.5} />

        {/* Small Ganesha Emblem */}
        <div className="flex justify-center pb-2">
          <motion.img
            layoutId="ganesha-emblem-shared"
            src="/ganesha.png"
            alt="Ganesha Emblem"
            className="w-[72px] h-auto object-contain drop-shadow-[0_0_15px_rgba(245,239,200,0.14)] opacity-[0.82]"
          />
        </div>

        {/* Joint Club Logos */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 pt-4 pb-2">
          {/* Swarna Bengaluru Logo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#F5EFC8]/[0.02] blur-[8px] rounded-full group-hover:bg-[#F5EFC8]/[0.04] transition-all duration-500" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-swarna.png"
              alt="Rotaract Club of Swarna Bengaluru"
              className="relative z-10 h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.04)] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="text-[#F5EFC8]/45 text-sm sm:text-base font-light italic font-serif relative z-10 select-none">&amp;</div>
          {/* Nava Chaitanya Logo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#F5EFC8]/[0.02] blur-[8px] rounded-full group-hover:bg-[#F5EFC8]/[0.04] transition-all duration-500" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-nava.png"
              alt="Rotaract Club of Bengaluru Nava Chaitanya"
              className="relative z-10 h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.04)] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif italic text-transparent-yellow drop-shadow-[0_0_25px_rgba(245,239,200,0.14)] font-normal tracking-wide mt-2">
          {EVENT.title}
        </h1>
        <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.22em] text-[#A5BCD6]/80 mt-4 max-w-[700px] mx-auto font-light leading-relaxed">
          {EVENT.fullTitle} <br />
          <span className="text-[#F5EFC8] font-normal">{HOST_CLUBS[0]}</span> <br />
          <span className="text-white/50 lowercase px-2 font-light">and</span> <br />
          <span className="text-[#F5EFC8] font-normal">{HOST_CLUBS[1]}</span>
        </p>
        <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#A5BCD6]/50 mt-3 font-light">
          {EVENT.edition} · {EVENT.rotaryYear}
        </p>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/40 to-transparent mx-auto mt-6" />
        <p className="text-base sm:text-lg md:text-xl font-sans font-light max-w-[700px] mx-auto text-[#A5BCD6]/85 leading-relaxed">
          Join us as we celebrate leadership, service, and the beginning of a new chapter.
        </p>
      </motion.div>

      {/* ── Visual Journey Line & Content ── */}
      <div className="relative pl-10 sm:pl-16 mt-16 md:mt-24 space-y-24">

        {/* Inactive line track */}
        <div className="absolute left-2 sm:left-6 top-[12px] bottom-[90px] w-[1px] bg-cerulean-blue/15 pointer-events-none" />
        {/* Active line overlay */}
        <motion.div
          className="absolute left-2 sm:left-6 top-[12px] bottom-[90px] w-[1.5px] bg-[#F5EFC8]/75 origin-top pointer-events-none"
          style={{ scaleY }}
        />

        {/* ── SECTION 1: Event Details ── */}
        <div className="relative space-y-8">
          <DecorativeElement type="sparkle" color="yellow" className="w-4 h-4 right-[12%] top-[-25px]" mouseOffset={mouseOffset} parallaxFactor={1.2} floatYRange={[0, -14, 0]} floatDuration={12} />
          <DecorativeElement type="circle" color="blue" className="w-4.5 h-4.5 left-[40%] top-[-30px]" mouseOffset={mouseOffset} parallaxFactor={0.7} floatYRange={[0, 10, 0]} floatDuration={15} floatDelay={2} />

          <motion.div variants={markerVariants} animate={activeSections["details"] ? "active" : "inactive"} className="absolute -translate-x-1/2 -left-8 sm:-left-10 top-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 z-20 pointer-events-none" />
          <motion.div onViewportEnter={() => setSectionActive("details")} viewport={{ once: true, amount: 0.15 }} className="absolute top-0" />

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>Event Details</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EVENT_DETAILS.map((detail) => (
              <motion.div
                key={detail.label}
                variants={cardHoverVariants}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`${cardClass} flex-col items-start space-y-4`}
              >
                {shimmer}
                <div className="relative p-2.5 rounded-full bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[#F5EFC8]/[0.03] blur-[6px] rounded-full" />
                  <span className="relative z-10 text-3xl filter drop-shadow-[0_0_6px_rgba(245,239,200,0.2)] select-none">{detail.icon}</span>
                </div>
                <div className="space-y-1 w-full">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-light text-[#A5BCD6]/70">{detail.label}</h3>
                  {detail.label === "Venue" ? (
                    <a
                      href={EVENT.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-sans font-light text-[#F5EFC8] hover:underline hover:text-[#fbf9eb] transition-colors duration-300 flex items-center gap-1 group/link"
                    >
                      <span>{detail.value}</span>
                      <span className="text-[10px] text-[#A5BCD6]/50 group-hover/link:text-[#F5EFC8] transition-colors">↗</span>
                    </a>
                  ) : (
                    <p className="text-base font-sans font-light text-[#F5EFC8]">{detail.value}</p>
                  )}
                  <div className="w-8 h-[1px] bg-gradient-to-r from-[#F5EFC8]/35 via-[#F5EFC8]/10 to-transparent mt-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: Special Guests ── */}
        <div className="relative space-y-8">
          <DecorativeElement type="flourish" color="blue" className="w-20 h-6 right-[6%] top-[-8px]" mouseOffset={mouseOffset} parallaxFactor={0.6} floatYRange={[0, -6, 0]} floatDuration={16} />
          <DecorativeElement type="star" color="yellow" className="w-3.5 h-3.5 left-[15%] top-[-35px]" mouseOffset={mouseOffset} parallaxFactor={1.5} floatYRange={[0, 12, 0]} floatDuration={10} floatDelay={0.5} />

          <motion.div variants={markerVariants} animate={activeSections["guests"] ? "active" : "inactive"} className="absolute -translate-x-1/2 -left-8 sm:-left-10 top-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 z-20 pointer-events-none" />
          <motion.div onViewportEnter={() => setSectionActive("guests")} viewport={{ once: true, amount: 0.15 }} className="absolute top-0" />

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>Special Guests</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GUESTS.map((guest) => (
              <motion.div
                key={guest.name}
                variants={cardHoverVariants}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={cardClass}
              >
                {shimmer}
                <h3 className="text-xs font-sans uppercase tracking-widest text-[#A5BCD6]/60">{guest.role}</h3>
                <p className="text-lg font-serif italic text-transparent-yellow font-medium">{guest.name}</p>
                <div className="w-12 h-[1px] bg-gradient-to-r from-[#F5EFC8]/35 via-[#F5EFC8]/10 to-transparent mt-2" />
                {guest.note && (
                  <p className="text-xs font-sans font-light tracking-wider text-[#A5BCD6]/80 leading-relaxed pt-1 whitespace-pre-line">{guest.note}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Induction detail */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-[#4D0E12]/8 backdrop-blur-md p-6 sm:p-8 text-center space-y-3 cursor-default shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),inset_0_0_12px_rgba(245,239,200,0.02)]"
          >
            {shimmer}
            <h3 className="text-xs font-sans uppercase tracking-[0.25em] text-[#A5BCD6]/60">{INDUCTION.label}</h3>
            <p className="text-sm font-sans font-light text-white/95 max-w-[550px] mx-auto leading-relaxed text-center whitespace-pre-line">
              {INDUCTION.description}
            </p>
            <p className="text-lg font-serif italic text-cerulean-blue font-medium mt-2 text-center">{INDUCTION.inductorName}</p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-[#F5EFC8]/35 via-[#F5EFC8]/10 to-transparent mx-auto mt-2" />
          </motion.div>
        </div>

        {/* ── SECTION 3: Leadership ── */}
        <div className="relative space-y-8">
          <DecorativeElement type="constellation" color="blue" className="w-9 h-9 right-[18%] top-[-35px]" mouseOffset={mouseOffset} parallaxFactor={0.9} floatYRange={[0, 10, 0]} floatDuration={18} />
          <DecorativeElement type="sparkle" color="yellow" className="w-3 h-3 left-[22%] top-[-30px]" mouseOffset={mouseOffset} parallaxFactor={1.4} floatYRange={[0, -11, 0]} floatDuration={13} floatDelay={2.2} />

          <motion.div variants={markerVariants} animate={activeSections["leadership"] ? "active" : "inactive"} className="absolute -translate-x-1/2 -left-8 sm:-left-10 top-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 z-20 pointer-events-none" />
          <motion.div onViewportEnter={() => setSectionActive("leadership")} viewport={{ once: true, amount: 0.15 }} className="absolute top-0" />

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>Leadership</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Club 1: Swarna Bengaluru */}
            <div className="space-y-6">
              <h3 className="text-sm font-sans uppercase tracking-[0.2em] text-[#F5EFC8]/90 font-light border-b border-[#F5EFC8]/10 pb-2">
                {LEADERSHIP.swarnaBengaluru.clubName}
              </h3>
              <div className="space-y-4">
                {/* Presidents */}
                <motion.div variants={cardHoverVariants} whileHover="hover" transition={{ type: "spring", stiffness: 300, damping: 22 }} className={cardClass}>
                  {shimmer}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/60">{LEADERSHIP.swarnaBengaluru.outgoingPresident.role}</h4>
                      <p className="text-base font-serif italic text-white/80">{LEADERSHIP.swarnaBengaluru.outgoingPresident.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-transparent-yellow">{LEADERSHIP.swarnaBengaluru.incomingPresident.role}</h4>
                      <p className="text-base font-serif italic text-transparent-yellow font-semibold">{LEADERSHIP.swarnaBengaluru.incomingPresident.name}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Secretaries */}
                <motion.div variants={cardHoverVariants} whileHover="hover" transition={{ type: "spring", stiffness: 300, damping: 22 }} className={cardClass}>
                  {shimmer}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/60">{LEADERSHIP.swarnaBengaluru.outgoingSecretary.role}</h4>
                      <p className="text-base font-serif italic text-white/80">{LEADERSHIP.swarnaBengaluru.outgoingSecretary.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-transparent-yellow">{LEADERSHIP.swarnaBengaluru.incomingSecretary.role}</h4>
                      <p className="text-base font-serif italic text-transparent-yellow font-semibold">{LEADERSHIP.swarnaBengaluru.incomingSecretary.name}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Club 2: Nava Chaitanya */}
            <div className="space-y-6">
              <h3 className="text-sm font-sans uppercase tracking-[0.2em] text-[#F5EFC8]/90 font-light border-b border-[#F5EFC8]/10 pb-2">
                {LEADERSHIP.navaChaitanya.clubName}
              </h3>
              <div className="space-y-4">
                {/* Presidents */}
                <motion.div variants={cardHoverVariants} whileHover="hover" transition={{ type: "spring", stiffness: 300, damping: 22 }} className={cardClass}>
                  {shimmer}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/60">{LEADERSHIP.navaChaitanya.outgoingPresident.role}</h4>
                      <p className="text-base font-serif italic text-white/80">{LEADERSHIP.navaChaitanya.outgoingPresident.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-transparent-yellow">{LEADERSHIP.navaChaitanya.incomingPresident.role}</h4>
                      <p className="text-base font-serif italic text-transparent-yellow font-semibold">{LEADERSHIP.navaChaitanya.incomingPresident.name}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Secretaries */}
                <motion.div variants={cardHoverVariants} whileHover="hover" transition={{ type: "spring", stiffness: 300, damping: 22 }} className={cardClass}>
                  {shimmer}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/60">{LEADERSHIP.navaChaitanya.outgoingSecretary.role}</h4>
                      <p className="text-base font-serif italic text-white/80">{LEADERSHIP.navaChaitanya.outgoingSecretary.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="text-[10px] font-sans uppercase tracking-widest text-transparent-yellow">{LEADERSHIP.navaChaitanya.incomingSecretary.role}</h4>
                      <p className="text-base font-serif italic text-transparent-yellow font-semibold">{LEADERSHIP.navaChaitanya.incomingSecretary.name}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: RSVP ── */}
        <div className="relative space-y-8">
          <motion.div variants={markerVariants} animate={activeSections["rsvp"] ? "active" : "inactive"} className="absolute -translate-x-1/2 -left-8 sm:-left-10 top-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 z-20 pointer-events-none" />
          <motion.div onViewportEnter={() => setSectionActive("rsvp")} viewport={{ once: true, amount: 0.15 }} className="absolute top-0" />

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>RSVP</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <RSVPFlow />
        </div>

        {/* ── SECTION 4.5: Service Quest Game ── */}
        <div className="relative space-y-8">
          <DecorativeElement type="sparkle" color="yellow" className="w-3.5 h-3.5 right-[20%] top-[-20px]" mouseOffset={mouseOffset} parallaxFactor={1.1} floatYRange={[0, 8, 0]} floatDuration={14} />
          <DecorativeElement type="circle" color="blue" className="w-4 h-4 left-[15%] top-[-15px]" mouseOffset={mouseOffset} parallaxFactor={0.9} floatYRange={[0, -10, 0]} floatDuration={16} floatDelay={1} />

          <motion.div variants={markerVariants} animate={activeSections["quest"] ? "active" : "inactive"} className="absolute -translate-x-1/2 -left-8 sm:-left-10 top-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 z-20 pointer-events-none" />
          <motion.div onViewportEnter={() => setSectionActive("quest")} viewport={{ once: true, amount: 0.15 }} className="absolute top-0" />

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>Service Quest</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/30 backdrop-blur-md p-6 sm:p-8 text-center space-y-5 cursor-default shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),inset_0_0_12px_rgba(245,239,200,0.02)]"
          >
            {shimmer}
            <div className="w-12 h-12 mx-auto rounded-full border border-[#F5EFC8]/25 bg-[#F5EFC8]/5 flex items-center justify-center shadow-[inset_0_0_10px_rgba(245,239,200,0.1)]">
              <span className="text-2xl filter drop-shadow-[0_0_4px_rgba(245,239,200,0.25)] select-none">✨</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-serif italic text-transparent-yellow font-medium">Match the Spirit of Service</h3>
              <p className="text-xs uppercase tracking-widest text-[#A5BCD6]/60 font-sans">Interactive Memory Challenge</p>
            </div>
            <p className="text-sm font-sans font-light text-white/95 max-w-[550px] mx-auto leading-relaxed text-center">
              Test your focus and celebrate the core values of Rotaract in this premium memory challenge. Flip cards to match matching symbols, beat the clock, and earn your place on the live leaderboard!
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-[#F5EFC8]/35 via-[#F5EFC8]/10 to-transparent mx-auto mt-2" />
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/service-quest"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#F5EFC8]/35 bg-[#F5EFC8] hover:bg-[#faf6db] text-[#231815] font-sans text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <span>Enter Quest</span>
                <span className="text-xs">↗</span>
              </Link>
              <Link
                href="/service-quest/leaderboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#F5EFC8]/15 bg-[#231815]/60 hover:bg-[#231815]/95 hover:border-[#F5EFC8]/35 text-[#A5BCD6] hover:text-[#F5EFC8] font-sans text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>View Leaderboard</span>
                <span>🏆</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 5: Queries & Contact ── */}
        <div className="relative space-y-8 pb-12">
          <DecorativeElement type="circle" color="yellow" className="w-4 h-4 right-[10%] top-[-20px]" mouseOffset={mouseOffset} parallaxFactor={0.75} floatYRange={[0, 15, 0]} floatDuration={14} floatDelay={1} />
          <DecorativeElement type="confetti" color="blue" className="w-3.5 h-3.5 left-[30%] top-[-25px]" mouseOffset={mouseOffset} parallaxFactor={1.3} floatYRange={[0, -13, 0]} floatDuration={11} floatDelay={0.7} />

          <motion.div variants={markerVariants} animate={activeSections["contact"] ? "active" : "inactive"} className="absolute -translate-x-1/2 -left-8 sm:-left-10 top-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 z-20 pointer-events-none" />
          <motion.div onViewportEnter={() => setSectionActive("contact")} viewport={{ once: true, amount: 0.15 }} className="absolute top-0" />

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>Queries & Contact</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/30 backdrop-blur-md p-6 sm:p-8 text-center space-y-4 cursor-default shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),inset_0_0_12px_rgba(245,239,200,0.02)]"
          >
            {shimmer}
            <p className="text-sm font-sans font-light tracking-wide text-white/80">
              For queries and confirmations, please contact:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[600px] mx-auto pt-2">
              {RSVP_CONTACTS.map((contact) => (
                <div key={contact.name}>
                  <p className="text-base font-serif italic text-transparent-yellow font-medium">{contact.name}</p>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-[#F5EFC8]/35 via-[#F5EFC8]/10 to-transparent mx-auto mt-1.5" />
                  <p className="text-[10px] uppercase tracking-wider text-[#A5BCD6]/70 mt-2.5 font-sans">
                    {contact.role} · {contact.phone}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Footer watermark */}
      <div className="pt-16 pb-8 text-center space-y-3">
        <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-[#A5BCD6]/35 font-light">
          {PRIMARY_CLUB} · {EVENT.district}
        </p>
        <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase text-[#A5BCD6]/25 font-light">
          Website Developed by{" "}
          <a
            href="https://thescene.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5EFC8]/45 hover:text-[#F5EFC8] hover:underline transition-colors duration-300 font-normal"
          >
            The Scene Co.
          </a>
        </p>
        <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase text-[#A5BCD6]/25 font-light">
          <Link href="/privacy" className="hover:text-[#F5EFC8] hover:underline transition-colors duration-300">
            Privacy Policy
          </Link>
          <span className="mx-2 text-[#A5BCD6]/15">·</span>
          <Link href="/terms" className="hover:text-[#F5EFC8] hover:underline transition-colors duration-300">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
