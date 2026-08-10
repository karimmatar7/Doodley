"use client";

import { useState } from "react";
import { useDirectMessages } from "@/lib/hooks/useDirectMessages";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function DirectMessagePanel({
  myProfileId,
  otherProfileId,
  otherDisplayName,
  otherDiscriminator,
  onClose,
}: {
  myProfileId: string;
  otherProfileId: string;
  otherDisplayName: string;
  otherDiscriminator: string;
  onClose: () => void;
}) {
  const { messages, sendMessage } = useDirectMessages(myProfileId, otherProfileId);
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-white">
            {otherDisplayName}
            <span className="text-slate-500">#{otherDiscriminator}</span>
          </p>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm transition-colors">
            Close
          </button>
        </div>

        <div className="h-64 overflow-y-auto space-y-1 rounded-lg border border-white/10 bg-black/20 p-3 mb-3">
          {messages.map((m) => (
            <p key={m.id} className={`text-sm ${m.sender_id === myProfileId ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-2 py-1 rounded-lg ${
                  m.sender_id === myProfileId
                    ? "bg-brand-maroon text-white"
                    : "bg-white/10 text-slate-200"
                }`}
              >
                {m.text}
              </span>
            </p>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input label="Message" hideLabel value={text} onChange={setText} maxLength={200} />
          </div>
          <Button type="submit" fullWidth={false}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}