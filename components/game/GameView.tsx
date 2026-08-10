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

import DoodleyLogo from "@/components/DoodleyLogo";
import RoomCodeBadge from "@/components/room/RoomCodeBadge";
import DrawingCanvas from "@/components/game/DrawingCanvas";
import RoundTimer from "@/components/game/RoundTimer";
import WordChoicePanel from "@/components/game/WordChoicePanel";
import GuessChat from "@/components/game/GuessChat";
import RoundEndPanel from "@/components/game/RoundEndPanel";
import GameEndPanel from "@/components/game/GameEndPanel";
import PlayerListItem from "@/components/room/PlayerListItem";

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

  /*
   * Redirect rules:
   *
   * 1. If there are no players, leave the room.
   * 2. If this user is the host and no other players remain,
   *    leave the room as well.
   *
   * The second rule is the important one. The host is still present,
   * so players.length is 1, not 0.
   */
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
      if (alreadyCalled) {
        return;
      }

      const millisecondsLeft =
        new Date(endsAt).getTime() - Date.now();

      if (millisecondsLeft <= 0) {
        alreadyCalled = true;

        supabase
          .rpc("end_round", {
            p_round_id: roundId,
          })
          .then(({ error }) => {
            if (error) {
              console.error(
                "end_round failed:",
                error
              );
            }
          });
      }
    }

    checkDeadline();

    const interval = window.setInterval(
      checkDeadline,
      500
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [round, supabase]);

  async function handlePlayAgain() {
    if (!room) {
      return;
    }

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
    if (!room) {
      return;
    }

    setPlayAgainLoading(true);
    setPlayAgainError(null);

    const { error } = await supabase.rpc(
      "start_rematch",
      {
        p_room_id: room.id,
      }
    );

    if (error) {
      setPlayAgainError(error.message);
      setPlayAgainLoading(false);
      return;
    }

    setPlayAgainLoading(false);

    router.push(`/room/${room.code}`);
    router.refresh();
  }

  async function handleLeave() {
    if (room) {
      const { error } = await supabase.rpc(
        "leave_room",
        {
          p_room_id: room.id,
        }
      );

      if (error) {
        console.error(
          "leave_room failed:",
          error
        );
      }
    }

    router.replace("/lobby");
  }

  if (
    profileLoading ||
    roomLoading ||
    playersLoading ||
    !room ||
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid">
        <p className="text-sm text-slate-400">
          Loading...
        </p>
      </main>
    );
  }

  const myPlayer = players.find(
    (player) => player.profile_id === profile.id
  );

  const isHost = profile.id === room.host_id;

  const otherPlayers = players.filter(
    (player) => player.profile_id !== room.host_id
  );

  const hasOtherPlayers =
    otherPlayers.length > 0;

  /*
   * Do not treat zero other players as "everyone is ready".
   */
  const allPlayersReady =
    hasOtherPlayers &&
    otherPlayers.every(
      (player) => player.rematch_ready === true
    );

  const myPlayerReady =
    myPlayer?.rematch_ready === true;

  const isRematchWaiting =
    room.status === "rematch_waiting";

  const isRematchScreen =
    room.status === "game_end" ||
    room.status === "rematch_waiting";

  /*
   * Prevent the host from briefly seeing:
   * "Everyone is ready"
   * when the host is alone.
   *
   * The useEffect above performs the actual redirect.
   */
  if (
    isHost &&
    isRematchScreen &&
    !hasOtherPlayers
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid">
        <p className="text-sm text-slate-400">
          No other players remain. Returning to the lobby...
        </p>
      </main>
    );
  }

  if (players.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid">
        <p className="text-sm text-slate-400">
          Returning to the lobby...
        </p>
      </main>
    );
  }

  /*
   * Show the rematch screen before checking !round.
   */
  if (isRematchScreen) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid px-4">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8">
          <GameEndPanel
            isHost={isHost}
            allPlayersReady={allPlayersReady}
            myPlayerReady={myPlayerReady}
            onPlayAgain={handlePlayAgain}
            onStartGame={handleStartRematch}
            onLeave={handleLeave}
            loading={playAgainLoading}
            error={playAgainError}
          />

          {allPlayersReady &&
            isRematchWaiting &&
            !isHost && (
              <p className="mt-4 text-center text-sm text-slate-400">
                Everyone is ready. Waiting for the host
                to start the game.
              </p>
            )}
        </div>
      </main>
    );
  }

  if (!round) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid">
        <p className="text-sm text-slate-400">
          Setting up the round...
        </p>
      </main>
    );
  }

  const isDrawer =
    round.drawer_id === myPlayer?.id;

  return (
    <main className="min-h-screen bg-slate-950 bg-grid px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <DoodleyLogo size="text-2xl" />

          <RoomCodeBadge code={room.code} />

          {round.status === "drawing" && (
            <RoundTimer
              endsAt={round.ends_at}
            />
          )}
        </div>

        {round.status === "choosing_word" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            {isDrawer ? (
              <WordChoicePanel
                roundId={round.id}
                choices={round.word_choices ?? []}
              />
            ) : (
              <p className="text-center text-sm text-slate-400">
                Waiting for the drawer to pick a word...
              </p>
            )}
          </div>
        )}

        {round.status === "drawing" && myPlayer && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <DrawingCanvas
                roundId={round.id}
                isDrawer={isDrawer}
              />
            </div>

            <div className="space-y-3">
              <GuessChat
                roundId={round.id}
                playerId={myPlayer.id}
                isDrawer={isDrawer}
                players={players}
              />

              <div className="space-y-1">
                {players
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map((player) => (
                    <PlayerListItem
                      key={player.id}
                      displayName={player.display_name}
                      discriminator={player.discriminator}
                      isHost={
                        player.profile_id === room.host_id
                      }
                      score={player.score}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {round.status === "ended" && (
          <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-white/5 p-8">
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