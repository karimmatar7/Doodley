"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AddFriendForm({
  onAdd,
}: {
  onAdd: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await onAdd(value.trim());
      setMessage("Friend request sent.");
      setValue("");
    } catch (err: any) {
      setError(err?.message ?? "Could not send friend request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input label="Add friend" value={value} onChange={setValue} hideLabel />
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Sending..." : "Add friend"}
      </Button>
      {message && <p className="text-xs text-emerald-400">{message}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </form>
  );
}