"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateRoomCode } from "@/lib/utils/roomCode";
import { useProfile } from "@/lib/hooks/useProfile";
import { useFriends, FriendRow } from "@/lib/hooks/useFriends";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DoodleyLogo from "@/components/DoodleyLogo";
import TopBar from "@/components/layout/TopBar";
import DirectMessagePanel from "@/components/friends/DirectMessagePanel";

export default function LobbyEntryPage() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<FriendRow | null>(null);
  const [pendingUnfriend, setPendingUnfriend] = useState<FriendRow | null>(null);
  const { profile } = useProfile();
const {
  friends,
  incoming,
  acceptRequest,
  declineRequest,
  unfriendRequest,
  sendRequestByTag,
} = useFriends(profile?.id ?? null);
  const router = useRouter();
  const supabase = createClient();

  async function handleCreateRoom() {
    if (!profile) return;
    setLoading(true);
    setError(null);

    const code = generateRoomCode();
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ code, host_id: profile.id })
      .select()
      .single();

    if (roomError || !room) {
      setError(roomError?.message ?? "Could not create room.");
      setLoading(false);
      return;
    }

    await supabase.from("players").insert({ room_id: room.id, profile_id: profile.id });
    router.push(`/room/${room.code}`);
  }

  async function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    setError(null);

    const normalizedCode = joinCode.trim().toUpperCase();
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, code, status")
      .eq("code", normalizedCode)
      .single();

    if (roomError || !room) {
      setError("Room not found. Check the code and try again.");
      setLoading(false);
      return;
    }

    if (room.status !== "lobby") {
      setError("This game has already started.");
      setLoading(false);
      return;
    }

    await supabase
      .from("players")
      .upsert({ room_id: room.id, profile_id: profile.id }, { onConflict: "room_id,profile_id" });

    router.push(`/room/${room.code}`);
  }

  async function confirmUnfriend() {
    if (!pendingUnfriend) return;
    try {
      await unfriendRequest(pendingUnfriend.id);
      setPendingUnfriend(null);
    } catch (err: any) {
      setError(err.message ?? "Could not unfriend. Please try again.");
      setPendingUnfriend(null);
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-950 bg-grid flex flex-col items-center justify-center px-4 sm:px-6 py-10 gap-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

   <TopBar
  friends={friends}
  incoming={incoming}
  onAccept={acceptRequest}
  onDecline={declineRequest}
  onMessage={setActiveChat}
  onUnfriend={(id) =>
    setPendingUnfriend(friends.find((friend) => friend.id === id) ?? null)
  }
  onAddFriend={sendRequestByTag}
/>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <DoodleyLogo size="text-5xl sm:text-6xl" />
          <p className="text-slate-400 text-sm sm:text-base max-w-xs">
            Draw, guess, and score points in real time with friends.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <Button onClick={handleCreateRoom} disabled={loading || !profile}>
            {loading ? "Loading..." : "Create a room"}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <Input label="Room code" required value={joinCode} onChange={setJoinCode} maxLength={5} variant="code" />
            <ErrorMessage message={error} />
            <Button type="submit" variant="secondary" disabled={loading || !profile}>
              {loading ? "Loading..." : "Join room"}
            </Button>
          </form>
        </div>
      </div>

      {activeChat && profile && (
        <DirectMessagePanel
          myProfileId={profile.id}
          otherProfileId={activeChat.other_profile_id}
          otherDisplayName={activeChat.display_name}
          otherDiscriminator={activeChat.discriminator}
          onClose={() => setActiveChat(null)}
        />
      )}

      {pendingUnfriend && (
        <ConfirmModal
          title={`Unfriend ${pendingUnfriend.display_name}#${pendingUnfriend.discriminator}?`}
          message="They will lose you as a friend too, and you'll both disappear from each other's friends list."
          confirmLabel="Unfriend"
          cancelLabel="Cancel"
          onConfirm={confirmUnfriend}
          onCancel={() => setPendingUnfriend(null)}
        />
      )}
    </main>
  );
}