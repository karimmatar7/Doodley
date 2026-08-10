import { FriendRow } from "@/lib/hooks/useFriends";
import FriendListItem from "@/components/friends/FriendListItem";

export default function FriendsListPanel({
  friends,
  onMessage,
  onUnfriend,
}: {
  friends: FriendRow[];
  onMessage: (friend: FriendRow) => void;
  onUnfriend: (friendRowId: string) => void;
}) {
  if (friends.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-2">
      <p className="text-xs uppercase tracking-widest text-slate-500">Friends</p>
      {friends.map((f) => (
        <FriendListItem
          key={f.id}
          displayName={f.display_name}
          discriminator={f.discriminator}
          onMessage={() => onMessage(f)}
          onUnfriend={() => onUnfriend(f.id)}
        />
      ))}
    </div>
  );
}