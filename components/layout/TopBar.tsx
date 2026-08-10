"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FriendRow } from "@/lib/hooks/useFriends";
import FriendsDrawer from "@/components/friends/FriendsDrawer";

export default function TopBar({
  friends,
  incoming,
  onAccept,
  onDecline,
  onMessage,
  onUnfriend,
}: {
  friends: FriendRow[];
  incoming: FriendRow[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onMessage: (friend: FriendRow) => void;
  onUnfriend: (id: string) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setDrawerOpen((v) => !v)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Friends"
        >
          <svg className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          {incoming.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-maroon text-[10px] font-bold text-white">
              {incoming.length}
            </span>
          )}
        </button>

        {drawerOpen && (
          <FriendsDrawer
            friends={friends}
            incoming={incoming}
            onAccept={onAccept}
            onDecline={onDecline}
            onMessage={onMessage}
            onUnfriend={onUnfriend}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex h-11 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        Log out
      </button>
    </div>
  );
}