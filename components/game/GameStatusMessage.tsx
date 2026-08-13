import GameScreen from "@/components/ui/GameScreen";

type GameStatusMessageProps = {
  children: React.ReactNode;
};

export default function GameStatusMessage({
  children,
}: GameStatusMessageProps) {
  return (
    <GameScreen className="flex items-center justify-center">
      <p className="font-hand text-sm text-ink-soft">{children}</p>
    </GameScreen>
  );
}
