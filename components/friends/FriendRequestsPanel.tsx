import { FriendRow } from "@/lib/hooks/useFriends";
import Button from "@/components/ui/Button";

export default function FriendRequestsPanel({
  incoming,
  onAccept,
  onDecline,
}: {
  incoming: FriendRow[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  if (incoming.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-2">
      <p className="text-xs uppercase tracking-widest text-slate-500">Friend requests</p>
      {incoming.map((req) => (
        <div
          key={req.id}
          className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
        >
          <p className="text-sm">
            <span className="font-semibold text-white">{req.display_name}</span>
            <span className="text-slate-500">#{req.discriminator}</span>
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => onAccept(req.id)}>
              Accept
            </Button>
            <Button variant="outline" fullWidth onClick={() => onDecline(req.id)}>
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}