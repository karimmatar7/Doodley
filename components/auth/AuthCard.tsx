import DoodleyLogo from "@/components/DoodleyLogo";
import GameScreen from "@/components/ui/GameScreen";

export default function AuthCard({
  subtitle,
  children,
}: {
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <GameScreen className="flex items-center justify-center">
      <div className="sketch-card relative w-full max-w-md p-8">
        <div className="tape tape-tl" />
        <div className="flex justify-center mb-4">
          <DoodleyLogo />
        </div>
        {subtitle && (
          <p className="mb-6 text-center font-hand text-sm text-ink-soft">{subtitle}</p>
        )}
        {children}
      </div>
    </GameScreen>
  );
}
