"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type FriendRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted";
  display_name: string;
  discriminator: string;
  other_profile_id: string;
};

type UseFriendsResult = {
  friends: FriendRow[];
  incoming: FriendRow[];
  outgoing: FriendRow[];
  sendRequest: (addresseeId: string) => Promise<void>;
  acceptRequest: (friendRowId: string) => Promise<void>;
  declineRequest: (friendRowId: string) => Promise<void>;
  unfriendRequest: (friendRowId: string) => Promise<void>;
  statusWith: (otherProfileId: string) => "none" | "pending" | "friends";
};

export function useFriends(myProfileId: string | null): UseFriendsResult {
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [incoming, setIncoming] = useState<FriendRow[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRow[]>([]);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const load = useCallback(async () => {
    if (!myProfileId) return;
    const { data } = await supabase
      .from("friends")
      .select(
        "id, requester_id, addressee_id, status, requester:profiles!friends_requester_id_fkey(display_name, discriminator), addressee:profiles!friends_addressee_id_fkey(display_name, discriminator)"
      )
      .or(`requester_id.eq.${myProfileId},addressee_id.eq.${myProfileId}`);

    const rows: FriendRow[] = (data ?? []).map((r: any) => {
      const isMeRequester = r.requester_id === myProfileId;
      const other = isMeRequester ? r.addressee : r.requester;
      return {
        id: r.id,
        requester_id: r.requester_id,
        addressee_id: r.addressee_id,
        status: r.status,
        display_name: other?.display_name ?? "Player",
        discriminator: other?.discriminator ?? "0000",
        other_profile_id: isMeRequester ? r.addressee_id : r.requester_id,
      };
    });

    setFriends(rows.filter((r) => r.status === "accepted"));
    setIncoming(rows.filter((r) => r.status === "pending" && r.addressee_id === myProfileId));
    setOutgoing(rows.filter((r) => r.status === "pending" && r.requester_id === myProfileId));
  }, [myProfileId, supabase]);

  useEffect(() => {
    if (!myProfileId) return;

    async function setup() {
      await load();

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`friends-${myProfileId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "friends" }, () => load())
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
  }, [myProfileId, load, supabase]);

  const sendRequest = useCallback(
    async (addresseeId: string) => {
      if (!myProfileId) return;
      await supabase.from("friends").insert({ requester_id: myProfileId, addressee_id: addresseeId });
      await load();
    },
    [myProfileId, supabase, load]
  );

  const acceptRequest = useCallback(
    async (friendRowId: string) => {
      await supabase.from("friends").update({ status: "accepted" }).eq("id", friendRowId);
      await load();
    },
    [supabase, load]
  );

  const declineRequest = useCallback(
    async (friendRowId: string) => {
      await supabase.from("friends").delete().eq("id", friendRowId);
      await load();
    },
    [supabase, load]
  );

  const unfriendRequest = useCallback(
    async (friendRowId: string) => {
      const { error, count } = await supabase
        .from("friends")
        .delete({ count: "exact" })
        .eq("id", friendRowId);

      if (error) throw error;
      if (count === 0) throw new Error("Unfriend failed — you may not have permission to remove this friend.");

      await load();
    },
    [supabase, load]
  );

  const statusWith = useCallback(
    (otherProfileId: string): "none" | "pending" | "friends" => {
      const match = [...friends, ...incoming, ...outgoing].find(
        (f) => f.requester_id === otherProfileId || f.addressee_id === otherProfileId
      );
      if (!match) return "none";
      return match.status === "accepted" ? "friends" : "pending";
    },
    [friends, incoming, outgoing]
  );

   return { friends, incoming, outgoing, sendRequest, acceptRequest, declineRequest, unfriendRequest, statusWith };
}