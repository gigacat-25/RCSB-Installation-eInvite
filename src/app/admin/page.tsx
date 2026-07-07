"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import { Html5Qrcode } from "html5-qrcode";
import { EVENT, PRIMARY_CLUB } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RsvpRow {
  reference_number: string;
  full_name: string;
  club_name: string;
  designation: string | null;
  email: string | null;
  status: string;
  created_at: string;
  checked_in_at: string | null;
}

interface ScanResult {
  success: boolean;
  alreadyCheckedIn?: boolean;
  error?: string;
  guest?: {
    fullName: string;
    clubName: string;
    designation: string | null;
    email: string | null;
    checkedInAt: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CheckinBadge({ checkedInAt }: { checkedInAt: string | null }) {
  if (checkedInAt) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-sans font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        Checked In
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-sans font-light bg-amber-500/5 text-amber-500/40 border border-amber-500/15">
      <span className="w-1 h-1 rounded-full bg-amber-500/30" />
      Pending
    </span>
  );
}

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
        <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-light text-[#A5BCD6]/50">Loading…</p>
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
            {isForbidden ? "Unauthorized Account" : "Failed to Load RSVPs"}
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

// ─── QR Scanner Modal ──────────────────────────────────────────────────────────

interface ScannerModalProps {
  onClose: () => void;
  onCheckIn: (ref: string) => Promise<ScanResult>;
  onRefreshData: () => void;
}

function ScannerModal({ onClose, onCheckIn, onRefreshData }: ScannerModalProps) {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState("");
  const qrRef = useRef<Html5Qrcode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 880, duration = 0.15) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  };

  const handleScan = useCallback(async (refText: string) => {
    if (loading || result) return;
    setLoading(true);
    setScanning(false);

    if (qrRef.current && qrRef.current.isScanning) {
      try {
        await qrRef.current.stop();
      } catch (e) {
        console.warn("Error stopping scanner after detection:", e);
      }
    }

    try {
      const checkInResult = await onCheckIn(refText);
      setResult(checkInResult);

      if (checkInResult.success) {
        if (checkInResult.alreadyCheckedIn) {
          playBeep(440, 0.35);
        } else {
          playBeep(880, 0.15);
        }
        onRefreshData();
      } else {
        playBeep(220, 0.4);
      }
    } catch {
      setResult({ success: false, error: "Network check-in request failed." });
      playBeep(220, 0.4);
    } finally {
      setLoading(false);
    }
  }, [loading, result, onCheckIn, onRefreshData]);

  useEffect(() => {
    let active = true;
    let qrcode: Html5Qrcode | null = null;

    const timer = setTimeout(() => {
      if (!active) return;

      const el = document.getElementById("qr-viewfinder");
      if (!el) {
        setCameraError("Camera viewfinder element not found in DOM.");
        setScanning(false);
        return;
      }

      try {
        qrcode = new Html5Qrcode("qr-viewfinder");
        qrRef.current = qrcode;

        qrcode
          .start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.65;
                return { width: size, height: size };
              },
            },
            (text) => {
              handleScan(text);
            },
            () => {}
          )
          .catch((err) => {
            console.error("Camera startup error:", err);
            setCameraError("Unable to access camera. Please check camera permissions.");
            setScanning(false);
          });
      } catch (err) {
        console.error("Html5Qrcode constructor error:", err);
        setCameraError("Scanner initialization failed.");
        setScanning(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
      if (qrcode && qrcode.isScanning) {
        qrcode.stop().catch((e) => console.warn("Clean up camera stop error:", e));
      }
    };
  }, [handleScan]);

