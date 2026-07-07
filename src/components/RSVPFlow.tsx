"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT, RSVP_CONTACTS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type RsvpStep = "idle" | "welcome" | "form" | "submitting" | "confirmed" | "declined" | "error";

interface FormData {
  fullName: string;
  clubName: string;
  designation: string;
  email: string;
}

interface ConfirmationData {
  fullName: string;
  clubName: string;
  designation: string;
  reference: string;
}

// ─── Field Component ─────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-[10px] uppercase tracking-[0.22em] font-sans font-light text-[#A5BCD6]/70">
        {label}
        {required && <span className="text-[#F5EFC8]/60 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-transparent border-b border-[#F5EFC8]/20 focus:border-[#F5EFC8]/55 text-[#F5EFC8] font-sans font-light text-sm py-2 px-0 outline-none placeholder:text-white/20 transition-colors duration-300";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RSVPFlow() {
  const [step, setStep] = useState<RsvpStep>("idle");
  const [othersFading, setOthersFading] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    clubName: "",
    designation: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  // ── Step 1: Accept / Decline ────────────────────────────────────────────────

  const handleAccept = () => {
    setOthersFading(true);
    setTimeout(() => {
      setStep("welcome");
      setTimeout(() => setStep("form"), 2800);
    }, 600);
  };

  const handleDecline = () => {
    setOthersFading(true);
    setTimeout(() => setStep("declined"), 600);
  };

  // ── Step 2: Validate ─────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = "required";
    if (!form.clubName.trim()) e.clubName = "required";
    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) e.email = "invalid";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Step 3: Submit via API Route ─────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStep("submitting");
    setSubmitError("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          clubName: form.clubName.trim(),
          designation: form.designation.trim() || undefined,
          email: form.email.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const msg = data?.error ?? "Something went wrong. Please try again.";
        setSubmitError(msg);
        setStep("error");
        return;
      }

      setConfirmation({
        fullName: form.fullName.trim(),
        clubName: form.clubName.trim(),
        designation: form.designation.trim(),
        reference: data.reference,
      });
      setStep("confirmed");
    } catch {
      setSubmitError("A network error occurred. Please check your connection and try again.");
      setStep("error");
    }
  };

  // ── Retry ────────────────────────────────────────────────────────────────────

  const handleRetry = () => {
    setSubmitError("");
    setStep("form");
  };

  // ── Framer Motion variants ───────────────────────────────────────────────────

  const fadeUpInitial = { opacity: 0, y: 18 };
  const fadeUpAnimate = { opacity: 1, y: 0 };
  const fadeUpTransition = { duration: 0.7, ease: "easeOut" as const };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[70vh] py-24 mt-16 md:mt-24 overflow-hidden">

      {/* Ambient central glow */}
      <motion.div
        animate={{ opacity: [0.45, 0.7, 0.45], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-[#F5EFC8]/[0.025] blur-[100px] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      />

      {/* Floating specks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`sp-${i}`}
          className="absolute pointer-events-none rounded-full bg-[#F5EFC8]/15 mix-blend-screen"
          style={{
            left: `${15 + (i * 11) % 70}%`,
            top: `${15 + (i * 13) % 70}%`,
            width: i % 3 === 0 ? 3.5 : 1.8,
            height: i % 3 === 0 ? 3.5 : 1.8,
          }}
          animate={{
            y: [0, i % 2 === 0 ? -28 : 28, 0],
            x: [0, i % 2 === 0 ? 18 : -18, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{ duration: 9 + (i * 2) % 8, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
        />
      ))}

      <AnimatePresence mode="wait">

        {/* ── IDLE: Heading + Buttons ── */}
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.4 } }}
            className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-[650px] px-4 w-full"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-transparent-yellow font-normal tracking-wide leading-tight drop-shadow-[0_0_20px_rgba(245,239,200,0.08)]">
                Will you be part of <br /> this new beginning?
              </h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/45 to-transparent mx-auto" />
              <p className="text-sm sm:text-base md:text-lg font-sans font-light text-[#A5BCD6]/85 max-w-[500px] leading-relaxed mx-auto">
                Your presence will make this evening even more meaningful.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[560px]">
              {/* I'll be there */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(245,239,200,0.14)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAccept}
                className="relative w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#F5EFC8]/35 bg-[#F5EFC8]/[0.04] text-[#F5EFC8] font-sans font-light tracking-wider text-xs sm:text-sm uppercase transition-colors duration-300 backdrop-blur-md cursor-pointer hover:bg-[#F5EFC8]/[0.09] hover:border-[#F5EFC8]/65"
              >
                {"I'll be there"}
              </motion.button>

              {/* Unable to attend */}
              <motion.button
                animate={{ opacity: othersFading ? 0 : 1 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDecline}
                className="relative w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/10 bg-transparent text-white/40 font-sans font-light tracking-wider text-xs sm:text-sm uppercase transition-colors duration-300 cursor-pointer hover:border-white/20 hover:text-white/60"
              >
                Unable to attend
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── WELCOME: Elegant reveal card ── */}
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-[520px] px-4 w-full"
          >
            {/* Celebration glow burst */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.8, 2.4] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] rounded-full bg-[#F5EFC8]/[0.06] blur-[60px] pointer-events-none"
            />

            {/* Celebration particles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={`cp-${i}`}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  x: [(Math.cos((i / 10) * Math.PI * 2)) * 0, (Math.cos((i / 10) * Math.PI * 2)) * 110],
                  y: [(Math.sin((i / 10) * Math.PI * 2)) * 0, (Math.sin((i / 10) * Math.PI * 2)) * 110],
                  scale: [0, 1.2, 0],
                }}
                transition={{ duration: 1.6, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: i % 2 === 0 ? 5 : 3,
                  height: i % 2 === 0 ? 5 : 3,
                  background: i % 3 === 0 ? "#F5EFC8" : i % 3 === 1 ? "#A5BCD6" : "#4D0E12",
                }}
              />
            ))}

            <div className="relative space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-transparent-yellow font-normal drop-shadow-[0_0_30px_rgba(245,239,200,0.18)]"
              >
                Wonderful.
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/50 to-transparent mx-auto origin-center"
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
                className="text-sm sm:text-base font-sans font-light text-[#A5BCD6]/90 max-w-[380px] leading-relaxed mx-auto"
              >
                We look forward to welcoming you.
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* ── FORM: Staggered RSVP fields ── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-[520px] px-4"
          >
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              {/* Header */}
              <motion.div initial={fadeUpInitial} animate={fadeUpAnimate} transition={fadeUpTransition} className="text-center space-y-2 mb-8">
                <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#A5BCD6]/55">Your RSVP</p>
                <h3 className="text-2xl sm:text-3xl font-serif italic text-transparent-yellow">
                  Reserve your seat
                </h3>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/35 to-transparent mx-auto mt-2" />
              </motion.div>

              {/* Full Name */}
              <motion.div initial={fadeUpInitial} animate={fadeUpAnimate} transition={fadeUpTransition}>
                <Field label="Full Name" required>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={inputClass}
                  />
                  {errors.fullName && (
                    <p className="text-[10px] text-[#4D0E12]/80 mt-1 font-sans tracking-wide">This field is required</p>
                  )}
                </Field>
              </motion.div>

              {/* Club Name */}
              <motion.div initial={fadeUpInitial} animate={fadeUpAnimate} transition={fadeUpTransition}>
                <Field label="Club Name" required>
                  <input
                    type="text"
                    placeholder="Your Rotaract / Rotary club"
                    value={form.clubName}
                    onChange={(e) => setForm({ ...form, clubName: e.target.value })}
                    className={inputClass}
                  />
                  {errors.clubName && (
                    <p className="text-[10px] text-[#4D0E12]/80 mt-1 font-sans tracking-wide">This field is required</p>
                  )}
                </Field>
              </motion.div>

              {/* Designation */}
              <motion.div initial={fadeUpInitial} animate={fadeUpAnimate} transition={fadeUpTransition}>
                <Field label="Designation">
                  <input
                    type="text"
                    placeholder="President, Secretary, Member…"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </motion.div>

              {/* Email */}
              <motion.div initial={fadeUpInitial} animate={fadeUpAnimate} transition={fadeUpTransition}>
                <Field label="Email Address">
                  <input
                    type="email"
                    placeholder="your@email.com (optional — for confirmation)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-[#4D0E12]/80 mt-1 font-sans tracking-wide">Please enter a valid email address</p>
                  )}
                </Field>
              </motion.div>

              {/* Submit */}
              <motion.div initial={fadeUpInitial} animate={fadeUpAnimate} transition={fadeUpTransition} className="pt-4 flex justify-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(245,239,200,0.12)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-3.5 rounded-full border border-[#F5EFC8]/40 bg-[#F5EFC8]/[0.04] text-[#F5EFC8] font-sans font-light tracking-[0.18em] text-xs uppercase transition-all duration-300 backdrop-blur-md cursor-pointer hover:bg-[#F5EFC8]/[0.10] hover:border-[#F5EFC8]/70"
                >
                  Confirm Attendance
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        )}

        {/* ── SUBMITTING: Quiet transition ── */}
        {step === "submitting" && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="w-7 h-7 rounded-full border border-[#F5EFC8]/30 border-t-[#F5EFC8]/80"
            />
            <p className="text-xs font-sans tracking-widest uppercase text-[#A5BCD6]/55">Reserving your seat…</p>
          </motion.div>
        )}

        {/* ── ERROR: Friendly retry state ── */}
        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-[480px] px-4"
          >
            <div className="rounded-2xl border border-[#4D0E12]/60 bg-[#4D0E12]/10 backdrop-blur-md p-8 text-center space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] font-sans font-light text-[#A5BCD6]/60">
                  Something went wrong
                </p>
                <h3 className="text-xl font-serif italic text-transparent-yellow">
                  Unable to Confirm RSVP
                </h3>
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/20 to-transparent mx-auto" />
              </div>
              {submitError && (
                <p className="text-sm font-sans font-light text-[#A5BCD6]/80 leading-relaxed">
                  {submitError}
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRetry}
                  className="px-7 py-3 rounded-full border border-[#F5EFC8]/35 bg-[#F5EFC8]/[0.04] text-[#F5EFC8] font-sans font-light tracking-wider text-xs uppercase transition-all duration-300 cursor-pointer hover:bg-[#F5EFC8]/[0.09]"
                >
                  Try Again
                </motion.button>
                <p className="text-[10px] font-sans text-[#A5BCD6]/45 font-light">
                  or contact us directly
                </p>
              </div>
              {/* Fallback contacts */}
              <div className="pt-2 space-y-1">
                {RSVP_CONTACTS.map((c) => (
                  <p key={c.name} className="text-[10px] uppercase tracking-wider text-[#A5BCD6]/50 font-sans">
                    {c.role} {c.name} · {c.phone}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CONFIRMED: VIP Boarding Pass ── */}
        {step === "confirmed" && confirmation && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, y: 40, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            className="relative z-10 w-full max-w-[500px] px-4"
          >
            {/* Confirmation glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0.35] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 bg-[#F5EFC8]/[0.018] blur-[80px] rounded-3xl pointer-events-none"
            />

            {/* The Pass */}
            <div className="relative rounded-2xl border border-[#F5EFC8]/20 bg-[#231815]/60 backdrop-blur-lg overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]">

              {/* Top section */}
              <div className="px-7 pt-7 pb-5 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="space-y-1"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] font-sans text-[#A5BCD6]/50">Invitation Reserved</p>
                  <p className="text-2xl sm:text-3xl font-serif italic text-transparent-yellow">
                    {confirmation.fullName}
                  </p>
                  {confirmation.designation && (
                    <p className="text-xs font-sans font-light tracking-wider text-[#A5BCD6]/75">
                      {confirmation.designation}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-xs font-sans font-light text-[#A5BCD6]/70 tracking-wide"
                >
                  {confirmation.clubName}
                </motion.div>
              </div>

              {/* Dashed ticket separator */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="relative px-0 origin-left"
              >
                <div className="border-t border-dashed border-[#F5EFC8]/15 mx-0" />
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#231815] border border-[#F5EFC8]/10" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#231815] border border-[#F5EFC8]/10" />
              </motion.div>

              {/* Bottom details grid */}
              <motion.div
                variants={{ animate: { transition: { staggerChildren: 0.08, delayChildren: 0.75 } } }}
                initial="initial"
                animate="animate"
                className="px-7 py-5 grid grid-cols-2 gap-x-6 gap-y-4"
              >
                {[
                  { label: "Event", value: EVENT.title },
                  { label: "Date",  value: EVENT.date },
                  { label: "Venue", value: EVENT.venue },
                  { label: "Status", value: "CONFIRMED ✓" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      initial: { opacity: 0, y: 8 },
                      animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                    className="space-y-0.5"
                  >
                    <p className="text-[9px] uppercase tracking-[0.22em] font-sans text-[#A5BCD6]/45">
                      {item.label}
                    </p>
                    <p className={`text-xs font-sans font-light ${item.label === "Status" ? "text-[#F5EFC8]" : "text-white/80"}`}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Second dashed separator */}
              <div className="relative">
                <div className="border-t border-dashed border-[#F5EFC8]/15" />
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#231815] border border-[#F5EFC8]/10" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#231815] border border-[#F5EFC8]/10" />
              </div>

              {/* Reference number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="px-7 py-5 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-[0.25em] font-sans text-[#A5BCD6]/45">Reference</p>
                  <p className="text-xl sm:text-2xl font-mono font-light tracking-[0.22em] text-transparent-yellow drop-shadow-[0_0_12px_rgba(245,239,200,0.25)]">
                    {confirmation.reference}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[9px] uppercase tracking-[0.22em] font-sans text-[#A5BCD6]/45">Host</p>
                  <p className="text-[10px] font-sans font-light text-white/55 max-w-[120px] leading-relaxed">
                    Rotaract Club of Swarna Bengaluru
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Closing note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.9 }}
              className="text-center text-[10px] font-sans font-light tracking-[0.2em] uppercase text-[#A5BCD6]/40 mt-6"
            >
              Your invitation has been reserved · See you on the 12th
            </motion.p>
          </motion.div>
        )}

        {/* ── DECLINED: We'll Miss You card ── */}
        {step === "declined" && (
          <motion.div
            key="declined"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="relative z-10 w-full max-w-[500px] px-4"
          >
            {/* Ambient glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0.3] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 bg-[#F5EFC8]/[0.015] blur-[80px] rounded-3xl pointer-events-none"
            />

            {/* Floating particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`dp-dec-${i}`}
                className="absolute pointer-events-none rounded-full bg-[#F5EFC8]/20 mix-blend-screen"
                style={{
                  left: `${15 + (i * 12) % 70}%`,
                  top: `${20 + (i * 11) % 60}%`,
                  width: i % 2 === 0 ? 3 : 1.5,
                  height: i % 2 === 0 ? 3 : 1.5,
                }}
                animate={{
                  y: [0, i % 2 === 0 ? -20 : 20, 0],
                  opacity: [0.08, 0.25, 0.08],
                }}
                transition={{ duration: 6 + (i * 1.5) % 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
            ))}

            <div className="relative rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/50 backdrop-blur-lg p-8 sm:p-10 text-center space-y-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.04)] overflow-hidden">
              {/* Shimmer */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5EFC8]/[0.02] to-transparent pointer-events-none animate-card-shimmer" />

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.25em] font-sans font-light text-[#A5BCD6]/60">RSVP Status</p>
                <h3 className="text-3xl sm:text-4xl font-serif italic text-transparent-yellow font-normal drop-shadow-[0_0_20px_rgba(245,239,200,0.12)]">
                  {"We'll Miss You"}
                </h3>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/30 to-transparent mx-auto" />
              </div>

              <p className="text-sm font-sans font-light leading-relaxed text-[#A5BCD6]/85 max-w-[380px] mx-auto">
                Thank you for letting us know. While we won&apos;t have the pleasure of your presence this time, your support means a great deal to us. We hope to welcome you at one of our future events.
              </p>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setOthersFading(false); setStep("idle"); }}
                  className="px-6 py-2.5 rounded-full border border-[#F5EFC8]/20 bg-transparent text-[#F5EFC8]/70 font-sans font-light tracking-wider text-[10px] uppercase hover:bg-white/[0.02] hover:text-[#F5EFC8] transition-all duration-300"
                >
                  Change Response
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
