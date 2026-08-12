
export const THEME_LABELS: Record<string, string> = {
  countries: "Countries",
  landmarks: "Tourist attractions",
  animals: "Animals",
  household: "House belongings",
  food: "Food",
  buildings: "Buildings",
  other: "Other",
};

export function formatThemeLabel(theme: string): string {
  return THEME_LABELS[theme] ?? theme.replace(/_/g, " ");
}