  const handleScanNext = async () => {
    setResult(null);
    setScanning(true);
    setCameraError("");

    setTimeout(() => {
      if (qrRef.current) {
        qrRef.current
          .start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.65;
                return { width: size, height: size };
              },
            },
            (text) => {
              handleScan(text);
            },
            () => {}
          )
          .catch(() => {
            setCameraError("Failed to restart camera.");
            setScanning(false);
          });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative w-full max-w-[370px] rounded-2xl border border-[#F5EFC8]/12 bg-[#231815] p-5 shadow-2xl space-y-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#F5EFC8]/[0.015] blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F5EFC8]/10 pb-3">
          <div>
            <h3 className="text-[9px] uppercase tracking-[0.25em] text-[#A5BCD6]/60">Entrance Gate</h3>
            <p className="text-base font-serif italic text-transparent-yellow">Scan QR Invitation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full border border-white/5 text-white/40 hover:border-white/10 hover:text-white/60 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Viewfinder or results */}
        <div className="relative min-h-[260px] flex flex-col items-center justify-center">

          {/* 1. Camera Viewfinder Wrapper */}
          {scanning && (
            <div className="w-full space-y-3">
              <div
                className="relative overflow-hidden rounded-xl border border-[#F5EFC8]/15 bg-black/40 w-full aspect-square flex items-center justify-center"
              >
                <div 
                  id="qr-viewfinder" 
                  className="absolute inset-0 w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
                />
              </div>
              <p className="text-center text-[9px] uppercase tracking-widest text-[#A5BCD6]/40 font-sans">
                Align ticket QR code inside viewfinder
              </p>
            </div>
          )}

          {/* 2. Loading State */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border border-[#F5EFC8]/20 border-t-[#F5EFC8]/80"
              />
              <p className="text-xs uppercase tracking-widest text-[#A5BCD6]/50 font-sans">Validating Ticket…</p>
            </div>
          )}

          {/* 3. Camera Startup Error */}
          {cameraError && (
            <div className="text-center space-y-3 py-6 px-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl">⚠️</div>
              <p className="text-xs text-[#A5BCD6]/80 leading-relaxed font-sans">{cameraError}</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleScanNext}
                className="px-5 py-2 rounded-full border border-[#F5EFC8]/35 text-[#F5EFC8] text-[10px] uppercase tracking-wider hover:bg-[#F5EFC8]/5 cursor-pointer"
              >
                Retry Camera
              </motion.button>
            </div>
          )}

          {/* 4. Scan Result Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center space-y-4 py-1"
            >
              {result.success ? (
                result.alreadyCheckedIn ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto text-xl">⚠️</div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-widest text-amber-500/60 font-sans">Warning</p>
                      <h4 className="text-lg font-serif italic text-[#F5EFC8]">Already Checked In</h4>
                    </div>
                    {result.guest && (
                      <div className="bg-[#231815]/50 border border-[#F5EFC8]/8 rounded-xl p-3 text-left space-y-1.5 max-w-sm mx-auto text-xs">
                        <p className="font-sans font-medium text-white">{result.guest.fullName}</p>
                        <p className="font-sans font-light text-[#A5BCD6]/70 leading-none">{result.guest.clubName}</p>
                        <div className="border-t border-[#F5EFC8]/5 pt-2 mt-1">
                          <p className="text-[9px] uppercase tracking-wider text-[#A5BCD6]/40 leading-none mb-1">Checked In At</p>
                          <p className="font-sans text-amber-400/80 font-light leading-none">
                            {formatDate(result.guest.checkedInAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto text-xl">✓</div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-sans">Success</p>
                      <h4 className="text-lg font-serif italic text-transparent-yellow">Check-in Complete</h4>
                    </div>
                    {result.guest && (
                      <div className="bg-[#231815]/50 border border-[#F5EFC8]/8 rounded-xl p-3 text-left space-y-1.5 max-w-sm mx-auto text-xs">
                        <p className="font-sans font-medium text-white">{result.guest.fullName}</p>
                        <p className="font-sans font-light text-[#A5BCD6]/70 leading-none">{result.guest.clubName}</p>
                        {result.guest.designation && (
                          <p className="text-[10px] font-sans font-light text-[#A5BCD6]/50">{result.guest.designation}</p>
                        )}
                        {result.guest.email && (
                          <p className="text-[9px] font-mono text-[#A5BCD6]/40 border-t border-[#F5EFC8]/5 pt-2 mt-1 truncate">
                            Email sent to: {result.guest.email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center mx-auto text-xl">✕</div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-red-400 font-sans">Invalid Ticket</p>
                    <h4 className="text-lg font-serif italic text-red-400/80">Check-in Failed</h4>
                  </div>
                  <p className="text-xs text-[#A5BCD6]/75 font-sans leading-relaxed max-w-xs mx-auto">
                    {result.error ?? "Invalid QR code or ticket code. Please check guest list manually."}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScanNext}
                  className="px-6 py-2.5 rounded-full border border-[#F5EFC8]/35 bg-[#F5EFC8]/[0.04] text-[#F5EFC8] text-[10px] uppercase tracking-widest font-sans font-light hover:bg-[#F5EFC8]/[0.08] transition-all cursor-pointer"
                >
                  Scan Next Ticket
                </motion.button>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

// ─── Guest Card for Mobile ──────────────────────────────────────────────────

function GuestCard({ row }: { row: RsvpRow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#F5EFC8]/10 bg-[#231815]/40 backdrop-blur-sm p-4 space-y-3 shadow-md"
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#F5EFC8]/5 pb-2">
        <div className="min-w-0">
          <p className="text-sm font-serif italic text-transparent-yellow truncate leading-snug">{row.full_name}</p>
          <p className="text-xs font-sans font-light text-[#A5BCD6]/80 leading-snug truncate mt-0.5">{row.club_name}</p>
          {row.designation && (
            <p className="text-[10px] font-sans font-light text-[#A5BCD6]/50 truncate mt-0.5">{row.designation}</p>
          )}
        </div>
        <div className="shrink-0 pt-0.5">
          <CheckinBadge checkedInAt={row.checked_in_at} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-sans font-light text-[#A5BCD6]/40">
        <div>
          <span className="font-mono text-[10px] text-[#F5EFC8]/60 tracking-wider">{row.reference_number}</span>
        </div>
        <div className="flex items-center gap-3">
          {row.email ? (
            <a href={`mailto:${row.email}`} className="text-[#A5BCD6]/60 hover:text-[#F5EFC8] lowercase underline font-light">
              Email
            </a>
          ) : null}
          <span>Reg: {new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

interface DashboardProps {
  rsvps: RsvpRow[];
  onRetry: () => void;
  onCheckIn: (ref: string) => Promise<ScanResult>;
}

function Dashboard({ rsvps, onRetry, onCheckIn }: DashboardProps) {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const confirmed = rsvps.filter((r) => r.status === "confirmed").length;
  const checkedIn = rsvps.filter((r) => r.checked_in_at).length;
  const withEmail = rsvps.filter((r) => r.email).length;
  const uniqueClubs = new Set(rsvps.map((r) => r.club_name)).size;

  const filtered = rsvps.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.club_name.toLowerCase().includes(q) ||
      (r.designation ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      r.reference_number.toLowerCase().includes(q)
    );
  });

  const handleDownloadCSV = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/rsvps?format=csv");
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ugama-aarambha-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download CSV. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#231815] text-white font-sans overflow-x-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#4A2E27]/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#4D0E12]/15 blur-[100px]" />
      </div>

      {/* Sticky Header — Clean & Simple for Mobile */}
      <header className="relative z-10 sticky top-0 border-b border-[#F5EFC8]/8 bg-[#231815]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Left — title */}
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#A5BCD6]/50 font-light leading-none mb-0.5">Admin Dashboard</p>
            <p className="text-sm font-serif italic text-transparent-yellow leading-none truncate">{EVENT.title}</p>
          </div>

