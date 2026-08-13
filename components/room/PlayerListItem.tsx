export type AddState = "none" | "pending" | "friends" | "self";

export default function PlayerListItem({
  displayName,
  discriminator,
  isHost,
  onAdd,
  addState,
  score,
}: {
  displayName: string;
  discriminator: string;
  isHost?: boolean;
  onAdd?: () => void;
  addState?: AddState;
  score?: number;
}) {
  return (
    <div className="flex items-center justify-between border-2 border-ink/20 bg-paper-dark px-4 py-2.5">
      <p className="font-hand text-sm">
        <span className="font-bold text-ink">{displayName}</span>
        <span className="text-ink-soft">#{discriminator}</span>
      </p>

      <div className="flex items-center gap-2">
        {typeof score === "number" && (
          <span className="text-sm font-bold text-brand-green">{score} pts</span>
        )}

        {isHost && (
          <span className="border-2 border-ink/40 bg-brand-maroon px-2.5 py-0.5 text-xs font-bold text-cream">
            Host
          </span>
        )}

        {addState === "none" && onAdd && (
          <button
            onClick={onAdd}
            className="chip-btn bg-paper-light px-3 py-1 text-xs font-bold text-ink hover:bg-brand-blue-light"
          >
            + Add
          </button>
        )}

        {addState === "pending" && <span className="text-xs font-hand text-ink-soft">Pending</span>}
        {addState === "friends" && <span className="text-xs font-hand font-bold text-brand-green">Friends</span>}
      </div>
    </div>
  );
}
