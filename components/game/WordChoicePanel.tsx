"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";

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
      <p className="font-hand text-ink-soft">
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

      <div className="divider py-1" />

      <form
        onSubmit={handleCustomWordSubmit}
        className="space-y-2 text-left"
      >
        <Input
          label="Type your own word"
          value={customWord}
          onChange={(value) => {
            setCustomWord(value);
            setError(null);
          }}
          maxLength={40}
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

      <ErrorMessage message={error} />
    </div>
  );
}
