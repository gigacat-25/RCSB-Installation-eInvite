"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <div className="relative min-h-screen bg-[#231815] text-[#A5BCD6]/85 font-sans font-light flex flex-col justify-between py-16 px-6 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-[#F5EFC8]/[0.015] blur-[120px] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />

      <div className="max-w-[750px] w-full mx-auto space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ganesha.png"
              alt="Ganesha Emblem"
              className="w-[60px] sm:w-[75px] h-auto object-contain drop-shadow-[0_0_12px_rgba(245,239,200,0.1)] opacity-[0.8]"
            />
          </Link>
          <div className="space-y-1.5 mt-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A5BCD6]/55">UGAMA AARAMBHA 2K26</p>
            <h1 className="text-3xl sm:text-4xl font-serif italic text-transparent-yellow">
              Terms & Conditions
            </h1>
            <p className="text-[10px] text-white/40 tracking-wider">
              RULES AND GUIDELINES FOR ATTENDEES
            </p>
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/35 to-transparent mx-auto mt-4" />
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/40 backdrop-blur-lg p-6 sm:p-10 space-y-8 shadow-2xl leading-relaxed text-sm select-text">
          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing this digital invitation website and registering your RSVP for **UGAMA AARAMBHA 2K26** (the Joint Installation Ceremony of the Rotaract Club of Swarna Bengaluru and the Rotaract Club of Bengaluru Nava Chaitanya), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              2. Registration Eligibility & Information Accuracy
            </h2>
            <p>
              When registering your RSVP, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate, current, and complete details (Name, Club name, and Email).</li>
              <li>Only register under your own name or with the explicit consent of the person whose details you are entering.</li>
              <li>Acknowledge that false registrations or identity misrepresentations may result in the immediate cancellation of your reservation and QR code access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              3. Admission & Ticket Scanning
            </h2>
            <p>
              Admission to the venue on July 12, 2026, is subject to the following rules:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must present your digital ticket QR code or show your unique 12-digit Reference Number (`UGA-XXXX-XXXX`) at the reception desk for verification.</li>
              <li>Each QR code represents one registration and can only be scanned **once** for admission. Duplicate or copied codes will be flagged as invalid.</li>
              <li>The Organizers reserve the right to verify your identity at the entry gate against a government-issued ID card or Rotaract membership ID if necessary.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              4. Code of Conduct & Dress Code
            </h2>
            <p>
              To ensure a premium and respectful experience for all distinguished guests:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The official dress code for the installation is strictly **Ethnic Wear**. Attendees are requested to dress appropriately.</li>
              <li>All guests are expected to maintain professional decorum, respect the speakers, host clubs, and fellow attendees, and comply with the venue&apos;s rules.</li>
              <li>The Organizers reserve the absolute right to refuse entry or escort any individual out of the venue in case of safety violations, intoxication, harassment, or disruption.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              5. Event Scheduling & Cancellations
            </h2>
            <p>
              While the agenda is finalized, the host clubs reserve the right to make modifications to the event schedule, program timeline, or guest speakers in the event of unforeseen situations or emergencies.
            </p>
            <p>
              In the unlikely event of postponement or cancellation of the ceremony, the Organizers will send update alerts to all guests who provided email addresses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              6. Limitation of Liability
            </h2>
            <p>
              The Organizers and host clubs shall not be held liable for any personal injury, loss or damage to personal property, or travel delays incurred by attendees while travelling to or participating in the event.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              7. Contact Information
            </h2>
            <p>
              If you have any queries regarding these terms or your registration status, please contact the host organizing committee:
            </p>
            <p className="font-mono text-xs text-[#F5EFC8] mt-1">
              Email: rota.rcsb@gmail.com
            </p>
          </section>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border border-[#F5EFC8]/30 bg-transparent text-[#F5EFC8] font-sans text-xs uppercase tracking-widest hover:bg-[#F5EFC8]/5 transition-all cursor-pointer"
            >
              Back to Invitation
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-16 text-center">
        <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#A5BCD6]/25 font-light">
          Rotaract Club of Swarna Bengaluru · Rotaract Club of Bengaluru Nava Chaitanya
        </p>
      </div>
    </div>
  );
}
