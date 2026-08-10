import { FriendRow } from "@/lib/hooks/useFriends";
import FriendRequestsPanel from "@/components/friends/FriendRequestsPanel";
import FriendsListPanel from "@/components/friends/FriendsListPanel";
import AddFriendForm from "@/components/friends/AddFriendForm";

export default function FriendsDrawer({
  friends,
  incoming,
  onAccept,
  onDecline,
  onMessage,
  onUnfriend,
  onAddFriend,
  onClose,
}: {
  friends: FriendRow[];
  incoming: FriendRow[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onMessage: (friend: FriendRow) => void;
  onUnfriend: (id: string) => void;
  onAddFriend: (profileId: string) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close friends drawer"
        className="fixed inset-0 z-30 cursor-default"
        onClick={onClose}
      />

      <div className="fixed left-4 right-4 top-16 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-slate-900 p-4 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80">
        <div className="space-y-4">
          <section>
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
              Add friend
            </p>

            <AddFriendForm onAdd={onAddFriend} />
          </section>

          {(incoming.length > 0 || friends.length > 0) && (
            <div className="border-t border-white/10" />
          )}

          <FriendRequestsPanel
            incoming={incoming}
            onAccept={onAccept}
            onDecline={onDecline}
          />

          <FriendsListPanel
            friends={friends}
            onMessage={onMessage}
            onUnfriend={onUnfriend}
          />

          {incoming.length === 0 && friends.length === 0 && (
            <p className="py-2 text-center text-sm text-slate-500">
              No friends or pending requests yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}