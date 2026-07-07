"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
              Privacy Notice
            </h1>
            <p className="text-[10px] text-white/40 tracking-wider">
              IN COMPLIANCE WITH THE DPDP ACT, 2023
            </p>
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/35 to-transparent mx-auto mt-4" />
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/40 backdrop-blur-lg p-6 sm:p-10 space-y-8 shadow-2xl leading-relaxed text-sm select-text">
          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              1. Notice of Data Collection (Section 5)
            </h2>
            <p>
              This Privacy Notice is issued by the joint Data Fiduciaries, **Rotaract Club of Swarna Bengaluru** and **Rotaract Club of Bengaluru Nava Chaitanya** (herein referred to as &ldquo;the Organizers&rdquo;), under Section 5 of the **Digital Personal Data Protection (DPDP) Act, 2023** of India. 
            </p>
            <p>
              By submitting your RSVP on this website, you provide your free, specific, informed, unconditional, and unambiguous consent to the processing of your personal data for the purposes described below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              2. Personal Data We Collect
            </h2>
            <p>
              We collect the following personal data points during the RSVP registration process:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white font-normal">Full Name:</span> To identify you as a registered guest.
              </li>
              <li>
                <span className="text-white font-normal">Club Name:</span> To verify your Rotaract or Rotary club affiliation.
              </li>
              <li>
                <span className="text-white font-normal">Designation (Optional):</span> To recognize your leadership position or role within the movement.
              </li>
              <li>
                <span className="text-white font-normal">Email Address (Optional):</span> To deliver your digital reference ticket, venue details, check-in QR code, and event itinerary.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              3. Purpose of Processing
            </h2>
            <p>
              Your data is processed solely for the following specified, lawful purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generating a secure, unique reference code to validate your invitation.</li>
              <li>Creating a digital QR code for automated entry and check-in confirmation at the venue.</li>
              <li>Sending confirmation and welcome emails containing the event itinerary and digital ticket.</li>
              <li>Managing event attendance logs to coordinate seating, security, and food logistics at the venue.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              4. Data Fiduciary, Storage & Security
            </h2>
            <p>
              The joint Data Fiduciaries are **Rotaract Club of Swarna Bengaluru** and **Rotaract Club of Bengaluru Nava Chaitanya**.
            </p>
            <p>
              All personal data is stored securely in our cloud database (Supabase), protected by access control policies. We do not sell, rent, or share your personal data with any third-party advertisers, companies, or partners. Access is restricted strictly to authorized event coordinators on a need-to-know basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              5. Data Retention & Erasure
            </h2>
            <p>
              In accordance with DPDP compliance, we do not retain data longer than necessary to fulfill the purpose of collection. All personal details, registration files, and QR logs will be **permanently and securely erased** from our servers within **30 days** following the conclusion of the event (on or before August 12, 2026).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              6. Your Rights (Data Principal Rights)
            </h2>
            <p>
              Under the DPDP Act, you are the &ldquo;Data Principal&rdquo; and have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-white font-normal">Withdraw Consent:</span> You can withdraw your consent at any time by contacting us. Upon withdrawal, your data will be immediately deleted, and your digital ticket deactivated.</li>
              <li><span className="text-white font-normal">Access & Correction:</span> You may request summary access to your registered data or request corrections of any inaccuracies.</li>
              <li><span className="text-white font-normal">Grievance Redressal:</span> You have the right to file a grievance with our designated Grievance Officer regarding any data processing concern.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif italic text-transparent-yellow uppercase tracking-wider">
              7. Grievance Officer Details
            </h2>
            <p>
              If you have any questions, wish to exercise your rights, or file a complaint, please contact our Grievance Officer directly:
            </p>
            <div className="p-5 rounded-xl bg-black/30 border border-[#F5EFC8]/10 font-mono text-xs text-[#F5EFC8] space-y-1">
              <p className="font-sans uppercase text-[9px] tracking-widest text-[#A5BCD6]/60 mb-2">Designated Grievance Contact</p>
              <p>Officer: Rtr. Ganesh Prabhu (Secretary 2026-27)</p>
              <p>Email: rota.rcsb@gmail.com</p>
              <p>Hosts: Rotaract Club of Swarna Bengaluru & Rotaract Club of Bengaluru Nava Chaitanya</p>
            </div>
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
