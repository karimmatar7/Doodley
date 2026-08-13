
import { formatThemeLabel } from "@/lib/constants/themeLabels";

type RoundThemeBadgeProps = {
  theme: string | null;
};

export default function RoundThemeBadge({ theme }: RoundThemeBadgeProps) {
  if (!theme) return null;

  return (
    <p className="text-center font-hand text-sm text-ink-soft">
      Theme:{" "}
      <span className="font-bold text-brand-green">
        {formatThemeLabel(theme)}
      </span>
    </p>
  );
}
