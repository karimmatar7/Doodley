import PlayerTag from "@/components/ui/PlayerTag";
import Button from "@/components/ui/Button";

export default function FriendListItem({
  displayName,
  discriminator,
  onMessage,
  onUnfriend,
}: {
  displayName: string;
  discriminator: string;
  onMessage: () => void;
  onUnfriend: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
      <PlayerTag displayName={displayName} discriminator={discriminator} />
      <div className="flex gap-2">
        <Button variant="secondary" fullWidth onClick={onMessage}>
          Message
        </Button>
        <Button variant="outline" fullWidth onClick={onUnfriend}>
          Unfriend
        </Button>
      </div>
    </div>
  );
}