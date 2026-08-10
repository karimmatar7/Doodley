"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function WordChoicePanel({ roundId, choices }: { roundId: string; choices: string[] }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleChoose(word: string) {
    setLoading(true);
    await supabase.rpc("choose_word", { p_round_id: roundId, p_word: word });
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-700 font-medium">Pick a word to draw:</p>
      <div className="grid grid-cols-1 gap-2">
        {choices.map((word) => (
          <Button key={word} variant="secondary" disabled={loading} onClick={() => handleChoose(word)}>
            {word}
          </Button>
        ))}
      </div>
    </div>
  );
}