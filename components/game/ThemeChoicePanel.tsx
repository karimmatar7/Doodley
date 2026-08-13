"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import WordChoicePanel from "@/components/game/WordChoicePanel";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { formatThemeLabel } from "@/lib/constants/themeLabels";

type ThemeChoicePanelProps = {
  roundId: string;
};

type Theme = {
  theme: string;
  word_count: number;
};

export default function ThemeChoicePanel({
  roundId,
}: ThemeChoicePanelProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customMode, setCustomMode] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    async function loadThemes() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc(
        "get_word_themes"
      );

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setThemes(data ?? []);
      }

      setLoading(false);
    }

    loadThemes();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handleChooseTheme(theme: string) {
    if (choosing) return;

    setChoosing(true);
    setError(null);

    const { error: rpcError } = await supabase.rpc("choose_theme", {
      p_round_id: roundId,
      p_theme: theme,
    });

    if (rpcError) {
      setError(rpcError.message);
      setChoosing(false);
    }
  }

  if (customMode) {
    return <WordChoicePanel roundId={roundId} choices={[]} />;
  }

  return (
    <div className="w-full space-y-4 text-center">
      <p className="font-hand text-ink-soft">
        Pick a theme to draw from:
      </p>

      {loading && (
        <p className="text-sm font-hand text-ink-soft">Loading themes...</p>
      )}

      {!loading && themes.length === 0 && !error && (
        <p className="text-sm font-hand text-ink-soft">No themes available.</p>
      )}

      <div className="grid grid-cols-1 gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.theme}
            type="button"
            variant="secondary"
            disabled={choosing}
            onClick={() => handleChooseTheme(theme.theme)}
          >
            {formatThemeLabel(theme.theme)}
          </Button>
        ))}

        <Button
          type="button"
          variant="secondary"
          disabled={choosing}
          onClick={() => setCustomMode(true)}
        >
          Other
        </Button>
      </div>

      <ErrorMessage message={error} />
    </div>
  );
}
