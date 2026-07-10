"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sprout,
  BookOpen,
  Heart,
  Handshake,
  Lightbulb,
  Globe,
  Ribbon,
  Trophy,
  Timer,
  RefreshCw,
  Play,
  ArrowRight,
  User,
  ChevronRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import BackgroundGlow from "@/components/BackgroundGlow";
import NoiseTexture from "@/components/NoiseTexture";

// ─── Custom Rotary Wheel Icon ────────────────────────────────────────────────
const RotaryWheelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v6.5M12 15.5v6.5M2 12h6.5M15.5 12H22M5.5 5.5l4.5 4.5M14 14l4.5 4.5M18.5 5.5L14 10M10 14l-4.5 4.5" />
  </svg>
);

// ─── Card Definitions ────────────────────────────────────────────────────────
const CARD_TYPES = [
  { id: "wheel", label: "Rotary Wheel", icon: RotaryWheelIcon },
  { id: "plant", label: "Plant", icon: Sprout },
  { id: "book", label: "Book", icon: BookOpen },
  { id: "heart", label: "Heart", icon: Heart },
  { id: "handshake", label: "Handshake", icon: Handshake },
  { id: "lightbulb", label: "Light Bulb", icon: Lightbulb },
  { id: "globe", label: "Globe", icon: Globe },
  { id: "ribbon", label: "Service Ribbon", icon: Ribbon },
];

interface CardItem {
  uniqueId: number;
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ─── Confetti Rain component ─────────────────────────────────────────────────
function ConfettiEffect() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const colors = ["#F5EFC8", "#A5BCD6", "#4D0E12", "#EAB308", "#3B82F6", "#EF4444"];
  const pieces = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -20 - Math.random() * 50,
    size: Math.random() * 8 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 3.5 + 2.5,
    delay: Math.random() * 2,
    rotation: Math.random() * 360,
    xOffset: (Math.random() - 0.5) * 35,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            rotate: p.rotation,
          }}
          animate={{
            y: "120vh",
            x: `${p.x + p.xOffset}%`,
            rotate: p.rotation + 720,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

// ─── Front Card Design ────────────────────────────────────────────────────────
const CardFrontMotif = () => (
  <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-[#F5EFC8]/45 opacity-60">
    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="1.5 2" />
    <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="0.5" fill="none" />
    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="0.5 3" />
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = i * 45;
      return (
        <line
          key={i}
          x1="50"
          y1="22"
          x2="50"
          y2="8"
          stroke="currentColor"
          strokeWidth="0.8"
          transform={`rotate(${angle} 50 50)`}
        />
      );
    })}
  </svg>
);

