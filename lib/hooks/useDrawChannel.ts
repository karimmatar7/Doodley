"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type StrokePoint = {
  x: number;
  y: number;
  color: string;
  size: number;
  type: "start" | "move" | "end";
};

export function useDrawChannel(roundId: string, onRemotePoint: (point: StrokePoint) => void) {
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const bufferRef = useRef<StrokePoint[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const channel = supabase.channel(`draw-${roundId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "stroke" }, ({ payload }) => onRemotePoint(payload as StrokePoint))
      .subscribe();

    channelRef.current = channel;

    flushTimerRef.current = setInterval(async () => {
      if (bufferRef.current.length === 0) return;
      const toSave = bufferRef.current;
      bufferRef.current = [];
      await supabase.from("strokes").insert(toSave.map((p) => ({ round_id: roundId, payload: p })));
    }, 400);

    return () => {
      channel.unsubscribe();
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    };
  }, [roundId, onRemotePoint, supabase]);

  const sendPoint = useCallback((point: StrokePoint) => {
    channelRef.current?.send({ type: "broadcast", event: "stroke", payload: point });
    bufferRef.current.push(point);
  }, []);

  const loadExistingStrokes = useCallback(async () => {
    const { data } = await supabase
      .from("strokes")
      .select("payload")
      .eq("round_id", roundId)
      .order("created_at", { ascending: true });
    return (data ?? []).map((row: any) => row.payload as StrokePoint);
  }, [roundId, supabase]);

  return { sendPoint, loadExistingStrokes };
}