"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type RoomEvent = {
  id: number;
  room_id: string;
  message: string;
  created_at: string;
};

export function useRoomEvents(roomId: string | null) {
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!roomId) return;
    const { data } = await supabase
      .from("room_events")
      .select("id, room_id, message, created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    setEvents(data ?? []);
  }, [roomId, supabase]);

  useEffect(() => {
    if (!roomId) return;
    setEvents([]);

    async function setup() {
      await fetchEvents();

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`room-events-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "room_events",
            filter: `room_id=eq.${roomId}`,
          },
          () => fetchEvents()
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
  }, [roomId, fetchEvents, supabase]);

  return { events };
}