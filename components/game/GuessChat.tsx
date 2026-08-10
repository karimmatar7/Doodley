"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useGuesses } from "@/lib/hooks/useGuesses";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function GuessChat({
  roundId,
  playerId,
  isDrawer,
  players,
}: {
  roundId: string;
  playerId: string;
  isDrawer: boolean;
  players: { profile_id: string; display_name: string; discriminator: string }[];
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { guesses } = useGuesses(roundId);
  const supabase = createClient();

  function nameFor(profileId: string) {
    const p = players.find((pl) => pl.profile_id === profileId);
    return p ? `${p.display_name}#${p.discriminator}` : "Player";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isDrawer) return;
    setSubmitting(true);
    await supabase.rpc("submit_guess", { p_round_id: roundId, p_player_id: playerId, p_text: text.trim() });
    setText("");
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col h-80 rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex-1 overflow-y-auto space-y-1 mb-2">
        {guesses.map((g) => (
          <p key={g.id} className="text-sm">
            {g.is_correct ? (
              <span className="text-emerald-400 font-semibold">🎉 {nameFor(g.player_id)} guessed the word!</span>
            ) : (
              <>
                <span className="font-semibold text-white">{nameFor(g.player_id)}: </span>
                <span className="text-slate-400">{g.text}</span>
              </>
            )}
          </p>
        ))}
      </div>

      {isDrawer ? (
        <p className="text-sm text-slate-500 text-center">You're drawing! Watch the guesses roll in.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input label="Guess" hideLabel value={text} onChange={setText} maxLength={40} />
          </div>
          <Button type="submit" fullWidth={false} disabled={submitting}>
            Send
          </Button>
        </form>
      )}
    </div>
  );
}