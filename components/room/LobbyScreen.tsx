"use client";

import DoodleyLogo from "@/components/DoodleyLogo";
import PlayerListItem from "@/components/room/PlayerListItem";
import Button from "@/components/ui/Button";
import RoomInvite from "@/components/room/RoomInvite";
import GameScreen from "@/components/ui/GameScreen";

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
    <GameScreen className="flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 sm:max-w-md">
        <div className="flex flex-col items-center gap-4">
          <DoodleyLogo size="text-4xl sm:text-5xl" />

          <RoomInvite code={roomCode} joinUrl={joinUrl} isHost={isHost} />
        </div>

        <div className="divider" />

        <section className="space-y-3">
          <p className="label">Players ({players.length})</p>

          {playersLoading ? (
            <p className="text-sm font-hand text-ink-soft">
              Loading players...
            </p>
          ) : (
            <div className="space-y-2">
              {players.map((player) => {
                const isMe = player.profile_id === currentProfileId;

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

        <div className="divider" />

        <section className="space-y-3">
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
            <p className="text-center font-hand text-sm text-ink-soft">
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
    </GameScreen>
  );
}
