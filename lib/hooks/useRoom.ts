"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type Room = {
  id: string;
  code: string;
  status: "lobby" | "choosing_word" | "drawing" | "round_end" | "game_end";
  host_id: string;
  max_rounds: number;
  current_round: number;
  round_duration_seconds: number;
};

export function useRoom(code: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (error || !data) {
      setError("Room not found.");
      setLoading(false);
      return;
    }

    setRoom(data);
    setLoading(false);

    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`room-${data.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${data.id}` },
        (payload) => setRoom(payload.new as Room)
      )
      .subscribe();

    channelRef.current = channel;
  }, [code, supabase]);

  useEffect(() => {
    load();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [load, supabase]);

  return { room, loading, error };
}