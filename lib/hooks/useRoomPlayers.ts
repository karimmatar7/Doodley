"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type RoomPlayer = {
  id: string;
  profile_id: string;
  score: number;
  has_drawn: boolean;
  display_name: string;
  discriminator: string;
};

export function useRoomPlayers(roomId: string | null) {
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchPlayers = useCallback(async () => {
    if (!roomId) return;
    const { data } = await supabase
      .from("players")
      .select("id, profile_id, score, has_drawn, profiles(display_name, discriminator)")
      .eq("room_id", roomId)
      .order("joined_at", { ascending: true });

    const mapped = (data ?? []).map((p: any) => ({
      id: p.id,
      profile_id: p.profile_id,
      score: p.score,
      has_drawn: p.has_drawn,
      display_name: p.profiles?.display_name ?? "Player",
      discriminator: p.profiles?.discriminator ?? "0000",
    }));

    setPlayers(mapped);
    setLoading(false);
  }, [roomId, supabase]);

  useEffect(() => {
    if (!roomId) return;

    async function setup() {
      await fetchPlayers();

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`players-${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomId}` },
          () => fetchPlayers()
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
  }, [roomId, fetchPlayers, supabase]);

  return { players, loading };
}