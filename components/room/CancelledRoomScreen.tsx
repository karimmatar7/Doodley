"use client";

import Button from "@/components/ui/Button";
import GameScreen from "@/components/ui/GameScreen";

type CancelledRoomScreenProps = {
  onGoToLobby: () => void;
};

export default function CancelledRoomScreen({
  onGoToLobby,
}: CancelledRoomScreenProps) {
  return (
    <GameScreen className="flex items-center justify-center">
      <div className="sketch-card relative w-full max-w-md p-6 text-center sm:p-8">
        <div className="tape tape-tr" />
        <h1 className="text-xl font-bold text-ink sm:text-2xl">
          Room cancelled
        </h1>

        <p className="mt-3 font-hand text-sm leading-6 text-ink-soft">
          The host cancelled this room. You can return to the main menu.
        </p>

        <Button
          type="button"
          onClick={onGoToLobby}
          className="mt-6 w-full"
        >
          Go to main menu
        </Button>
      </div>
    </GameScreen>
  );
}
