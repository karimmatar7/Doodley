
import { formatThemeLabel } from "@/lib/constants/themeLabels";

type RoundThemeBadgeProps = {
  theme: string | null;
};

export default function RoundThemeBadge({ theme }: RoundThemeBadgeProps) {
  if (!theme) return null;

  return (
    <p className="text-center text-sm text-slate-400">
      Theme:{" "}
      <span className="font-semibold text-brand-green-light">
        {formatThemeLabel(theme)}
      </span>
    </p>
  );
}