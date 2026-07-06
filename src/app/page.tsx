"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import BackgroundGlow from "@/components/BackgroundGlow";
import NoiseTexture from "@/components/NoiseTexture";
import SplitDoors from "@/components/SplitDoors";
import WelcomeReveal from "@/components/WelcomeReveal";
import InvitationHomepage from "@/components/InvitationHomepage";
import { ShootingStars } from "@/components/ui/shooting-stars";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

type Phase = "cover" | "transitioning" | "homepage";

export default function Home() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [phase, setPhase] = useState<Phase>("cover");
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for tracking cursor positions (active during cover phase)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor interpolation
  const springConfig = { damping: 50, stiffness: 220, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map smooth cursor positions to minor offsets for parallax layers
  const bgParallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const bgParallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12]);

  const textParallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);
  const textParallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-5, 5]);

  const buttonParallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-1.8, 1.8]);
  const buttonParallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-1.8, 1.8]);

  // Track window mouse movements and normalize coordinates
  useEffect(() => {
    if (phase !== "cover") return; // Stop tracking mouse parallax after cover phase to focus scroll actions
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) - 0.5;
      const normalizedY = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, phase]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Clean up ripple after its animation finishes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 900);

    // Trigger door split transition after ripple propagates
    setTimeout(() => {
      setPhase("transitioning");
    }, 550);
  };

  // Entry fade-in/out variant for the landing viewport container
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 1.8, ease: "easeOut" }
    }
  };

  // Slide upward staggered fade variants for each heading line
  const headingLineVariants: Variants = {
    initial: { y: 65, opacity: 0 },
    animate: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.22 + 0.35,
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1], // Premium easeOutExpo
      }
    })
  };

  // Subheading fade-in delayed animation
  const subheadingVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 0.85,
      y: 0,
      transition: {
        delay: 1.4,
        duration: 1.1,
        ease: "easeOut"
      }
    }
  };

  // Microcopy / Divider entrance
  const microdetailsVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.7,
        duration: 1.0,
        ease: "easeOut"
      }
    }
  };

  // Button entrance scale spring animation
  const buttonVariants: Variants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1.95,
        type: "spring",
        stiffness: 110,
        damping: 16,
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={phase === "homepage" ? "homepage" : "cover-transition"}
        ref={containerRef}
        className={`relative w-screen select-none premium-radial-bg overflow-x-hidden ${
          phase === "homepage" 
            ? "h-screen overflow-y-auto flex flex-col items-center justify-start scroll-smooth" 
            : "h-screen overflow-hidden flex flex-col items-center justify-center"
        }`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Parallax Background Layer (Glows & Archway - fixed behind scrolling elements) */}
        <motion.div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{ 
            x: phase === "cover" ? bgParallaxX : 0, 
            y: phase === "cover" ? bgParallaxY : 0 
          }}
        >
          <BackgroundGlow isButtonHovered={isBtnHovered} />
          {phase === "cover" && (
            <>
              <ShootingStars
                starColor="#9E00FF"
                trailColor="#2EB9DF"
                minSpeed={15}
                maxSpeed={35}
                minDelay={1000}
                maxDelay={3000}
              />
              <ShootingStars
                starColor="#FF0099"
                trailColor="#FFB800"
                minSpeed={10}
                maxSpeed={25}
                minDelay={2000}
                maxDelay={4000}
              />
              <ShootingStars
                starColor="#00FF9E"
                trailColor="#00B8FF"
                minSpeed={20}
                maxSpeed={40}
                minDelay={1500}
                maxDelay={3500}
              />
            </>
          )}
        </motion.div>

        {/* Animated film grain noise */}
        <NoiseTexture />

        {/* Cinematic doors split & text reveal animation */}
        {phase === "transitioning" && (
          <>
            <SplitDoors />
            <WelcomeReveal onComplete={() => setPhase("homepage")} />
          </>
        )}

        {/* Render Cover Page elements */}
        {phase === "cover" && (
          <motion.div 
            className="relative z-30 max-w-[800px] w-full flex flex-col items-center justify-center text-center space-y-10 md:space-y-12"
            style={{ x: textParallaxX, y: textParallaxY }}
            exit={{ opacity: 0, scale: 0.96, y: -15, transition: { duration: 0.5, ease: "easeInOut" } }}
          >
            {/* Main Title Header */}
            <h1 className="flex flex-col items-center justify-center tracking-tight leading-none text-white select-none">
              
              {/* Line 1: "A New" */}
              <div className="overflow-hidden py-1">
                <motion.span
                  className="block text-4xl sm:text-5xl md:text-7xl font-sans font-light tracking-wide uppercase text-white/90"
                  variants={headingLineVariants}
                  custom={0}
                >
                  A New
                </motion.span>
              </div>

              {/* Line 2: "Chapter" (Serif highlight + Slow breathing cream glow) */}
              <div className="overflow-hidden pt-1 pb-5 -mt-1 sm:-mt-2 md:-mt-3">
                <motion.span
                  className="block"
                  variants={headingLineVariants}
                  custom={1}
                >
                  <motion.span
                    className="inline-block text-6xl sm:text-7xl md:text-9xl font-serif italic font-normal text-transparent-yellow"
                    animate={{
                      y: [0, -5, 0],
                      textShadow: [
                        "0 0 12px rgba(245, 239, 200, 0.12)",
                        "0 0 28px rgba(245, 239, 200, 0.38)",
                        "0 0 12px rgba(245, 239, 200, 0.12)"
                      ]
                    }}
                    transition={{
                      y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
                      textShadow: { duration: 8.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    Chapter
                  </motion.span>
                </motion.span>
              </div>

              {/* Line 3: "Begins" (Serif highlight + Slow breathing Cerulean glow) */}
              <div className="overflow-hidden pt-1 pb-6 -mt-1 sm:-mt-2 md:-mt-3">
                <motion.span
                  className="block"
                  variants={headingLineVariants}
                  custom={2}
                >
                  <motion.span
                    className="inline-block text-6xl sm:text-7xl md:text-9xl font-serif italic font-normal text-cerulean-blue"
                    animate={{
                      y: [0, 5, 0],
                      textShadow: [
                        "0 0 15px rgba(165, 188, 214, 0.16)",
                        "0 0 32px rgba(165, 188, 214, 0.45)",
                        "0 0 15px rgba(165, 188, 214, 0.16)"
                      ]
                    }}
                    transition={{
                      y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                      textShadow: { duration: 9.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
                    }}
                  >
                    Begins
                  </motion.span>
                </motion.span>
              </div>

            </h1>

            {/* Supporting Subheading */}
            <motion.p
              className="text-base sm:text-lg md:text-xl font-sans font-light leading-relaxed max-w-[620px] text-[#A5BCD6]/85 px-4"
              variants={subheadingVariants}
            >
              Join us as we celebrate the installation of a new team, new ideas, and a new year of creating impact.
            </motion.p>

            {/* Interactive Action Area */}
            <div className="flex flex-col items-center justify-center space-y-6 pt-6 w-full">
              
              {/* Elegant horizontal divider line */}
              <motion.div 
                className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/30 to-transparent"
                variants={microdetailsVariants}
              />

              {/* Microcopy above the button */}
              <motion.p 
                className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-[#A5BCD6]/70 font-light"
                variants={microdetailsVariants}
              >
                Installation Ceremony 2026–27
              </motion.p>

              {/* Button with parallax */}
              <motion.div style={{ x: buttonParallaxX, y: buttonParallaxY }}>
                <motion.button
                  onClick={handleButtonClick}
                  onMouseEnter={() => setIsBtnHovered(true)}
                  onMouseLeave={() => setIsBtnHovered(false)}
                  variants={buttonVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 35px rgba(245, 239, 200, 0.22)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden group px-9 py-4 sm:px-11 sm:py-5 rounded-full border border-[#F5EFC8]/40 bg-[#4D0E12]/30 text-[#F5EFC8] font-sans font-light tracking-widest text-sm uppercase transition-all duration-300 backdrop-blur-md cursor-pointer hover:border-[#F5EFC8]/75 hover:bg-[#4D0E12]/45 active:outline-none"
                >
                  <span className="relative z-10">Open Invitation</span>
                  
                  {/* Subtle hover shimmer */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#F5EFC8]/8 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                  {/* Render dynamic ripple clicks */}
                  {ripples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className="button-ripple"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                      }}
                    />
                  ))}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Render Invitation Homepage Details */}
        {phase === "homepage" && <InvitationHomepage scrollContainerRef={containerRef} />}
      </motion.main>
    </AnimatePresence>
  );
}
