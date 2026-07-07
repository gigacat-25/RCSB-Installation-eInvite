import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendConfirmationEmail } from "@/lib/mailer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RsvpBody {
  fullName: string;
  clubName: string;
  designation?: string;
  email?: string;
}

// ─── Server-side Supabase client (service role — bypasses RLS) ───────────────

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase server env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local"
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// ─── Reference Generator (server-side, crypto-secure) ────────────────────────

function generateReference(): string {
  const uuid = crypto.randomUUID().replace(/-/g, "").toUpperCase();
  return `UGA-${uuid.slice(0, 4)}-${uuid.slice(4, 8)}`;
}

// ─── Input Validation ─────────────────────────────────────────────────────────

function validate(body: unknown): { valid: true; data: RsvpBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }

  const { fullName, clubName, designation, email } = body as Record<string, unknown>;

  if (typeof fullName !== "string" || !fullName.trim()) {
    return { valid: false, error: "Full name is required." };
  }
  if (typeof clubName !== "string" || !clubName.trim()) {
    return { valid: false, error: "Club name is required." };
  }
  if (email && typeof email === "string" && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { valid: false, error: "Please enter a valid email address." };
    }
  }

  return {
    valid: true,
    data: {
      fullName: (fullName as string).trim(),
      clubName: (clubName as string).trim(),
      designation: typeof designation === "string" ? designation.trim() || undefined : undefined,
      email: typeof email === "string" && email.trim() ? email.trim() : undefined,
    },
  };
}

// ─── POST /api/rsvp ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Parse body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // 2. Validate input
  const validation = validate(rawBody);
  if (!validation.valid) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 422 });
  }

  const { fullName, clubName, designation, email } = validation.data;

  // 3. Generate a secure reference number
  const reference = generateReference();

  // 4. Insert into Supabase (required — failure returns error to user)
  try {
    const supabase = getServerSupabase();
    const { error: dbError } = await supabase.from("rsvps").insert([
      {
        full_name: fullName,
        club_name: clubName,
        designation: designation ?? null,
        email: email ?? null,
        dietary_preference: null,
        reference_number: reference,
        status: "confirmed",
      },
    ]);

    if (dbError) {
      console.error("[RSVP] Supabase insert error:", dbError.message);
      return NextResponse.json(
        { success: false, error: "Could not save your RSVP. Please try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[RSVP] Supabase unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Could not save your RSVP. Please try again." },
      { status: 500 }
    );
  }

  // 5. Fire-and-forget: Send confirmation email (only if email was provided)
  if (email) {
    sendConfirmationEmail({ toEmail: email, fullName, clubName, designation, reference }).catch(
      (err) => {
        console.error("[RSVP] Email send error:", err?.message ?? err);
      }
    );
  }

  // 6. Return success
  return NextResponse.json({ success: true, reference }, { status: 200 });
}
