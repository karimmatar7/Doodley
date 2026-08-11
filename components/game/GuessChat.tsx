"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useGuesses } from "@/lib/hooks/useGuesses";
import { useRoomEvents } from "@/lib/hooks/useRoomEvents";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FeedItem =
  | { kind: "guess"; key: string; timestamp: string; guessId: number }
  | { kind: "event"; key: string; timestamp: string; eventId: number; message: string };

export default function GuessChat({
  roomId,
  roundId,
  playerId,
  isDrawer,
  players,
}: {
  roomId: string;
  roundId: string;
  playerId: string;
  isDrawer: boolean;
  players: { profile_id: string; display_name: string; discriminator: string }[];
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { guesses } = useGuesses(roundId);
  const { events } = useRoomEvents(roomId);
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

  const feed: FeedItem[] = [
    ...guesses.map((g) => ({
      kind: "guess" as const,
      key: `guess-${g.id}`,
      timestamp: g.guessed_at,
      guessId: g.id,
    })),
    ...events.map((e) => ({
      kind: "event" as const,
      key: `event-${e.id}`,
      timestamp: e.created_at,
      eventId: e.id,
      message: e.message,
    })),
  ].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex flex-col h-80 rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex-1 overflow-y-auto space-y-1 mb-2">
        {feed.map((item) => {
          if (item.kind === "event") {
            return (
              <p key={item.key} className="text-sm text-red-400 italic">
                {item.message}
              </p>
            );
          }

          const g = guesses.find((guess) => guess.id === item.guessId);
          if (!g) return null;

          return (
            <p key={item.key} className="text-sm">
              {g.is_correct ? (
                <span className="text-emerald-400 font-semibold">🎉 {nameFor(g.player_id)} guessed the word!</span>
              ) : (
                <>
                  <span className="font-semibold text-white">{nameFor(g.player_id)}: </span>
                  <span className="text-slate-400">{g.text}</span>
                </>
              )}
            </p>
          );
        })}
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