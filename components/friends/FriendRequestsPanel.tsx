import { FriendRow } from "@/lib/hooks/useFriends";
import FriendRequestItem from "@/components/friends/FriendRequestItem";

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
      <p className="label">Friend requests</p>
      {incoming.map((req) => (
        <FriendRequestItem
          key={req.id}
          displayName={req.display_name}
          discriminator={req.discriminator}
          onAccept={() => onAccept(req.id)}
          onDecline={() => onDecline(req.id)}
        />
      ))}
    </div>
  );
}
