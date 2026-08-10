"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useProfile } from "@/lib/hooks/useProfile";
import { useRoom } from "@/lib/hooks/useRoom";
import { useRoomPlayers } from "@/lib/hooks/useRoomPlayers";
import { useFriends } from "@/lib/hooks/useFriends";
import { createClient } from "@/lib/supabase/client";

import LobbyScreen from "@/components/room/LobbyScreen";
import GameStatusMessage from "@/components/game/GameStatusMessage";
import CancelledRoomScreen from "@/components/room/CancelledRoomScreen";

export default function RoomView({
  code,
}: {
  code: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const {
    profile,
    loading: profileLoading,
  } = useProfile();

  const {
    room,
    loading: roomLoading,
    error: roomError,
  } = useRoom(code);

  const {
    players,
    loading: playersLoading,
  } = useRoomPlayers(room?.id ?? null);

  const {
    sendRequest,
    statusWith,
  } = useFriends(profile?.id ?? null);

  const [starting, setStarting] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!profileLoading && !profile) {
      router.replace("/login");
    }
  }, [profileLoading, profile, router]);

  useEffect(() => {
    if (!room) {
      return;
    }

    if (room.status === "cancelled") {
      return;
    }

    if (room.status !== "lobby") {
      router.replace(`/game/${room.code}`);
    }
  }, [room, router]);

  async function handleStartGame() {
    const currentRoom = room;

    if (!currentRoom || starting) {
      return;
    }

    setStarting(true);
    setLeaveError(null);

    const { error } = await supabase.rpc("start_game", {
      p_room_id: currentRoom.id,
    });

    if (error) {
      console.error("start_game failed:", error);
      setLeaveError(error.message);
      setStarting(false);
      return;
    }

    router.replace(`/game/${currentRoom.code}`);
  }

  async function handleCancel() {
    const currentRoom = room;

    if (!currentRoom) {
      router.replace("/lobby");
      return;
    }

    setLeaveError(null);

    const { error } = await supabase.rpc("leave_room", {
      p_room_id: currentRoom.id,
    });

    if (error) {
      console.error("leave_room failed:", error);
      setLeaveError(error.message);
      return;
    }

    router.replace("/lobby");
  }

  if (
    profileLoading ||
    roomLoading ||
    !profile
  ) {
    return (
      <GameStatusMessage>
        Loading...
      </GameStatusMessage>
    );
  }

  if (roomError || !room) {
    return (
      <GameStatusMessage>
        Room not found.
      </GameStatusMessage>
    );
  }

  /*
   * From this point onward, currentRoom is guaranteed
   * to be a non-null Room.
   */
  const currentRoom = room;

  if (currentRoom.status === "cancelled") {
    return (
      <CancelledRoomScreen
        onGoToLobby={() => router.replace("/lobby")}
      />
    );
  }

  const isHost =
    profile.id === currentRoom.host_id;

  const canStart =
    isHost && players.length >= 2;

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/room/${currentRoom.code}`
      : `/room/${currentRoom.code}`;

  return (
    <>
      <LobbyScreen
        roomCode={currentRoom.code}
        joinUrl={joinUrl}
        players={players}
        hostId={currentRoom.host_id}
        currentProfileId={profile.id}
        playersLoading={playersLoading}
        isHost={isHost}
        canStart={canStart}
        starting={starting}
        onStartGame={handleStartGame}
        onCancel={handleCancel}
        onAddFriend={sendRequest}
        getFriendStatus={statusWith}
      />

      {leaveError && (
        <p className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-red-400/30 bg-red-950/90 px-4 py-3 text-center text-sm text-red-300">
          {leaveError}
        </p>
      )}
    </>
  );
}