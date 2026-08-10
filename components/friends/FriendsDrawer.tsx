import { FriendRow } from "@/lib/hooks/useFriends";
import FriendRequestsPanel from "@/components/friends/FriendRequestsPanel";
import FriendsListPanel from "@/components/friends/FriendsListPanel";

export default function FriendsDrawer({
  friends,
  incoming,
  onAccept,
  onDecline,
  onMessage,
  onUnfriend,
  onClose,
}: {
  friends: FriendRow[];
  incoming: FriendRow[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onMessage: (friend: FriendRow) => void;
  onUnfriend: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 z-40 sm:w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-4 space-y-4">
        {incoming.length === 0 && friends.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">No friends yet.</p>
        )}
        <FriendRequestsPanel incoming={incoming} onAccept={onAccept} onDecline={onDecline} />
        <FriendsListPanel friends={friends} onMessage={onMessage} onUnfriend={onUnfriend} />
      </div>
    </>
  );
}