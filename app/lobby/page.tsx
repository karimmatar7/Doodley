"use client";

import {
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { generateRoomCode } from "@/lib/utils/roomCode";
import { getRoomCodeFromQr } from "@/lib/utils/roomQr";

import { useProfile } from "@/lib/hooks/useProfile";
import {
  useFriends,
  type FriendRow,
} from "@/lib/hooks/useFriends";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DoodleyLogo from "@/components/DoodleyLogo";
import TopBar from "@/components/layout/TopBar";
import DirectMessagePanel from "@/components/friends/DirectMessagePanel";
import QrScannerModal from "@/components/room/QrScannerModal";

export default function LobbyEntryPage() {
  const router = useRouter();
  const supabase = createClient();

  const { profile } = useProfile();

  const {
    friends,
    incoming,
    acceptRequest,
    declineRequest,
    unfriendRequest,
    sendRequestByTag,
  } = useFriends(profile?.id ?? null);

  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeChat, setActiveChat] =
    useState<FriendRow | null>(null);
  const [pendingUnfriend, setPendingUnfriend] =
    useState<FriendRow | null>(null);

  async function handleCreateRoom() {
    if (!profile || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    const code = generateRoomCode();

    const {
      data: room,
      error: roomError,
    } = await supabase
      .from("rooms")
      .insert({
        code,
        host_id: profile.id,
      })
      .select()
      .single();

    if (roomError || !room) {
      setError(
        roomError?.message ??
          "Could not create room."
      );
      setLoading(false);
      return;
    }

    const { error: playerError } =
      await supabase.from("players").insert({
        room_id: room.id,
        profile_id: profile.id,
      });

    if (playerError) {
      setError(playerError.message);
      setLoading(false);
      return;
    }

    router.push(`/room/${room.code}`);
  }

  async function joinRoom(code: string) {
    if (!profile || loading) {
      return;
    }

    const normalizedCode = code.trim().toUpperCase();

    if (!/^[A-Z0-9]{5}$/.test(normalizedCode)) {
      setError(
        "Enter a valid 5-character room code."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const {
      data: room,
      error: roomError,
    } = await supabase
      .from("rooms")
      .select("id, code, status")
      .eq("code", normalizedCode)
      .single();

    if (roomError || !room) {
      setError(
        "Room not found. Check the code and try again."
      );
      setLoading(false);
      return;
    }

    if (room.status !== "lobby") {
      setError("This game has already started.");
      setLoading(false);
      return;
    }

   const { error: playerError } =
  await supabase
    .from("players")
    .upsert(
      {
        room_id: room.id,
        profile_id: profile.id,
        left_at: null,
        has_drawn: false,
        score: 0,
        rematch_ready: false,
      },
      {
        onConflict: "room_id,profile_id",
      }
    );

    if (playerError) {
      setError(playerError.message);
      setLoading(false);
      return;
    }

    router.push(`/room/${room.code}`);
  }

  async function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await joinRoom(joinCode);
  }

  async function handleQrScan(value: string) {
    const scannedCode = getRoomCodeFromQr(value);

    if (!scannedCode) {
      setError(
        "This QR code is not a valid Doodley room."
      );
      setScannerOpen(false);
      return;
    }

    setScannerOpen(false);
    setJoinCode(scannedCode);

    await joinRoom(scannedCode);
  }

  async function confirmUnfriend() {
    if (!pendingUnfriend) {
      return;
    }

    try {
      await unfriendRequest(pendingUnfriend.id);
      setPendingUnfriend(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not unfriend. Please try again.";

      setError(message);
      setPendingUnfriend(null);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 bg-grid px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      <TopBar
        friends={friends}
        incoming={incoming}
        onAccept={acceptRequest}
        onDecline={declineRequest}
        onMessage={setActiveChat}
        onUnfriend={(id) =>
          setPendingUnfriend(
            friends.find(
              (friend) => friend.id === id
            ) ?? null
          )
        }
        onAddFriend={sendRequestByTag}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 sm:max-w-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <DoodleyLogo size="text-5xl sm:text-6xl" />

          <p className="max-w-xs text-sm text-slate-400 sm:text-base">
            Draw, guess, and score points in real time
            with friends.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Button
            type="button"
            onClick={handleCreateRoom}
            disabled={loading || !profile}
          >
            {loading ? "Loading..." : "Create a room"}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs uppercase tracking-widest text-slate-500">
              or
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form
            onSubmit={handleJoinRoom}
            className="flex flex-col gap-4"
          >
            <Input
              label="Room code"
              required
              value={joinCode}
              onChange={setJoinCode}
              maxLength={5}
              variant="code"
            />

            <button
              type="button"
              onClick={() => {
                setError(null);
                setScannerOpen(true);
              }}
              disabled={loading || !profile}
              className="flex min-h-11 w-full items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Scan QR code
            </button>

            <ErrorMessage message={error} />

            <Button
              type="submit"
              variant="secondary"
              disabled={loading || !profile}
            >
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

      {scannerOpen && (
        <QrScannerModal
          onClose={() => setScannerOpen(false)}
          onScan={handleQrScan}
        />
      )}
    </main>
  );
}