export default function ServiceQuestPage() {
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<"intro" | "register" | "welcome_back" | "playing" | "won">("intro");
  
  // Player Stats & Database Records
  const [playerName, setPlayerName] = useState("");
  const [clubName, setClubName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  
  // Game Logic State
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedIndexes, setMatchedIndexes] = useState<number[]>([]);
  const [shakingIndexes, setShakingIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState(3);
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Submitting Scores
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Retrieve Player details on mount
  useEffect(() => {
    setMounted(true);
    const storedId = localStorage.getItem("service_quest_player_id");
    const storedName = localStorage.getItem("service_quest_player_name");
    const storedClub = localStorage.getItem("service_quest_player_club");
    
    if (storedId && storedName && storedClub) {
      setPlayerId(storedId);
      setPlayerName(storedName);
      setClubName(storedClub);
      setGameState("welcome_back");
    }

    return () => {
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
    };
  }, []);

  // Timer Hook
  useEffect(() => {
    if (gameState === "playing" && !isRevealing) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isRevealing]);

  // Format Elapsed Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  // Shuffle Cards & Start
  const setupGame = () => {
    if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);

    // Duplicate CARD_TYPES to create 16 cards (8 pairs)
    const duplicateList = [...CARD_TYPES, ...CARD_TYPES].map((card, idx) => ({
      ...card,
      uniqueId: idx,
    }));
    
    // Fisher-Yates Shuffle
    for (let i = duplicateList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicateList[i], duplicateList[j]] = [duplicateList[j], duplicateList[i]];
    }
    
    setCards(duplicateList);
    setFlippedIndexes(Array.from({ length: 16 }, (_, idx) => idx)); // Show all cards face up
    setMatchedIndexes([]);
    setShakingIndexes([]);
    setMoves(0);
    setTime(0);
    setRank(null);
    setIsRevealing(true);
    setRevealCountdown(3);
    setGameState("playing");

    // Pre-reveal 3-second countdown
    let count = 3;
    revealIntervalRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setRevealCountdown(count);
      } else {
        if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
        setIsRevealing(false);
        setFlippedIndexes([]); // Flip back face down
      }
    }, 1000);
  };

  // Start registration flow
  const handleStartRegister = () => {
    setGameState("register");
  };

  // Register user
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !clubName.trim()) return;

    const newPlayerId = crypto.randomUUID();
    localStorage.setItem("service_quest_player_id", newPlayerId);
    localStorage.setItem("service_quest_player_name", playerName.trim());
    localStorage.setItem("service_quest_player_club", clubName.trim());
    
    setPlayerId(newPlayerId);
    setupGame();
  };

  // Log out player profile
  const handleLogout = () => {
    localStorage.removeItem("service_quest_player_id");
    localStorage.removeItem("service_quest_player_name");
    localStorage.removeItem("service_quest_player_club");
    setPlayerId("");
    setPlayerName("");
    setClubName("");
    setGameState("register");
  };

  // Card Clicks
  const handleCardClick = (idx: number) => {
    // Block clicks during reveal phase, flips, matches, or when selecting matched/flipped cards
    if (
      isRevealing ||
      flippedIndexes.length >= 2 ||
      flippedIndexes.includes(idx) ||
      matchedIndexes.includes(idx) ||
      gameState !== "playing"
    ) {
      return;
    }

    const newFlipped = [...flippedIndexes, idx];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.id === secondCard.id) {
        // MATCH FOUND
        setTimeout(() => {
          setMatchedIndexes((prev) => [...prev, ...newFlipped]);
          setFlippedIndexes([]);
          
          // Check Win Condition
          if (matchedIndexes.length + 2 === cards.length) {
            handleGameWin();
          }
        }, 300);
      } else {
        // MISMATCH
        setTimeout(() => {
          setShakingIndexes(newFlipped);
        }, 150);

        setTimeout(() => {
          setFlippedIndexes([]);
          setShakingIndexes([]);
        }, 700);
      }
    }
  };

  // Game Won
  const handleGameWin = async () => {
    setGameState("won");
    setIsSubmitting(true);
    setSubmitError("");

    const finalTime = time;
    const finalMoves = moves;

    try {
      const response = await fetch("/api/quest/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: playerId,
          full_name: playerName,
          club_name: clubName,
          completion_time: parseFloat(finalTime.toFixed(1)),
          moves: finalMoves,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setRank(resData.rank);
      } else {
        console.error("Score submission error:", resData.error);
        setSubmitError(resData.error || "Failed to submit score.");
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
      setSubmitError("Failed to connect to the leaderboard database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full premium-radial-bg overflow-x-hidden flex flex-col justify-between select-none">

      {/* Parallax Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <BackgroundGlow isMobile={false} />
      </div>
      <NoiseTexture />

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#F5EFC8]/10 bg-[#231815]/30 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#A5BCD6]/70 hover:text-[#F5EFC8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Invitation</span>
        </Link>
        
        <div className="flex items-center gap-1.5 text-xs text-[#F5EFC8] font-serif italic">
          <Sparkles className="w-3.5 h-3.5 text-[#F5EFC8]/80 animate-pulse" />
          <span>UGAMA AARAMBHA 2K26</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* 1. INTRO SCREEN */}
          {gameState === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/50 backdrop-blur-xl text-center space-y-6 shadow-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <div className="w-16 h-16 mx-auto rounded-full border border-[#F5EFC8]/35 bg-[#F5EFC8]/5 flex items-center justify-center shadow-[inset_0_0_12px_rgba(245,239,200,0.1),0_0_15px_rgba(245,239,200,0.05)]">
                <Sparkles className="w-7 h-7 text-[#F5EFC8] filter drop-shadow-[0_0_8px_rgba(245,239,200,0.3)]" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-serif italic text-transparent-yellow font-normal tracking-wide">
                  ✨ Service Quest
                </h1>
                <p className="text-xs uppercase tracking-widest text-[#A5BCD6]/60 font-sans">
                  The Memory Challenge
                </p>
              </div>

              <p className="text-sm font-sans font-light tracking-wide text-white/80 leading-relaxed max-w-xs mx-auto">
                Test your memory and celebrate the spirit of service. Find all matching pairs as quickly as possible.
                <br />
                <span className="text-[#F5EFC8]/90 font-medium">The fastest Rotaractor wins!</span>
              </p>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(245, 239, 200, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartRegister}
                  className="w-full py-4 rounded-xl border border-[#F5EFC8]/30 bg-gradient-to-r from-[#F5EFC8]/10 via-[#F5EFC8]/20 to-[#F5EFC8]/10 text-white font-sans text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer hover:bg-gradient-to-r hover:from-[#F5EFC8]/15 hover:to-[#F5EFC8]/15 hover:border-[#F5EFC8]/50 shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Start Game</span>
                  <Play className="w-3.5 h-3.5 text-white/90 fill-current" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* 2. REGISTRATION FORM */}
          {gameState === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/50 backdrop-blur-xl text-center space-y-6 shadow-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif italic text-transparent-yellow font-normal tracking-wide">
                  Player Details
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-[#A5BCD6]/60 font-sans">
                  Enter credentials to record your score
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5 text-left pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-[10px] uppercase tracking-widest text-[#A5BCD6]/70 font-sans pl-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    placeholder="Enter your full name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#F5EFC8]/15 bg-[#231815]/60 text-white font-sans text-sm tracking-wide focus:outline-none focus:border-[#F5EFC8]/40 transition-colors placeholder-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="clubName" className="text-[10px] uppercase tracking-widest text-[#A5BCD6]/70 font-sans pl-1">
                    Club Name *
                  </label>
                  <input
                    type="text"
                    id="clubName"
                    required
                    placeholder="e.g. Swarna Bengaluru"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#F5EFC8]/15 bg-[#231815]/60 text-white font-sans text-sm tracking-wide focus:outline-none focus:border-[#F5EFC8]/40 transition-colors placeholder-white/20"
                  />
                </div>

                <div className="pt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 rounded-xl border border-[#F5EFC8]/35 bg-[#F5EFC8] hover:bg-[#faf6db] text-[#231815] font-sans text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Board</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* 3. WELCOME BACK */}
          {gameState === "welcome_back" && (
            <motion.div
              key="welcome_back"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/50 backdrop-blur-xl text-center space-y-6 shadow-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <div className="w-14 h-14 mx-auto rounded-full border border-[#A5BCD6]/30 bg-[#A5BCD6]/5 flex items-center justify-center shadow-[inset_0_0_10px_rgba(165,188,214,0.1)]">
                <User className="w-6 h-6 text-[#A5BCD6]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-serif italic text-transparent-yellow font-normal tracking-wide">
                  Welcome back,
                </h2>
                <p className="text-lg font-sans font-light tracking-wide text-white/95 leading-relaxed">
                  {playerName}
                </p>
                <p className="text-xs font-sans font-light tracking-wider text-[#A5BCD6]/60">
                  {clubName}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(245, 239, 200, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={setupGame}
                  className="w-full py-4 rounded-xl border border-[#F5EFC8]/35 bg-gradient-to-r from-[#F5EFC8]/10 via-[#F5EFC8]/20 to-[#F5EFC8]/10 text-white font-sans text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer hover:bg-gradient-to-r hover:from-[#F5EFC8]/15 hover:to-[#F5EFC8]/15 shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Continue Playing</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/90" />
                </motion.button>

                <button
                  onClick={handleLogout}
                  className="text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/50 hover:text-red-400 hover:underline transition-colors"
                >
                  Change Profile / Log Out
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. GAME BOARD SCREEN */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center space-y-6 sm:space-y-8"
            >
              {/* Header Stats Bar */}
              <div className="w-full max-w-md flex justify-between items-center px-6 py-4 rounded-xl border border-[#F5EFC8]/15 bg-[#231815]/60 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-transparent-yellow opacity-75" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-[#A5BCD6]/60">Time</p>
                    <p className="text-sm font-sans font-light tracking-wide text-white">{formatTime(time)}</p>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-[#F5EFC8]/10" />

                <div className="flex items-center gap-2 text-center">
                  <RefreshCw className="w-4 h-4 text-[#A5BCD6] opacity-75" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-[#A5BCD6]/60 font-sans">Moves</p>
                    <p className="text-sm font-sans font-light text-white">{moves}</p>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-[#F5EFC8]/10" />

                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-transparent-yellow opacity-75" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-[#A5BCD6]/60 font-sans">Pairs</p>
                    <p className="text-sm font-sans font-light text-white">{matchedIndexes.length / 2} / 8</p>
                  </div>
                </div>
              </div>

              {/* Countdown Status */}
              <div className="h-6 flex items-center justify-center">
                {isRevealing ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs sm:text-sm font-sans uppercase tracking-[0.25em] text-transparent-yellow font-medium animate-pulse"
                  >
                    Memorize the spirit... {revealCountdown}
                  </motion.p>
                ) : (
                  <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.25em] text-[#A5BCD6]/60 font-light">
                    Match the Spirit of Service
                  </p>
                )}
              </div>

              {/* 4x4 Cards Grid */}
              <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-md aspect-square">
                {cards.map((card, idx) => {
                  const isFlipped = flippedIndexes.includes(idx);
                  const isMatched = matchedIndexes.includes(idx);
                  const isShaking = shakingIndexes.includes(idx);
                  const CardIcon = card.icon;

                  return (
                    <div
                      key={card.uniqueId}
                      className="relative w-full aspect-square cursor-pointer"
                      style={{ perspective: "1000px" }}
                      onClick={() => handleCardClick(idx)}
                    >
                      <motion.div
                        className="w-full h-full relative"
                        animate={
                          isShaking
                            ? {
                                x: [-5, 5, -5, 5, -3, 3, 0],
                                transition: { duration: 0.4 },
                              }
                            : {}
                        }
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <motion.div
                          className="w-full h-full relative"
                          style={{
                            transformStyle: "preserve-3d",
                          }}
                          animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
                          transition={{ duration: 0.45, ease: "easeInOut" }}
                        >
                          {/* Front Side */}
                          <motion.div
                            whileHover={{
                              y: -4,
                              borderColor: "rgba(245, 239, 200, 0.4)",
                              boxShadow: "0 10px 20px rgba(245, 239, 200, 0.1)",
                            }}
                            className="absolute inset-0 flex items-center justify-center rounded-xl border border-[#F5EFC8]/15 bg-[#231815]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_5px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                            }}
                          >
                            <CardFrontMotif />
                          </motion.div>

                          {/* Back Side */}
                          <div
                            className={`absolute inset-0 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                              isMatched
                                ? "border-transparent-yellow bg-[#4D0E12]/15 shadow-[0_0_15px_rgba(245,239,200,0.25),inset_0_0_15px_rgba(245,239,200,0.05)] text-transparent-yellow"
                                : "border-[#F5EFC8]/25 bg-[#4A2E27]/85 text-[#F5EFC8]/90 shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                            }`}
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          >
                            <div className="relative p-3 sm:p-4 rounded-full bg-[#231815]/40 border border-[#F5EFC8]/10 flex items-center justify-center">
                              <CardIcon className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-[0_0_6px_rgba(245,239,200,0.25)]" />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Restart button */}
              <button
                onClick={setupGame}
                className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/40 hover:text-[#A5BCD6] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Game</span>
              </button>
            </motion.div>
          )}

          {/* 5. WIN SCREEN */}
          {gameState === "won" && (
            <motion.div
              key="won"
              initial={{ opacity: 0, y: 35, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/50 backdrop-blur-xl text-center space-y-7 shadow-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <ConfettiEffect />

              <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#F5EFC8] bg-[#F5EFC8]/5 flex items-center justify-center shadow-[0_0_20px_rgba(245,239,200,0.3)]">
                <Trophy className="w-7 h-7 text-[#F5EFC8] filter drop-shadow-[0_0_8px_rgba(245,239,200,0.4)] animate-bounce" />
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl font-serif italic text-transparent-yellow font-normal tracking-wide">
                  Congratulations!
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-[#A5BCD6]/60 font-sans">
                  Quest Successfully Completed
                </p>
              </div>

              <p className="text-sm font-sans font-light tracking-wide text-white/80 leading-relaxed max-w-xs mx-auto">
                You matched all the cards and honored the Rotaract spirit of service!
              </p>

              {/* Score breakdown */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#F5EFC8]/10">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-[#A5BCD6]/60 font-sans">Time</p>
                  <p className="text-lg font-sans font-light text-transparent-yellow font-medium mt-1">
                    {formatTime(time)}s
                  </p>
                </div>
                <div className="text-center border-l border-[#F5EFC8]/10">
                  <p className="text-[9px] uppercase tracking-widest text-[#A5BCD6]/60 font-sans">Moves</p>
                  <p className="text-lg font-sans font-light text-transparent-yellow font-medium mt-1">
                    {moves}
                  </p>
                </div>
              </div>

              {/* Leaderboard Position */}
              <div className="py-2.5 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 max-w-xs mx-auto flex items-center justify-center gap-3">
                <span className="text-xs uppercase tracking-widest text-[#A5BCD6]/70">Leaderboard Position:</span>
                {isSubmitting ? (
                  <span className="text-xs text-white/50 animate-pulse font-sans">Calculating...</span>
                ) : rank !== null ? (
                  <span className="text-base font-serif italic text-transparent-yellow font-semibold">
                    #{rank}
                  </span>
                ) : (
                  <span className="text-xs text-white/40 font-sans">Unavailable</span>
                )}
              </div>

              {submitError && (
                <p className="text-[10px] text-red-400 font-sans tracking-wide">
                  ⚠️ {submitError}
                </p>
              )}

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={setupGame}
                  className="w-full py-3.5 rounded-xl border border-[#F5EFC8]/35 bg-[#F5EFC8] hover:bg-[#faf6db] text-[#231815] font-sans text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Play Again</span>
                  <RefreshCw className="w-3.5 h-3.5" />
                </motion.button>

                <Link
                  href="/service-quest/leaderboard"
                  className="w-full py-3.5 rounded-xl border border-[#F5EFC8]/15 bg-[#231815]/60 hover:bg-[#231815]/95 hover:border-[#F5EFC8]/35 text-[#A5BCD6] hover:text-[#F5EFC8] font-sans text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>View Leaderboard</span>
                  <Trophy className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-[10px] font-sans uppercase tracking-[0.25em] text-[#A5BCD6]/30 border-t border-[#F5EFC8]/5 bg-[#231815]/20 backdrop-blur-sm">
        UGAMA AARAMBHA 2K26 · ROTARACT DISTRICT 3192
      </footer>
    </main>
  );
}
