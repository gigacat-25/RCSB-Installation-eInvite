import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEventEmail } from "@/lib/mailer";

// ─── Supabase server client ───────────────────────────────────────────────────

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing.");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ─── POST /api/admin/check-in ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Verify Clerk session
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Double check user email permissions
  const user = await currentUser();
  const userEmails = user?.emailAddresses.map(e => e.emailAddress.toLowerCase()) ?? [];
  
  const allowedAdminEnv = process.env.ALLOWED_ADMIN_EMAILS;
  const allowedEmails = allowedAdminEnv 
    ? allowedAdminEnv.split(",").map(e => e.trim().toLowerCase())
    : ["thejaswinps@gmail.com"];

  const hasAccess = userEmails.some(email => allowedEmails.includes(email));
  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden: Access Denied" }, { status: 403 });
  }

  // 3. Parse and validate body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const { reference } = rawBody as { reference?: string };
  if (!reference || typeof reference !== "string" || !reference.trim()) {
    return NextResponse.json({ success: false, error: "Reference number is required." }, { status: 422 });
  }

  const formattedRef = reference.trim().toUpperCase();

  try {
    const supabase = getServerSupabase();

    // 4. Fetch guest record
    const { data: guest, error: fetchError } = await supabase
      .from("rsvps")
      .select("reference_number, full_name, club_name, designation, email, status, checked_in_at")
      .eq("reference_number", formattedRef)
      .single();

    if (fetchError || !guest) {
      console.error("[Check-in] Guest fetch error:", fetchError?.message ?? "Not found");
      return NextResponse.json(
        { success: false, error: "No RSVP record found for this reference number." },
        { status: 404 }
      );
    }

    // 5. Check if already checked in
    if (guest.checked_in_at) {
      return NextResponse.json(
        {
          success: true,
          alreadyCheckedIn: true,
          guest: {
            fullName: guest.full_name,
            clubName: guest.club_name,
            designation: guest.designation,
            email: guest.email,
            checkedInAt: guest.checked_in_at,
          },
        },
        { status: 200 }
      );
    }

    // 6. Update checked_in_at in database
    const nowISO = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("rsvps")
      .update({ checked_in_at: nowISO })
      .eq("reference_number", formattedRef);

    if (updateError) {
      console.error("[Check-in] Supabase update error:", updateError.message);
      return NextResponse.json(
        { success: false, error: "Failed to update check-in status. Please try again." },
        { status: 500 }
      );
    }

    // 7. Fire-and-forget: Send Welcome & Event Flow email (if email was provided)
    if (guest.email) {
      sendWelcomeEventEmail({
        toEmail: guest.email,
        fullName: guest.full_name,
      }).catch((err) => {
        console.error("[Check-in] Welcome email send error:", err?.message ?? err);
      });
    }

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        alreadyCheckedIn: false,
        guest: {
          fullName: guest.full_name,
          clubName: guest.club_name,
          designation: guest.designation,
          email: guest.email,
          checkedInAt: nowISO,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Check-in] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
