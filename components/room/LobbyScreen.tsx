"use client";

import DoodleyLogo from "@/components/DoodleyLogo";
import PlayerListItem from "@/components/room/PlayerListItem";
import Button from "@/components/ui/Button";
import RoomInvite from "@/components/room/RoomInvite";

type LobbyPlayer = {
  id: string;
  profile_id: string;
  display_name: string;
  discriminator: string;
  score: number;
};

type LobbyScreenProps = {
  roomCode: string;
  joinUrl: string;
  players: {
    id: string;
    display_name: string;
    discriminator: string;
    profile_id: string;
    score: number;
  }[];
  hostId: string;
  currentProfileId: string;
  playersLoading: boolean;
  isHost: boolean;
  canStart: boolean;
  starting: boolean;
  onStartGame: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onAddFriend: (profileId: string) => void | Promise<void>;
  getFriendStatus: (
    profileId: string
  ) => "none" | "pending" | "friends";
};

export default function LobbyScreen({
  roomCode,
  joinUrl,
  players,
  hostId,
  currentProfileId,
  playersLoading,
  isHost,
  canStart,
  starting,
  onStartGame,
  onCancel,
  onAddFriend,
  getFriendStatus,
}: LobbyScreenProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 bg-grid px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6 sm:max-w-md">
<div className="flex flex-col items-center gap-4">
          <DoodleyLogo size="text-4xl sm:text-5xl" />

        <div className="flex justify-center">
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
<RoomInvite
  code={roomCode}
  joinUrl={joinUrl}
  isHost={isHost}
/>
        </div>

</div>
        </div>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Players ({players.length})
          </p>

          {playersLoading ? (
            <p className="text-sm text-slate-500">
              Loading players...
            </p>
          ) : (
            <div className="space-y-2">
              {players.map((player) => {
                const isMe =
                  player.profile_id === currentProfileId;

                return (
                  <PlayerListItem
                    key={player.id}
                    displayName={player.display_name}
                    discriminator={player.discriminator}
                    isHost={player.profile_id === hostId}
                    score={player.score}
                    onAdd={
                      isMe
                        ? undefined
                        : () => onAddFriend(player.profile_id)
                    }
                    addState={
                      isMe
                        ? "self"
                        : getFriendStatus(player.profile_id)
                    }
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          {isHost ? (
            <Button
              type="button"
              onClick={onStartGame}
              disabled={!canStart || starting}
              className="w-full"
            >
              {starting
                ? "Starting..."
                : players.length < 2
                  ? "Waiting for more players..."
                  : "Start game"}
            </Button>
          ) : (
            <p className="text-center text-sm text-slate-500">
              Waiting for the host to start the game...
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={starting}
            className="w-full"
          >
            Cancel
          </Button>
        </section>
      </div>
    </main>
  );
}