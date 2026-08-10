"use client";

import Button from "@/components/ui/Button";

type CancelledRoomScreenProps = {
  onGoToLobby: () => void;
};

export default function CancelledRoomScreen({
  onGoToLobby,
}: CancelledRoomScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-xl sm:p-8">
        <h1 className="text-xl font-semibold text-white sm:text-2xl">
          Room cancelled
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
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
    </main>
  );
}