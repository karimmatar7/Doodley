"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type Round = {
  id: string;
  room_id: string;
  round_number: number;
  drawer_id: string;
  word: string | null;
  word_choices: string[] | null;
  theme: string | null;
  started_at: string | null;
  ends_at: string | null;
  status: "choosing_word" | "drawing" | "ended";
};

export function useRound(roomId: string | null) {
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchLatestRound = useCallback(async () => {
    if (!roomId) return;
    const { data } = await supabase
      .from("rounds")
      .select("*")
      .eq("room_id", roomId)
      .order("round_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    setRound(data ?? null);
    setLoading(false);
  }, [roomId, supabase]);

  useEffect(() => {
    if (!roomId) return;

    async function setup() {
      await fetchLatestRound();

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`rounds-${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rounds", filter: `room_id=eq.${roomId}` },
          () => fetchLatestRound()
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
  }, [roomId, fetchLatestRound, supabase]);

  return { round, loading };
}