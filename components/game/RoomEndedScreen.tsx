"use client";

import Button from "@/components/ui/Button";
import DoodleyLogo from "@/components/DoodleyLogo";

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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <DoodleyLogo size="text-2xl" />

        <p className="text-sm text-slate-300">{copy.title}</p>

        {restartError && (
          <p className="text-sm text-red-400" role="alert">
            {restartError}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {canRestart ? (
            hasAgreedToRestart ? (
              <p className="text-sm text-slate-500">{copy.agreedLabel}</p>
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
            <p className="text-sm text-slate-500">{copy.waitingLabel}</p>
          )}

          <Button type="button" variant="secondary" onClick={onGoHome}>
            Go home
          </Button>
        </div>
      </div>
    </main>
  );
}