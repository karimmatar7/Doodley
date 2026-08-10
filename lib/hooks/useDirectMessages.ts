"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
};

export function useDirectMessages(myProfileId: string | null, otherProfileId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!myProfileId || !otherProfileId) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${myProfileId},receiver_id.eq.${otherProfileId}),and(sender_id.eq.${otherProfileId},receiver_id.eq.${myProfileId})`
      )
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
  }, [myProfileId, otherProfileId, supabase]);

  useEffect(() => {
    if (!myProfileId || !otherProfileId) return;
    setMessages([]);

    async function setup() {
      await fetchMessages();

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`dm-${[myProfileId, otherProfileId].sort().join("-")}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => fetchMessages())
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
  }, [myProfileId, otherProfileId, fetchMessages, supabase]);

  async function sendMessage(text: string) {
    if (!myProfileId || !otherProfileId || !text.trim()) return;
    await supabase.from("messages").insert({ sender_id: myProfileId, receiver_id: otherProfileId, text: text.trim() });
  }

  return { messages, sendMessage };
}