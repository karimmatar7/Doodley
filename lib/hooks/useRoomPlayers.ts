"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";

export type RoomPlayer = {
  id: string;
  room_id: string;
  profile_id: string;
  score: number;
  has_drawn: boolean;
  rematch_ready: boolean;
  joined_at: string;
  display_name: string;
  discriminator: string;
};

export function useRoomPlayers(roomId: string | null) {
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null
  );

  const fetchPlayers = useCallback(async () => {
    if (!roomId) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("players")
      .select(`
        id,
        room_id,
        profile_id,
        score,
        has_drawn,
        rematch_ready,
        joined_at,
        profiles (
          display_name,
          discriminator
        )
      `)
      .eq("room_id", roomId)
      .is("left_at", null)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("Could not load room players:", error);
      setPlayers([]);
      setLoading(false);
      return;
    }

    const mappedPlayers: RoomPlayer[] = (data ?? []).map(
      (player: any) => ({
        id: player.id,
        room_id: player.room_id,
        profile_id: player.profile_id,
        score: player.score ?? 0,
        has_drawn: player.has_drawn ?? false,
        rematch_ready: player.rematch_ready ?? false,
        joined_at: player.joined_at,
        display_name:
          player.profiles?.display_name ?? "Player",
        discriminator:
          player.profiles?.discriminator ?? "0000",
      })
    );

    setPlayers(mappedPlayers);
    setLoading(false);
  }, [roomId, supabase]);

  useEffect(() => {
    if (!roomId) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    let active = true;

    async function setup() {
      setLoading(true);

      await fetchPlayers();

      if (!active) {
        return;
      }

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`players-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "players",
            filter: `room_id=eq.${roomId}`,
          },
          () => {
            fetchPlayers();
          }
        )
        .subscribe();

      channelRef.current = channel;
    }

    setup();

    return () => {
      active = false;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, fetchPlayers, supabase]);

  return {
    players,
    loading,
  };
}