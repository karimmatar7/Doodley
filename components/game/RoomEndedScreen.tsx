"use client";

import Button from "@/components/ui/Button";
import DoodleyLogo from "@/components/DoodleyLogo";
import GameScreen from "@/components/ui/GameScreen";
import ErrorMessage from "@/components/ui/ErrorMessage";

type RoomEndedScreenProps = {
  variant: "host_left" | "solo_ended";
  canRestart: boolean;
  hasAgreedToRestart: boolean;
  restartLoading: boolean;
  restartError: string | null;
  onRestart: () => void;
  onGoHome: () => void;
};

const COPY: Record<
  RoomEndedScreenProps["variant"],
  {
    title: string;
    restartLabel: string;
    agreedLabel: string;
    waitingLabel: string;
  }
> = {
  host_left: {
    title: "The host left the game.",
    restartLabel: "Play again with a new host",
    agreedLabel: "Waiting for other players to agree...",
    waitingLabel: "Waiting for someone to start a new game...",
  },
  solo_ended: {
    title: "Everyone else left the game.",
    restartLabel: "Start a new game",
    agreedLabel: "Starting...",
    waitingLabel: "Invite players to keep playing.",
  },
};

export default function RoomEndedScreen({
  variant,
  canRestart,
  hasAgreedToRestart,
  restartLoading,
  restartError,
  onRestart,
  onGoHome,
}: RoomEndedScreenProps) {
  const copy = COPY[variant];

  return (
    <GameScreen className="flex items-center justify-center">
      <div className="sketch-card relative w-full max-w-md space-y-6 p-8 text-center">
        <div className="tape tape-tr" />
        <DoodleyLogo size="text-2xl" />

        <p className="font-hand text-sm text-ink">{copy.title}</p>

        <ErrorMessage message={restartError} />

        <div className="flex flex-col gap-3">
          {canRestart ? (
            hasAgreedToRestart ? (
              <p className="text-sm font-hand text-ink-soft">{copy.agreedLabel}</p>
            ) : (
              <Button
                type="button"
                variant="secondary"
                disabled={restartLoading}
                onClick={onRestart}
              >
                {restartLoading ? "Starting..." : copy.restartLabel}
              </Button>
            )
          ) : (
            <p className="text-sm font-hand text-ink-soft">{copy.waitingLabel}</p>
          )}

          <Button type="button" variant="secondary" onClick={onGoHome}>
            Go home
          </Button>
        </div>
      </div>
    </GameScreen>
  );
}
