"use client";

import { useEffect, useRef, useState } from "react";
import { useDirectMessages } from "@/lib/hooks/useDirectMessages";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ block: "end" });
    });
    return () => cancelAnimationFrame(raf);
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
  }

  return (
    <Modal onClose={onClose} ariaLabel={`Chat with ${otherDisplayName}`}>
      <div className="tape tape-tl" />
      <div className="mb-3 flex items-center justify-between">
        <p className="font-hand text-base font-bold text-ink">
          {otherDisplayName}
          <span className="text-ink-soft">#{otherDiscriminator}</span>
        </p>
        <button
          onClick={onClose}
          className="chip-btn bg-paper-light px-3 py-1 text-xs font-bold text-ink hover:bg-paper-dark"
        >
          Close
        </button>
      </div>

      <div className="mb-3 h-64 space-y-1 overflow-y-auto rounded-lg border-2 border-ink/15 bg-paper p-3">
        {messages.map((m) => (
          <p key={m.id} className={`font-hand text-sm ${m.sender_id === myProfileId ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block border-2 px-2 py-1 ${
                m.sender_id === myProfileId
                  ? "border-ink bg-brand-maroon text-cream"
                  : "border-ink/20 bg-paper-dark text-ink"
              }`}
              style={{ borderRadius: m.sender_id === myProfileId ? "14px 4px 14px 14px" : "4px 14px 14px 14px" }}
            >
              {m.text}
            </span>
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input label="Message" hideLabel value={text} onChange={setText} maxLength={200} />
        </div>
        <Button type="submit" fullWidth={false}>
          Send
        </Button>
      </form>
    </Modal>
  );
}