          {/* Right — Minimal layout for mobile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Scan QR Code */}
            <motion.button
              onClick={() => setScannerOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-emerald-500/35 bg-emerald-500/[0.05] text-emerald-400 text-[10px] uppercase tracking-widest font-medium transition-all hover:bg-emerald-500/[0.12] hover:border-emerald-500/60 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 11v1m4-6h1m-11 0h1m8-6h1m-1 12H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-1M9 10h.01M15 10h.01M12 12h.01M9 14h6m-7 4V6a2 2 0 012-2h4a2 2 0 012 2v12" />
              </svg>
              <span>Scan</span>
            </motion.button>

            {/* Clerk User Button */}
            <div className="flex items-center shrink-0">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-[#F5EFC8]/20",
                    userButtonPopoverCard: "bg-[#231815] border border-[#F5EFC8]/12 shadow-xl",
                    userButtonPopoverActionButton: "text-[#A5BCD6] hover:text-white hover:bg-[#F5EFC8]/5",
                    userButtonPopoverActionButtonText: "text-xs font-sans font-light tracking-wide",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total RSVPs",        value: rsvps.length,  color: "text-[#F5EFC8]" },
            { label: "Checked In",          value: checkedIn,      color: "text-emerald-400" },
            { label: "With Email",          value: withEmail,      color: "text-cerulean-blue" },
            { label: "Clubs Represented",   value: uniqueClubs,    color: "text-cerulean-blue" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-xl border border-[#F5EFC8]/10 bg-[#231815]/50 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 flex flex-col justify-between h-full space-y-1 shadow-sm"
            >
              <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#A5BCD6]/50 font-light truncate leading-none">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-sans font-light ${stat.color} leading-none mt-1`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Actions Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#231815]/30 border border-[#F5EFC8]/8 p-3 rounded-2xl backdrop-blur-sm">
          {/* Search box */}
          <div className="relative w-full sm:max-w-[280px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A5BCD6]/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search guests, clubs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#231815]/50 border border-[#F5EFC8]/12 rounded-full pl-9 pr-4 py-2 text-xs text-[#F5EFC8] placeholder:text-white/20 focus:outline-none focus:border-[#F5EFC8]/35 transition-colors font-sans font-light"
            />
          </div>

          {/* Control Buttons (Refresh + CSV moved out of sticky header) */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#A5BCD6]/45 font-light whitespace-nowrap">
              {filtered.length} of {rsvps.length} entries
            </p>

            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <motion.button
                onClick={onRetry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Refresh List"
                className="p-2 rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all cursor-pointer bg-[#231815]/40"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>

              {/* Export CSV Button */}
              <motion.button
                onClick={handleDownloadCSV}
                disabled={downloading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#F5EFC8]/25 bg-[#F5EFC8]/[0.03] text-[#F5EFC8] text-[10px] uppercase tracking-widest font-light transition-all hover:bg-[#F5EFC8]/[0.08] hover:border-[#F5EFC8]/50 disabled:opacity-50 cursor-pointer"
                title="Export CSV"
              >
                {downloading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 rounded-full border border-[#F5EFC8]/30 border-t-[#F5EFC8]/80 inline-block" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                <span>Export CSV</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── RESPONSIVE GUEST LISTS ── */}

        {/* 1. Mobile Cards view (visible on mobile only) */}
        <div className="block md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-[#F5EFC8]/10 bg-[#231815]/20 p-12 text-center">
              <p className="text-sm font-serif italic text-[#F5EFC8]/50">
                {search ? "No results match your search." : "No RSVPs yet."}
              </p>
            </div>
          ) : (
            filtered.map((row) => (
              <GuestCard key={row.reference_number} row={row} />
            ))
          )}
        </div>

        {/* 2. Desktop Table view (visible on larger screens only) */}
        <div className="hidden md:block rounded-xl border border-[#F5EFC8]/10 overflow-hidden bg-[#231815]/40 backdrop-blur-md shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F5EFC8]/8">
                  {["Reference", "Full Name", "Club", "Designation", "Email", "Check-in Status", "Registered"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[9px] uppercase tracking-[0.25em] text-[#A5BCD6]/45 font-light font-sans whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <p className="text-sm font-serif italic text-[#F5EFC8]/50">
                          {search ? "No results match your search." : "No RSVPs yet."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, i) => (
                      <motion.tr
                        key={row.reference_number}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.35) }}
                        className="border-b border-[#F5EFC8]/5 hover:bg-[#F5EFC8]/[0.022] transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[11px] text-[#F5EFC8]/70 tracking-wider">{row.reference_number}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-sans font-light text-white/90 whitespace-nowrap">{row.full_name}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-sans font-light text-[#A5BCD6]/75">{row.club_name}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-sans font-light text-[#A5BCD6]/55">{row.designation ?? "—"}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          {row.email ? (
                            <a href={`mailto:${row.email}`} className="text-xs font-sans font-light text-[#A5BCD6]/65 hover:text-[#F5EFC8] transition-colors">
                              {row.email}
                            </a>
                          ) : (
                            <p className="text-xs font-sans font-light text-[#A5BCD6]/30">—</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <CheckinBadge checkedInAt={row.checked_in_at} />
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-[11px] font-sans font-light text-[#A5BCD6]/45 whitespace-nowrap">
                            {formatDate(row.created_at)}
                          </p>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] uppercase tracking-[0.28em] text-[#A5BCD6]/25 font-light pb-4">
          {PRIMARY_CLUB} · {EVENT.district} · Admin Panel
        </p>
      </main>

      {/* QR Scanner view modal */}
      <AnimatePresence>
        {scannerOpen && (
          <ScannerModal
            onClose={() => setScannerOpen(false)}
            onCheckIn={onCheckIn}
            onRefreshData={onRetry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [dataState, setDataState] = useState<"loading" | "ready" | "error">("loading");
  const [isForbidden, setIsForbidden] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRsvps = useCallback(async () => {
    setDataState("loading");
    setErrorMsg("");
    setIsForbidden(false);
    try {
      const res = await fetch("/api/admin/rsvps");
      if (res.status === 403) {
        setIsForbidden(true);
        setErrorMsg("This account does not have admin permissions to access this invite dashboard.");
        setDataState("error");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRsvps(data.data ?? []);
      setDataState("ready");
    } catch (err) {
      setErrorMsg((err as Error).message ?? "Unknown error.");
      setDataState("error");
    }
  }, []);

  const handleCheckIn = useCallback(async (reference: string): Promise<ScanResult> => {
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: "Network communication error." };
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchRsvps();
    }
  }, [isLoaded, isSignedIn, fetchRsvps]);

  // Clerk not loaded yet
  if (!isLoaded || (isSignedIn && dataState === "loading")) {
    return <LoadingScreen />;
  }

  // Auth handled by middleware — if user reaches here they're signed in
  if (dataState === "error") {
    return (
      <ErrorScreen
        message={errorMsg}
        isForbidden={isForbidden}
        onRetry={fetchRsvps}
      />
    );
  }

  return (
    <Dashboard
      rsvps={rsvps}
      onRetry={fetchRsvps}
      onCheckIn={handleCheckIn}
    />
  );
}
