import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Server-side Supabase client (service role or fallback to anon) ───────────
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// ─── Input Validation ─────────────────────────────────────────────────────────
interface ScoreRequestBody {
  player_id: string;
  full_name: string;
  club_name: string;
  completion_time: number;
  moves: number;
}

function validateBody(body: unknown): { valid: true; data: ScoreRequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }

  const { player_id, full_name, club_name, completion_time, moves } = body as Record<string, unknown>;

  if (typeof player_id !== "string" || !player_id.trim()) {
    return { valid: false, error: "Player ID is required." };
  }
  if (typeof full_name !== "string" || !full_name.trim()) {
    return { valid: false, error: "Full name is required." };
  }
  if (typeof club_name !== "string" || !club_name.trim()) {
    return { valid: false, error: "Club name is required." };
  }
  if (typeof completion_time !== "number" || isNaN(completion_time) || completion_time <= 0) {
    return { valid: false, error: "Completion time must be a valid positive number." };
  }
  if (typeof moves !== "number" || isNaN(moves) || !Number.isInteger(moves) || moves <= 0) {
    return { valid: false, error: "Moves must be a valid positive integer." };
  }

  // Anti-cheat checks:
  // 1. Min theoretical moves for 4x4 matching is 8 moves (matching 8 pairs perfectly in 8 turns).
  if (moves < 8) {
    return { valid: false, error: "Suspicious moves count. Anti-cheat check failed." };
  }
  // 2. Min physical time for matching 16 cards is ~4.0 seconds (250ms per flip/match).
  if (completion_time < 4.0) {
    return { valid: false, error: "Suspicious completion time. Anti-cheat check failed." };
  }

  return {
    valid: true,
    data: {
      player_id: player_id.trim(),
      full_name: full_name.trim(),
      club_name: club_name.trim(),
      completion_time,
      moves,
    },
  };
}

// ─── POST /api/quest/score ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. Parse body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
    }

    // 2. Validate input
    const validation = validateBody(rawBody);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 422 });
    }

    const { player_id, full_name, club_name, completion_time, moves } = validation.data;

    // 3. Connect to Supabase
    const supabase = getServerSupabase();

    // 4. Calculate score
    // Higher score for faster completion and fewer moves.
    // Base of 1,000,000 divided by weighted duration and moves.
    const score = Math.max(1, Math.round(1000000 / (completion_time + moves * 0.2)));

    // 5. Query for existing record
    const { data: existing, error: fetchError } = await supabase
      .from("memory_game_scores")
      .select("*")
      .eq("player_id", player_id)
      .maybeSingle();

    if (fetchError) {
      console.error("[Quest Score] Fetch error:", fetchError.message);
      return NextResponse.json({ success: false, error: "Database error retrieving player record." }, { status: 500 });
    }

    let isNewBest = false;
    let savedRecord = existing;

    if (existing) {
      // Compare performances: Primary: Time (Ascending), Secondary: Moves (Ascending)
      const isNewBetter =
        completion_time < existing.completion_time ||
        (completion_time === existing.completion_time && moves < existing.moves);

      if (isNewBetter) {
        // Update the record with the new personal best
        const { data: updated, error: updateError } = await supabase
          .from("memory_game_scores")
          .update({
            full_name,
            club_name,
            completion_time,
            moves,
            score,
            created_at: new Date().toISOString(),
          })
          .eq("player_id", player_id)
          .select()
          .single();

        if (updateError) {
          console.error("[Quest Score] Update error:", updateError.message);
          return NextResponse.json({ success: false, error: "Database error updating score." }, { status: 500 });
        }

        savedRecord = updated;
        isNewBest = true;
      }
    } else {
      // First time play: insert new record
      const { data: inserted, error: insertError } = await supabase
        .from("memory_game_scores")
        .insert([
          {
            player_id,
            full_name,
            club_name,
            completion_time,
            moves,
            score,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("[Quest Score] Insert error:", insertError.message);
        return NextResponse.json({ success: false, error: "Database error saving score." }, { status: 500 });
      }

      savedRecord = inserted;
      isNewBest = true;
    }

    // 6. Calculate global rank for the player (number of players with a strictly better record + 1)
    const recordTime = savedRecord.completion_time;
    const recordMoves = savedRecord.moves;

    const { count: betterCount, error: rankError } = await supabase
      .from("memory_game_scores")
      .select("*", { count: "exact", head: true })
      .or(`completion_time.lt.${recordTime},and(completion_time.eq.${recordTime},moves.lt.${recordMoves})`);

    if (rankError) {
      console.error("[Quest Score] Rank calculation error:", rankError.message);
    }

    const rank = rankError ? null : (betterCount ?? 0) + 1;

    return NextResponse.json(
      {
        success: true,
        isNewBest,
        score: savedRecord.score,
        completion_time: savedRecord.completion_time,
        moves: savedRecord.moves,
        rank,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Quest Score] Unexpected server error:", err);
    return NextResponse.json({ success: false, error: "An unexpected server error occurred." }, { status: 500 });
  }
}
