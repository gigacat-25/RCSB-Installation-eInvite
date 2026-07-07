/**
 * UGAMA AARAMBHA — Event Constants
 * Single source of truth for all event-related content.
 * Edit here; every component reads from this file.
 */

// ─── Event Metadata ───────────────────────────────────────────────────────────

export const EVENT = {
  title: "UGAMA AARAMBHA 2K26",
  tagline: "A New Chapter Begins",
  fullTitle: "Joint Installation Ceremony",
  edition: "Joint Installation Ceremony",
  rotaryYear: "2026–27",
  date: "Sunday, 12th July 2026",
  dateISO: "2026-07-12",
  time: "6:00 PM",
  venue: "Rotary House of Friendship [RHF]",
  venueShort: "Rotary House of Friendship [RHF]",
  dressCode: "Ethnic",
  district: "District 3192",
} as const;

// ─── Host Clubs ───────────────────────────────────────────────────────────────

export const HOST_CLUBS = [
  "Rotaract Club of Swarna Bengaluru",
  "Rotaract Club of Bengaluru Nava Chaitanya",
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
    name: "Rtn. Vineetha Chinappa",
    note: null,
  },
  {
    role: "District Rotaract Committee Chair",
    name: "PDRR PHF Rtn. Naveen P Senna",
    note: "RI District 3192",
  },
  {
    role: "Guest of Honor",
    name: "Rtn. Anju Agadi",
    note: "Youth Service Director \nRotary Club of Bangalore",
  },
  {
    role: "Guest of Honor / Club Advisor",
    name: "Rtn. Meera Bai Shankar",
    note: "Club Advisor \nRotaract Club of Swarna Bengaluru",
  },
] as const;

export const INDUCTION = {
  label: "Induction Ceremony",
  description: "New members shall be inducted by\nDistrict Rotaract Representative | RI District 3192",
  inductorName: "PHF. Rtr.Rtn. Sanjay R",
} as const;

// ─── Leadership ───────────────────────────────────────────────────────────────

export const LEADERSHIP = {
  swarnaBengaluru: {
    clubName: "Rotaract Club of Swarna Bengaluru",
    outgoingPresident: {
      role: "Outgoing President",
      name: "Rtr. Dr.Harish",
    },
    incomingPresident: {
      role: "Incoming President",
      name: "Rtr. Vigneswaran",
    },
    outgoingSecretary: {
      role: "Outgoing Secretary",
      name: "Rtr. Rashmitha & Vigneswaran",
    },
    incomingSecretary: {
      role: "Incoming Secretary",
      name: "Rtr. Ganesh & Rtr. Prerana",
    },
  },
  navaChaitanya: {
    clubName: "Rotaract Club of Bengaluru Nava Chaitanya",
    outgoingPresident: {
      role: "Outgoing President",
      name: "Rtr. Srrivatsa",
    },
    incomingPresident: {
      role: "Incoming President",
      name: "Rtr. Srrivatsa",
    },
    outgoingSecretary: {
      role: "Outgoing Secretary",
      name: "Rtr. Disha & Rtr. Danish",
    },
    incomingSecretary: {
      role: "Incoming Secretary",
      name: "Rtr. Nayana",
    },
  },
} as const;

// ─── RSVP Contacts ────────────────────────────────────────────────────────────

export const RSVP_CONTACTS = [
  {
    name: "Rtr. Ganesh & Rtr. Prerana",
    role: "Incoming Secretary",
    phone: "+91 97426 31254",
  },
  {
    name: "Rtr. Vigneswaran",
    role: "Incoming President",
    phone: "+91 80956 71203",
  },
] as const;

// ─── SEO / Meta ───────────────────────────────────────────────────────────────

export const META = {
  title: `UGAMA AARAMBHA 2K26 | Joint Installation Ceremony`,
  description:
    "A New Chapter Begins. Join us as we celebrate the joint installation of Swarna Bengaluru and Bengaluru Nava Chaitanya presidents & office bearers.",
  url: "https://invite.rcsb.org", // update to your actual domain
  ogImage: "/og-image.jpg",       // place a 1200×630 image in /public
} as const;

// ─── Email ────────────────────────────────────────────────────────────────────

export const EMAIL_CONFIG = {
  senderName: "UGAMA AARAMBHA 2K26",
  senderAddress: process.env.NODEMAILER_FROM ?? "noreply@example.com",
  replyTo: "rcsb.swarnabengaluru@gmail.com",
} as const;

// ─── Event Flow Schedule ──────────────────────────────────────────────────────

export const EVENT_FLOW = [
  { time: "05:30 PM", activity: "Registrations & High Tea" },
  { time: "06:00 PM", activity: "Collar to Order & Dignitary Welcome" },
  { time: "06:15 PM", activity: "Secretarial Report & Outgoing Showcase" },
  { time: "06:35 PM", activity: "Installation of Incoming Presidents" },
  { time: "07:00 PM", activity: "Induction of New Members" },
  { time: "07:20 PM", activity: "Keynote Address by DRR Sanjay R." },
  { time: "07:45 PM", activity: "Address by Chief Guest & Guests of Honor" },
  { time: "08:10 PM", activity: "Felicitations & Secretarial Announcements" },
  { time: "08:30 PM", activity: "Vote of Thanks & National Anthem" },
  { time: "08:45 PM", activity: "Fellowship & Dinner" },
] as const;
