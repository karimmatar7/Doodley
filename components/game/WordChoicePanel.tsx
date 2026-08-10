"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

type WordChoicePanelProps = {
  roundId: string;
  choices: string[];
};

export default function WordChoicePanel({
  roundId,
  choices,
}: WordChoicePanelProps) {
  const [customWord, setCustomWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleChoose(word: string) {
    const normalizedWord = word.trim();

    if (!normalizedWord || loading) return;

    setLoading(true);
    setError(null);

    const { error: rpcError } = await supabase.rpc("choose_word", {
      p_round_id: roundId,
      p_word: normalizedWord,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
    }
  }

  async function handleCustomWordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const word = customWord.trim();

    if (!word) {
      setError("Please enter a word.");
      return;
    }

    await handleChoose(word);
  }

  return (
    <div className="w-full space-y-4 text-center">
      <p className="font-medium text-slate-400">
        Pick a word to draw:
      </p>

      <div className="grid grid-cols-1 gap-2">
        {choices.map((word) => (
          <Button
            key={word}
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => handleChoose(word)}
          >
            {word}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500">
          or
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form
        onSubmit={handleCustomWordSubmit}
        className="space-y-2 text-left"
      >
        <label
          htmlFor="custom-word"
          className="block text-xs uppercase tracking-widest text-slate-500"
        >
          Type your own word
        </label>

        <input
          id="custom-word"
          type="text"
          value={customWord}
          onChange={(event) => {
            setCustomWord(event.target.value);
            setError(null);
          }}
          placeholder="Enter a word"
          maxLength={40}
          disabled={loading}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-center text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-brand-maroon disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="submit"
          variant="secondary"
          disabled={loading || !customWord.trim()}
          className="w-full"
        >
          {loading ? "Choosing..." : "Use my word"}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}