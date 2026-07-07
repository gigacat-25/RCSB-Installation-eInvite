/**
 * UGAMA AARAMBHA — Event Constants
 * Single source of truth for all event-related content.
 * Edit here; every component reads from this file.
 */

// ─── Event Metadata ───────────────────────────────────────────────────────────

export const EVENT = {
  title: "UGAMA AARAMBHA",
  tagline: "A New Chapter Begins",
  fullTitle: "Joint Installation Ceremony",
  edition: "13th Installation Ceremony",
  rotaryYear: "2025–26",
  date: "Sunday, 12th July",
  dateISO: "2026-07-12",
  time: "6:00 PM onwards",
  venue: "Rotary House of Friendship",
  venueShort: "Rotary House of Friendship",
  dressCode: "Traditionals",
  district: "District 3192",
} as const;

// ─── Host Clubs ───────────────────────────────────────────────────────────────

export const HOST_CLUBS = [
  "Rotaract Club of Swarna Bengaluru",
  "Rotaract Club of Nava Chaitanya",
] as const;

export const PRIMARY_CLUB = HOST_CLUBS[0];

// ─── Event Details Cards ──────────────────────────────────────────────────────

export const EVENT_DETAILS = [
  { label: "Date",       value: EVENT.date,      icon: "📅" },
  { label: "Time",       value: EVENT.time,       icon: "🕕" },
  { label: "Venue",      value: EVENT.venue,      icon: "📍" },
  { label: "Dress Code", value: EVENT.dressCode,  icon: "🥻" },
] as const;

// ─── Special Guests ───────────────────────────────────────────────────────────

export const GUESTS = [
  {
    role: "President of Rotary Club of Bangalore",
    name: "RTN Vineetha Chinappa",
    note: null,
  },
  {
    role: "Guest of Honor",
    name: "RTN Anju Agadi",
    note: "Youth Service Director \nRotary Club of Bangalore",
  },
] as const;

export const INDUCTION = {
  label: "Induction Ceremony",
  description: "New members will be inducted by\nDistrict Rotaract Representative 3192",
  inductorName: "PHF RTR.RTN Sanjay R.",
} as const;

// ─── Leadership ───────────────────────────────────────────────────────────────

export const LEADERSHIP = {
  incomingPresident: {
    role: "Incoming President",
    name: "RTR Vigneswaran",
  },
  outgoingPresident: {
    role: "Outgoing President",
    name: "RTR Dr. Harish",
  },
  secretary: {
    role: "Secretary",
    name: "RTR Ganesh Prabhu",
  },
} as const;

// ─── RSVP Contacts ────────────────────────────────────────────────────────────

export const RSVP_CONTACTS = [
  {
    name: "RTR Ganesh Prabhu",
    role: "Secretary",
    phone: "+91 97426 31254",
  },
  {
    name: "RTR Vigneswaran",
    role: "Incoming President",
    phone: "+91 80956 71203",
  },
] as const;

// ─── SEO / Meta ───────────────────────────────────────────────────────────────

export const META = {
  title: `UGAMA AARAMBHA | Rotaract Club of Swarna Bengaluru ${EVENT.edition}`,
  description:
    "A New Chapter Begins. Join us as we celebrate the installation of a new team, new ideas, and a new year of creating impact.",
  url: "https://invite.rcsb.org", // update to your actual domain
  ogImage: "/og-image.jpg",       // place a 1200×630 image in /public
} as const;

// ─── Email ────────────────────────────────────────────────────────────────────

export const EMAIL_CONFIG = {
  senderName: "UGAMA AARAMBHA — RCSB",
  senderAddress: process.env.NODEMAILER_FROM ?? "noreply@example.com",
  replyTo: "rcsb.swarnabengaluru@gmail.com",
} as const;

// ─── Event Flow Schedule ──────────────────────────────────────────────────────

export const EVENT_FLOW = [
  { time: "05:30 PM", activity: "Registrations & High Tea" },
  { time: "06:00 PM", activity: "Collar to Order & Dignitary Welcome" },
  { time: "06:15 PM", activity: "Secretarial Report & Outgoing Showcase" },
  { time: "06:35 PM", activity: "Installation of Incoming President" },
  { time: "07:00 PM", activity: "Induction of New Members" },
  { time: "07:20 PM", activity: "Keynote Address by DRR Sanjay R." },
  { time: "07:45 PM", activity: "Address by Chief Guest & Guest of Honor" },
  { time: "08:10 PM", activity: "Felicitations & Secretarial Announcements" },
  { time: "08:30 PM", activity: "Vote of Thanks & National Anthem" },
  { time: "08:45 PM", activity: "Fellowship & Dinner" },
] as const;

