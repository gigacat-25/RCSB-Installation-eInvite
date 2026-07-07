import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase server client ───────────────────────────────────────────────────

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing.");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ─── GET /api/admin/rsvps ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Verify Clerk session (middleware already guards this route,
  // but we double-check here for API safety)
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Double check user email (only allowed emails can fetch RSVPs)
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

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format"); // "csv" or undefined

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("rsvps")
      .select("reference_number, full_name, club_name, designation, email, status, created_at, checked_in_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin] Supabase fetch error:", error.message);
      return NextResponse.json({ error: "Failed to fetch RSVPs." }, { status: 500 });
    }

    // ── CSV Export ──────────────────────────────────────────────────────────
    if (format === "csv") {
      const headers = [
        "Reference",
        "Full Name",
        "Club Name",
        "Designation",
        "Email",
        "Status",
        "Registered At",
        "Checked In At",
      ];

      const escapeCell = (val: string | null | undefined): string => {
        const s = val ?? "";
        if (s.includes(",") || s.includes("\n") || s.includes('"')) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };

      const rows = (data ?? []).map((row) =>
        [
          escapeCell(row.reference_number),
          escapeCell(row.full_name),
          escapeCell(row.club_name),
          escapeCell(row.designation),
          escapeCell(row.email),
          escapeCell(row.status),
          escapeCell(
            row.created_at
              ? new Date(row.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
              : ""
          ),
          escapeCell(
            row.checked_in_at
              ? new Date(row.checked_in_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
              : "Pending"
          ),
        ].join(",")
      );

      const csv = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="ugama-aarambha-rsvps-${
            new Date().toISOString().slice(0, 10)
          }.csv"`,
        },
      });
    }

    // ── JSON response ───────────────────────────────────────────────────────
    return NextResponse.json({ success: true, data: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error("[Admin] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
