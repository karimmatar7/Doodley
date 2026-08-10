"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type Guess = {
  id: number;
  player_id: string;
  text: string;
  is_correct: boolean;
  points_awarded: number;
};

export function useGuesses(roundId: string | null) {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchGuesses = useCallback(async () => {
    if (!roundId) return;
    const { data } = await supabase
      .from("guesses")
      .select("id, player_id, text, is_correct, points_awarded")
      .eq("round_id", roundId)
      .order("guessed_at", { ascending: true });
    setGuesses(data ?? []);
  }, [roundId, supabase]);

  useEffect(() => {
    if (!roundId) return;
    setGuesses([]);

    async function setup() {
      await fetchGuesses();

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`guesses-${roundId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "guesses", filter: `round_id=eq.${roundId}` },
          () => fetchGuesses()
        )
        .subscribe();

      channelRef.current = channel;
    }

    setup();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roundId, fetchGuesses, supabase]);

  return { guesses };
}