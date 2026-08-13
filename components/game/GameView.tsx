"use client";

import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

import { useProfile } from "@/lib/hooks/useProfile";
import { useRoom } from "@/lib/hooks/useRoom";
import { useRoomPlayers } from "@/lib/hooks/useRoomPlayers";
import { useRound } from "@/lib/hooks/useRound";
import { createClient } from "@/lib/supabase/client";

import GameStatusMessage from "@/components/game/GameStatusMessage";
import RematchScreen from "@/components/game/RematchScreen";
import DrawingRoundView from "@/components/game/DrawingRoundView";
import DoodleyLogo from "@/components/DoodleyLogo";
import RoomCodeBadge from "@/components/room/RoomCodeBadge";
import ThemeChoicePanel from "@/components/game/ThemeChoicePanel";

import LeaveGameButton from "@/components/game/LeaveGameButton";
import RoomEndedScreen from "@/components/game/RoomEndedScreen";

import WordChoicePanel from "@/components/game/WordChoicePanel";
import RoundTimer from "@/components/game/RoundTimer";
import RoundEndPanel from "@/components/game/RoundEndPanel";
import RoundThemeBadge from "@/components/game/RoundThemeBadge";

export default function GameView({
  code,
}: {
  code: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const { profile, loading: profileLoading } = useProfile();
  const { room, loading: roomLoading } = useRoom(code);

  const {
    players,
    loading: playersLoading,
  } = useRoomPlayers(room?.id ?? null);

  const { round } = useRound(room?.id ?? null);

  const [playAgainLoading, setPlayAgainLoading] =
    useState(false);
  const [playAgainError, setPlayAgainError] =
    useState<string | null>(null);

  const hasRedirectedToLobby = useRef(false);

  useEffect(() => {
    if (!profileLoading && !profile) {
      router.replace("/login");
    }
  }, [profileLoading, profile, router]);

  useEffect(() => {
    if (room?.status === "lobby") {
      router.replace(`/room/${room.code}`);
    }
  }, [room, router]);

  useEffect(() => {
    if (!room || !profile || playersLoading) {
      return;
    }

    const isHost = profile.id === room.host_id;

    const otherPlayers = players.filter(
      (player) => player.profile_id !== room.host_id
    );

    const isRematchScreen =
      room.status === "game_end" ||
      room.status === "rematch_waiting";

    const roomIsEmpty = players.length === 0;

    const hostHasNoOtherPlayers =
      isHost &&
      isRematchScreen &&
      otherPlayers.length === 0;

    if (
      (roomIsEmpty || hostHasNoOtherPlayers) &&
      !hasRedirectedToLobby.current
    ) {
      hasRedirectedToLobby.current = true;
      router.replace("/lobby");
    }
  }, [
    room,
    profile,
    players,
    playersLoading,
    router,
  ]);

  useEffect(() => {
    if (
      !round ||
      round.status !== "drawing" ||
      !round.ends_at
    ) {
      return;
    }

    const roundId = round.id;
    const endsAt = round.ends_at;
    let alreadyCalled = false;

    function checkDeadline() {
      if (alreadyCalled) return;

      const millisecondsLeft =
        new Date(endsAt).getTime() - Date.now();

      if (millisecondsLeft <= 0) {
        alreadyCalled = true;
        supabase.rpc("end_round", {
          p_round_id: roundId,
        }).then(({ error }) => {
          if (error) {
            console.error("end_round failed:", error);
          }
        });
      }
    }

    checkDeadline();

    const interval = window.setInterval(checkDeadline, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, [round, supabase]);

  async function handlePlayAgain() {
    if (!room) return;

    setPlayAgainLoading(true);
    setPlayAgainError(null);

    const { error } = await supabase.rpc("play_again", {
      p_room_id: room.id,
    });

    if (error) {
      setPlayAgainError(error.message);
      setPlayAgainLoading(false);
      return;
    }

    setPlayAgainLoading(false);
  }

  async function handleStartRematch() {
    if (!room) return;

    setPlayAgainLoading(true);
    setPlayAgainError(null);

    const { error } = await supabase.rpc("start_rematch", {
      p_room_id: room.id,
    });

    if (error) {
      setPlayAgainError(error.message);
      setPlayAgainLoading(false);
      return;
    }

    setPlayAgainLoading(false);
    router.push(`/room/${room.code}`);
    router.refresh();
  }

  async function handleRestartAfterHostLeft() {
    if (!room) return;

    setPlayAgainLoading(true);
    setPlayAgainError(null);

    const { error } = await supabase.rpc("restart_after_host_left", {
      p_room_id: room.id,
    });

    if (error) {
      setPlayAgainError(error.message);
      setPlayAgainLoading(false);
      return;
    }

    setPlayAgainLoading(false);
  }

  async function handleRestartSoloRoom() {
    if (!room) return;

    setPlayAgainLoading(true);
    setPlayAgainError(null);

    const { error } = await supabase.rpc("restart_solo_room", {
      p_room_id: room.id,
    });

    if (error) {
      setPlayAgainError(error.message);
      setPlayAgainLoading(false);
      return;
    }

    setPlayAgainLoading(false);
  }

  async function handleLeave() {
    if (room) {
      const { error } = await supabase.rpc("leave_room", {
        p_room_id: room.id,
      });

      if (error) {
        console.error("leave_room failed:", error);
      }
    }

    router.replace("/lobby");
  }

  async function handleLeaveGame() {
    await handleLeave();
  }

  if (
    profileLoading ||
    roomLoading ||
    playersLoading ||
    !room ||
    !profile
  ) {
    return (
      <GameStatusMessage>Loading...</GameStatusMessage>
    );
  }

  const myPlayer = players.find(
    (player) => player.profile_id === profile.id
  );

  const isHost = profile.id === room.host_id;

  const otherPlayers = players.filter(
    (player) => player.profile_id !== room.host_id
  );

  const hasOtherPlayers = otherPlayers.length > 0;

  const allPlayersReady =
    hasOtherPlayers &&
    otherPlayers.every(
      (player) => player.rematch_ready === true
    );

  const myPlayerReady = myPlayer?.rematch_ready === true;

  const isRematchWaiting = room.status === "rematch_waiting";
  const isRematchScreen =
    room.status === "game_end" ||
    room.status === "rematch_waiting";

if (room.status === "host_left") {
  return (
    <RoomEndedScreen
      variant="host_left"
      canRestart={!!myPlayer}
      hasAgreedToRestart={myPlayer?.rematch_ready === true}
      restartLoading={playAgainLoading}
      restartError={playAgainError}
      onRestart={handleRestartAfterHostLeft}
      onGoHome={() => router.replace("/lobby")}
    />
  );
}

if (room.status === "solo_ended") {
  return (
    <RoomEndedScreen
      variant="solo_ended"
      canRestart={!!myPlayer}
      hasAgreedToRestart={false}
      restartLoading={playAgainLoading}
      restartError={playAgainError}
      onRestart={handleRestartSoloRoom}
      onGoHome={() => router.replace("/lobby")}
    />
  );
}

  if (isHost && isRematchScreen && !hasOtherPlayers) {
    return (
      <GameStatusMessage>
        No other players remain. Returning to the lobby...
      </GameStatusMessage>
    );
  }

  if (players.length === 0) {
    return (
      <GameStatusMessage>
        Returning to the lobby...
      </GameStatusMessage>
    );
  }

  if (isRematchScreen) {
    return (
      <RematchScreen
        isHost={isHost}
        allPlayersReady={allPlayersReady}
        myPlayerReady={myPlayerReady}
        isRematchWaiting={isRematchWaiting}
        onPlayAgain={handlePlayAgain}
        onStartGame={handleStartRematch}
        onLeave={handleLeave}
        loading={playAgainLoading}
        error={playAgainError}
      />
    );
  }

  if (!round) {
    return (
      <GameStatusMessage>Setting up the round...</GameStatusMessage>
    );
  }

  const isDrawer = round.drawer_id === myPlayer?.id;

  return (
    <main className="min-h-screen bg-paper px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="sketch-card relative flex items-center justify-between gap-2 p-3">
          <div className="tape tape-tr" />
          <DoodleyLogo size="text-2xl" />
          {round.status === "drawing" && <RoundTimer endsAt={round.ends_at} />}
          <LeaveGameButton onConfirmLeave={handleLeaveGame} />
        </div>

        {round.status === "choosing_word" && (
          <div className="sketch-card p-8">
            {isDrawer ? (
              (round.word_choices ?? []).length === 0 ? (
                <ThemeChoicePanel roundId={round.id} />
              ) : (
                <WordChoicePanel
                  roundId={round.id}
                  choices={round.word_choices ?? []}
                />
              )
            ) : (
              <p className="text-center font-hand text-sm text-ink-soft">
                Waiting for the drawer to pick a word...
              </p>
            )}
          </div>
        )}
{round.status === "drawing" && myPlayer && (
  <>
    <RoundThemeBadge theme={round.theme} />
    <DrawingRoundView
      roomId={room.id}
      roundId={round.id}
      playerId={myPlayer.id}
      isDrawer={isDrawer}
      players={players}
      hostId={room.host_id}
    />
  </>
)}

        {round.status === "ended" && (
          <div className="sketch-card mx-auto max-w-md p-8">
            <RoundEndPanel
              roomId={room.id}
              word={round.word}
              isHost={isHost}
              players={players}
              hostId={room.host_id}
            />
          </div>
        )}
      </div>
    </main>
  );
}