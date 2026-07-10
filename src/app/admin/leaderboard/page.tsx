"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  ArrowLeft,
  Timer,
  RefreshCw,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { getSupabase } from "@/lib/supabase";
import BackgroundGlow from "@/components/BackgroundGlow";
import NoiseTexture from "@/components/NoiseTexture";
import { EVENT } from "@/lib/constants";
import confetti from "canvas-confetti";

interface ScoreRecord {
  id: string;
  player_id: string;
  full_name: string;
  club_name: string;
  completion_time: number;
  moves: number;
  score: number;
  created_at: string;
}

// ─── Animations Variants ──────────────────────────────────────────────────────
const podiumContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const podiumBarVariants = (targetHeight: string): Variants => ({
  hidden: { height: 0, opacity: 0 },
  show: {
    height: targetHeight,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 1.2,
    },
  },
});

const floatVariants: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const cardFadeInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-[#231815] flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4A2E27]/40 blur-[120px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 rounded-full border border-[#F5EFC8]/20 border-t-[#F5EFC8]/70"
        />
        <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-light text-[#A5BCD6]/50">Authorizing Admin…</p>
      </div>
    </div>
  );
}

// ─── Error Screen ──────────────────────────────────────────────────────────────
function ErrorScreen({
  message,
  isForbidden,
  onRetry,
}: {
  message: string;
  isForbidden: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen w-full bg-[#231815] flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4D0E12]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center space-y-6 max-w-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-sans text-[#A5BCD6]/50">
            {isForbidden ? "Access Denied" : "Error"}
          </p>
          <h2 className="text-2xl font-serif italic text-transparent-yellow">
            {isForbidden ? "Unauthorized Account" : "Failed to Load Dashboard"}
          </h2>
          <div className="w-10 h-[1px] bg-[#F5EFC8]/20 mx-auto" />
        </div>

        <p className="text-sm font-sans font-light text-[#A5BCD6]/70 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isForbidden ? (
            <SignOutButton redirectUrl="/">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 rounded-full border border-white/10 text-white/50 text-xs uppercase tracking-widest font-sans font-light hover:border-white/20 hover:text-white/70 transition-all cursor-pointer"
              >
                Sign Out / Switch Account
              </motion.button>
            </SignOutButton>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              className="px-6 py-2.5 rounded-full border border-[#F5EFC8]/30 text-[#F5EFC8] text-xs uppercase tracking-widest font-sans font-light hover:bg-[#F5EFC8]/[0.06] transition-all cursor-pointer"
            >
              Try Again
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Leaderboard Component ─────────────────────────────────────────────────
export default function AdminLeaderboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [authStatus, setAuthStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const prevTopScoreId = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound generator for when a new top score lands
  const playWinSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      // Simple arpeggio for celebration
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.35);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {
      console.warn("Audio failure:", e);
    }
  }, [soundEnabled]);

  // Burst confetti
  const triggerConfetti = useCallback(() => {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ["#F5EFC8", "#EAB308", "#A5BCD6", "#4D0E12"],
    });
    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ["#F5EFC8", "#EAB308", "#A5BCD6", "#4D0E12"],
    });
  }, []);

  // Fetch leaderboard scores from Supabase
  const fetchScores = useCallback(async () => {
    try {
      const supabase = getSupabase();
      const { data, error: dbError } = await supabase
        .from("memory_game_scores")
        .select("*")
        .order("completion_time", { ascending: true })
        .order("moves", { ascending: true })
        .limit(10);

      if (dbError) throw dbError;

      const currentScores = data || [];
      setScores(currentScores);

      // Check if there is a new #1 score to trigger celebration!
      if (currentScores.length > 0) {
        const topScore = currentScores[0];
        if (prevTopScoreId.current && prevTopScoreId.current !== topScore.id) {
          // Trigger epic celebration
          triggerConfetti();
          playWinSound();
        }
        prevTopScoreId.current = topScore.id;
      }
    } catch (err) {
      console.error("[Leaderboard] Error fetching scores:", err);
    } finally {
      setLoadingScores(false);
    }
  }, [triggerConfetti, playWinSound]);

  // Verify Admin permissions via existing endpoint
  const checkAdminAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/rsvps");
      if (res.status === 403) {
        setAuthStatus("unauthorized");
        setErrorMsg("This account does not have admin permissions to access the live presentation board.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setAuthStatus("authorized");
      fetchScores();
    } catch (err) {
      setAuthStatus("unauthorized");
      setErrorMsg((err as Error).message ?? "Failed admin validation request.");
    }
  }, [fetchScores]);

  // Handle Clerk authentication check
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        checkAdminAuth();
      } else {
        setAuthStatus("unauthorized");
        setErrorMsg("Please sign in to access the presentation board.");
      }
    }
  }, [isLoaded, isSignedIn, checkAdminAuth]);

  // Supabase realtime updates subscription and polling fallback
  useEffect(() => {
    if (authStatus !== "authorized") return;

    const supabase = getSupabase();
    const channel = supabase
      .channel("admin_game_leaderboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "memory_game_scores" },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    // 5-second polling fallback to guarantee live updates
    const pollInterval = setInterval(() => {
      fetchScores();
    }, 5000);

    // Trigger initial load confetti
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 1500);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
      clearTimeout(timer);
    };
  }, [authStatus, fetchScores, triggerConfetti]);

  // Fullscreen helper
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Helper to format time (seconds -> MM:SS.d)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  if (authStatus === "unauthorized") {
    return (
      <ErrorScreen
        message={errorMsg}
        isForbidden={true}
        onRetry={checkAdminAuth}
      />
    );
  }

  // podium mapping: 2nd place (idx 1), 1st place (idx 0), 3rd place (idx 2)
  const firstPlace = scores[0] || null;
  const secondPlace = scores[1] || null;
  const thirdPlace = scores[2] || null;
  const trailingScores = scores.slice(3);

  return (
    <main className="relative min-h-screen w-full premium-radial-bg overflow-x-hidden flex flex-col justify-between select-none text-white font-sans">
      
      {/* Background element */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <BackgroundGlow isMobile={false} />
      </div>
      <NoiseTexture />

      {/* Control panel / floating header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#F5EFC8]/8 bg-[#231815]/30 backdrop-blur-md">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#A5BCD6]/60 hover:text-[#F5EFC8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Dashboard</span>
        </Link>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium">Live Feed Enabled</span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Mute button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-full border border-white/5 bg-[#231815]/40 text-white/50 hover:border-white/10 hover:text-white/80 transition-colors cursor-pointer"
            title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400/80" />}
          </button>

          {/* Refresh scores manual override */}
          <button
            onClick={fetchScores}
            className="p-1.5 rounded-full border border-white/5 bg-[#231815]/40 text-white/50 hover:border-white/10 hover:text-white/80 transition-colors cursor-pointer"
            title="Refresh Leaderboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#F5EFC8]/20 bg-[#F5EFC8]/5 text-[#F5EFC8] text-xs font-sans uppercase tracking-wider font-light hover:bg-[#F5EFC8]/10 cursor-pointer"
            title="Fullscreen Presenter Mode"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>
        </div>
      </header>

      {/* Main presentation area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-7xl mx-auto w-full">
        
        {/* Title Block */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#F5EFC8]/10 bg-[#F5EFC8]/[0.02] text-[#F5EFC8] font-serif italic text-xs tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F5EFC8]/80 animate-pulse" />
            <span>UGAMA AARAMBHA 2K26 PRESENTATION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-transparent-yellow font-normal tracking-wide drop-shadow-[0_0_20px_rgba(245,239,200,0.15)]">
            🏆 Service Quest Champions
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#A5BCD6]/60 font-sans font-light">
            Interactive Memory Challenge Live Rankings
          </p>
        </div>

        {loadingScores ? (
          /* Loading State */
          <div className="flex flex-col items-center gap-4 py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full border-2 border-[#F5EFC8]/20 border-t-[#F5EFC8]"
            />
            <p className="text-xs uppercase tracking-widest text-[#A5BCD6]/40">Gathering Scores…</p>
          </div>
        ) : (
          <div className="w-full flex flex-col justify-between items-center gap-12">
            
            {/* 🏆 Podium Display 🏆 */}
            <div className="flex items-end justify-center gap-4 sm:gap-8 md:gap-12 w-full max-w-4xl min-h-[420px] pt-8">
              
              {/* ── 2nd Place (Left) ── */}
              <div className="flex flex-col items-center flex-1 max-w-[240px]">
                {secondPlace ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-1 mb-4 w-full"
                  >
                    {/* Floating trophy */}
                    <motion.div variants={floatVariants} animate="animate" className="text-4xl sm:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-1">
                      🥈
                    </motion.div>
                    <p className="text-base sm:text-lg font-serif italic text-white/90 truncate font-semibold">
                      {secondPlace.full_name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#A5BCD6]/70 truncate uppercase tracking-wider font-light">
                      {secondPlace.club_name}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A5BCD6] text-[10px] sm:text-xs font-mono font-light">
                      <Timer className="w-3 h-3 text-[#A5BCD6]/80" />
                      <span>{formatTime(secondPlace.completion_time)}</span>
                      <span className="text-white/20">|</span>
                      <span>{secondPlace.moves} moves</span>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-xs font-sans text-[#A5BCD6]/30 mb-8 italic">— Empty —</p>
                )}
                {/* Podium pillar */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "160px", opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    duration: 1.2,
                    delay: 0.1,
                  }}
                  className="w-full rounded-t-xl bg-gradient-to-b from-slate-800 to-slate-900 border-t-2 border-slate-400/40 border-x border-slate-900/50 shadow-2xl relative flex flex-col justify-between p-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#A5BCD6]/[0.02] pointer-events-none" />
                  {/* Rank number */}
                  <span className="text-5xl sm:text-6xl font-bold font-serif text-slate-400/20 text-center select-none mt-2 leading-none block">
                    2
                  </span>
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent mx-auto mb-2" />
                </motion.div>
              </div>

              {/* ── 1st Place (Center - Gold) ── */}
              <div className="flex flex-col items-center flex-1 max-w-[260px] relative -top-6">
                {firstPlace ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-1.5 mb-4 w-full"
                  >
                    {/* Floating trophy */}
                    <motion.div variants={floatVariants} animate="animate" className="text-5xl sm:text-6xl drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] mb-1">
                      👑
                    </motion.div>
                    <p className="text-lg sm:text-2xl font-serif italic text-transparent-yellow truncate font-bold drop-shadow-[0_0_12px_rgba(245,239,200,0.15)]">
                      {firstPlace.full_name}
                    </p>
                    <p className="text-xs text-[#F5EFC8]/80 truncate uppercase tracking-widest font-normal">
                      {firstPlace.club_name}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 rounded bg-[#EAB308]/15 border border-[#EAB308]/30 text-transparent-yellow text-xs font-mono font-medium shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                      <Timer className="w-3.5 h-3.5 text-[#EAB308]" />
                      <span>{formatTime(firstPlace.completion_time)}</span>
                      <span className="text-[#EAB308]/30">|</span>
                      <span>{firstPlace.moves} moves</span>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-xs font-sans text-[#A5BCD6]/30 mb-8 italic">— Empty —</p>
                )}
                {/* Podium pillar */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "230px", opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    duration: 1.2,
                    delay: 0.2,
                  }}
                  className="w-full rounded-t-xl bg-gradient-to-b from-[#4A2E27] to-[#2E1C18] border-t-2 border-[#EAB308]/50 border-x border-[#4A2E27]/50 shadow-2xl relative flex flex-col justify-between p-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#EAB308]/[0.03] pointer-events-none" />
                  {/* Rank number */}
                  <span className="text-7xl sm:text-8xl font-bold font-serif text-[#EAB308]/25 text-center select-none mt-2 leading-none block drop-shadow-[0_0_8px_rgba(234,179,8,0.15)]">
                    1
                  </span>
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#EAB308]/30 to-transparent mx-auto mb-2" />
                </motion.div>
              </div>

              {/* ── 3rd Place (Right) ── */}
              <div className="flex flex-col items-center flex-1 max-w-[240px]">
                {thirdPlace ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-1 mb-4 w-full"
                  >
                    {/* Floating trophy */}
                    <motion.div variants={floatVariants} animate="animate" className="text-4xl sm:text-5xl drop-shadow-[0_0_8px_rgba(180,83,9,0.2)] mb-1">
                      🥉
                    </motion.div>
                    <p className="text-base sm:text-lg font-serif italic text-white/90 truncate font-semibold">
                      {thirdPlace.full_name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#A5BCD6]/70 truncate uppercase tracking-wider font-light">
                      {thirdPlace.club_name}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A5BCD6] text-[10px] sm:text-xs font-mono font-light">
                      <Timer className="w-3 h-3 text-[#A5BCD6]/80" />
                      <span>{formatTime(thirdPlace.completion_time)}</span>
                      <span className="text-white/20">|</span>
                      <span>{thirdPlace.moves} moves</span>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-xs font-sans text-[#A5BCD6]/30 mb-8 italic">— Empty —</p>
                )}
                {/* Podium pillar */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "110px", opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    duration: 1.2,
                    delay: 0.3,
                  }}
                  className="w-full rounded-t-xl bg-gradient-to-b from-[#33221E] to-[#231815] border-t-2 border-[#B45309]/40 border-x border-[#33221E]/50 shadow-2xl relative flex flex-col justify-between p-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#B45309]/[0.02] pointer-events-none" />
                  {/* Rank number */}
                  <span className="text-4xl sm:text-5xl font-bold font-serif text-[#B45309]/20 text-center select-none mt-2 leading-none block">
                    3
                  </span>
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#B45309]/30 to-transparent mx-auto mb-2" />
                </motion.div>
              </div>

            </div>

            {/* ── Trailing Competitors Ribbon (Ranks 4-10) ── */}
            {trailingScores.length > 0 && (
              <div className="w-full max-w-5xl space-y-4 pt-4 border-t border-[#F5EFC8]/8">
                <p className="text-[10px] uppercase tracking-widest text-[#A5BCD6]/55 font-sans font-light text-center">
                  Ranks 4 to {scores.length}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {trailingScores.map((score, idx) => {
                    const rank = idx + 4;
                    return (
                      <motion.div
                        key={score.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="rounded-xl border border-[#F5EFC8]/10 bg-[#231815]/40 p-3 flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-serif italic text-xs text-[#A5BCD6]">
                          {rank}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-sans font-light text-white truncate leading-tight">
                            {score.full_name}
                          </p>
                          <p className="text-[9px] uppercase tracking-wider text-[#A5BCD6]/50 truncate leading-none mt-0.5">
                            {score.club_name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-mono font-light text-transparent-yellow">
                            {formatTime(score.completion_time)}
                          </p>
                          <p className="text-[9px] text-[#A5BCD6]/40 leading-none mt-0.5 font-light">
                            {score.moves} moves
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Footer watermark */}
      <footer className="relative z-10 w-full py-6 text-center text-[10px] font-sans uppercase tracking-[0.25em] text-[#A5BCD6]/25 border-t border-[#F5EFC8]/5 bg-[#231815]/20 backdrop-blur-sm">
        UGAMA AARAMBHA 2K26 · ROTARACT DISTRICT 3192 · GAME PRESENTATION PANEL
      </footer>
    </main>
  );
}
