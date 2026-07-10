"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  ArrowLeft,
  Timer,
  RefreshCw,
  Play,
  Sparkles,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import BackgroundGlow from "@/components/BackgroundGlow";
import NoiseTexture from "@/components/NoiseTexture";

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
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
};

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchScores = async () => {
    try {
      const supabase = getSupabase();
      const { data, error: dbError } = await supabase
        .from("memory_game_scores")
        .select("*")
        .order("completion_time", { ascending: true })
        .order("moves", { ascending: true })
        .limit(20);

      if (dbError) {
        throw dbError;
      }

      setScores(data || []);
    } catch (err) {
      console.error("[Leaderboard] Error fetching scores:", err);
      setError("Failed to connect and fetch leaderboard scores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchScores();

    // Set up Supabase Realtime Subscription
    const supabase = getSupabase();
    const channel = supabase
      .channel("memory_game_leaderboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "memory_game_scores" },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper to format completion time (seconds -> MM:SS.d)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  // Helper for Top 3 styling classes
  const getTopThreeClasses = (index: number) => {
    switch (index) {
      case 0: // Gold
        return {
          rowClass: "border-[#EAB308]/25 bg-gradient-to-r from-[#EAB308]/5 via-transparent to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.02),0_0_12px_rgba(234,179,8,0.03)]",
          badgeClass: "bg-[#EAB308]/15 border-[#EAB308]/40 text-[#EAB308]",
          rankIcon: "🥇",
        };
      case 1: // Silver
        return {
          rowClass: "border-[#94A3B8]/20 bg-gradient-to-r from-[#94A3B8]/5 via-transparent to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]",
          badgeClass: "bg-[#94A3B8]/15 border-[#94A3B8]/30 text-[#94A3B8]",
          rankIcon: "🥈",
        };
      case 2: // Bronze
        return {
          rowClass: "border-[#B45309]/20 bg-gradient-to-r from-[#B45309]/5 via-transparent to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]",
          badgeClass: "bg-[#B45309]/15 border-[#B45309]/30 text-[#B45309]",
          rankIcon: "🥉",
        };
      default:
        return {
          rowClass: "border-[#F5EFC8]/10 bg-[#231815]/10 hover:bg-[#231815]/40",
          badgeClass: "bg-[#F5EFC8]/5 border-[#F5EFC8]/10 text-[#A5BCD6]/80",
          rankIcon: null,
        };
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full premium-radial-bg overflow-x-hidden flex flex-col justify-between select-none">
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <BackgroundGlow isMobile={false} />
      </div>
      <NoiseTexture />

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#F5EFC8]/10 bg-[#231815]/30 backdrop-blur-md">
        <Link
          href="/service-quest"
          className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#A5BCD6]/70 hover:text-[#F5EFC8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Game</span>
        </Link>
        
        <div className="flex items-center gap-1.5 text-xs text-[#F5EFC8] font-serif italic">
          <Sparkles className="w-3.5 h-3.5 text-[#F5EFC8]/80 animate-pulse" />
          <span>UGAMA AARAMBHA 2K26</span>
        </div>
      </header>

      {/* Leaderboard content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start p-6 w-full max-w-4xl mx-auto pt-10 sm:pt-16">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <div className="w-14 h-14 mx-auto rounded-full border border-[#F5EFC8]/20 bg-[#F5EFC8]/5 flex items-center justify-center shadow-[inset_0_0_12px_rgba(245,239,200,0.1)]">
            <Trophy className="w-6 h-6 text-[#F5EFC8] filter drop-shadow-[0_0_6px_rgba(245,239,200,0.25)]" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-serif italic text-transparent-yellow font-normal tracking-wide">
              🏆 Service Quest Leaderboard
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#A5BCD6]/60 font-sans">
              Rotaract Memory Challenge Champions
            </p>
          </div>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/30 to-transparent mx-auto mt-4" />
        </div>

        {/* Table Container */}
        <div className="w-full max-w-2xl rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/40 backdrop-blur-xl shadow-2xl p-4 sm:p-6 overflow-hidden">
          
          {loading ? (
            /* Loading Skeleton */
            <div className="space-y-3.5 py-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full h-14 rounded-xl bg-white/[0.02] border border-[#F5EFC8]/5 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm text-red-400 font-sans tracking-wide">⚠️ {error}</p>
              <button
                onClick={fetchScores}
                className="px-4 py-2 text-xs border border-[#F5EFC8]/35 text-[#F5EFC8] hover:bg-[#F5EFC8]/5 transition-colors rounded-lg font-sans uppercase tracking-wider"
              >
                Try Again
              </button>
            </div>
          ) : scores.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16 space-y-4">
              <p className="text-sm font-sans font-light text-[#A5BCD6]/60 tracking-wider">
                No runs recorded yet. Be the first to place on the leaderboard!
              </p>
              <Link
                href="/service-quest"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#F5EFC8]/35 bg-[#F5EFC8] text-[#231815] text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#faf6db] transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Game Now</span>
              </Link>
            </div>
          ) : (
            /* Leaderboard List */
            <div className="space-y-3">
              {/* Header Titles */}
              <div className="grid grid-cols-12 px-4 py-2 text-[9px] sm:text-[10px] font-sans uppercase tracking-widest text-[#A5BCD6]/55 border-b border-[#F5EFC8]/10 mb-2">
                <span className="col-span-2 text-left">Rank</span>
                <span className="col-span-5 text-left">Player</span>
                <span className="col-span-3 text-right">Time</span>
                <span className="col-span-2 text-right">Moves</span>
              </div>

              {/* Rows */}
              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {scores.map((score, idx) => {
                  const { rowClass, badgeClass, rankIcon } = getTopThreeClasses(idx);

                  return (
                    <motion.div
                      key={score.id}
                      variants={rowVariants}
                      className={`grid grid-cols-12 items-center px-4 py-3 sm:py-3.5 rounded-xl border text-white transition-colors duration-300 ${rowClass}`}
                    >
                      {/* Rank Column */}
                      <div className="col-span-2 flex items-center">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center font-serif text-sm italic font-medium ${badgeClass}`}
                        >
                          {rankIcon || idx + 1}
                        </div>
                      </div>

                      {/* Player and Club Column */}
                      <div className="col-span-5 flex flex-col items-start pr-2">
                        <span className="text-sm font-sans font-medium text-white truncate max-w-full">
                          {score.full_name}
                        </span>
                        <span className="text-[10px] sm:text-xs font-sans font-light text-[#A5BCD6]/60 truncate max-w-full">
                          {score.club_name}
                        </span>
                      </div>

                      {/* Time Column */}
                      <div className="col-span-3 text-right flex items-center justify-end gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-transparent-yellow opacity-60 hidden sm:inline" />
                        <span className="font-sans text-sm font-light text-transparent-yellow">
                          {formatTime(score.completion_time)}
                        </span>
                      </div>

                      {/* Moves Column */}
                      <div className="col-span-2 text-right flex items-center justify-end gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-[#A5BCD6] opacity-60 hidden sm:inline" />
                        <span className="font-sans text-sm font-light text-[#A5BCD6]/90">
                          {score.moves}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </div>

        {/* Action Link */}
        <div className="mt-8 text-center">
          <Link
            href="/service-quest"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#F5EFC8]/20 bg-[#231815]/60 hover:bg-[#231815]/95 hover:border-[#F5EFC8]/45 text-[#A5BCD6] hover:text-[#F5EFC8] text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300"
          >
            <Play className="w-3.5 h-3.5 text-[#A5BCD6] group-hover:text-[#F5EFC8]" />
            <span>Play Quest</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-[10px] font-sans uppercase tracking-[0.25em] text-[#A5BCD6]/30 border-t border-[#F5EFC8]/5 bg-[#231815]/20 backdrop-blur-sm">
        UGAMA AARAMBHA 2K26 · ROTARACT DISTRICT 3192
      </footer>
    </main>
  );
}
