type AddState = "none" | "pending" | "friends" | "self";

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
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5">
      <p className="text-sm">
        <span className="font-semibold text-white">{displayName}</span>
        <span className="text-slate-500">#{discriminator}</span>
      </p>

      <div className="flex items-center gap-2">
        {typeof score === "number" && (
          <span className="text-sm font-semibold text-emerald-400">{score} pts</span>
        )}

        {isHost && (
          <span className="rounded-full bg-brand-maroon px-2.5 py-0.5 text-xs font-medium text-white">
            Host
          </span>
        )}

        {addState === "none" && onAdd && (
          <button
            onClick={onAdd}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 transition-colors"
          >
            + Add
          </button>
        )}

        {addState === "pending" && <span className="text-xs text-slate-500">Pending</span>}
        {addState === "friends" && <span className="text-xs text-emerald-500">Friends</span>}
      </div>
    </div>
  );
}