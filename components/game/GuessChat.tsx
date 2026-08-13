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
    <div className="sketch-card relative flex h-80 flex-col p-3">
      <div className="tape tape-tl" />
      <div className="mb-2 flex-1 space-y-1 overflow-y-auto">
        {feed.map((item) => {
          if (item.kind === "event") {
            return (
              <p key={item.key} className="text-sm text-brand-maroon italic">
                {item.message}
              </p>
            );
          }

          const g = guesses.find((guess) => guess.id === item.guessId);
          if (!g) return null;

          return (
            <p key={item.key} className="text-sm font-hand">
              {g.is_correct ? (
                <span className="font-semibold text-brand-green">🎉 {nameFor(g.player_id)} guessed the word!</span>
              ) : (
                <>
                  <span className="font-semibold text-ink">{nameFor(g.player_id)}: </span>
                  <span className="text-ink-soft">{g.text}</span>
                </>
              )}
            </p>
          );
        })}
      </div>

      {isDrawer ? (
        <p className="text-center text-sm font-hand text-ink-soft">You're drawing! Watch the guesses roll in.</p>
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