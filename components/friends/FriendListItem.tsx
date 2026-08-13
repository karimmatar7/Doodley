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
    <div className="flex items-center justify-between gap-2 border-2 border-ink/20 bg-paper-dark px-3 py-2">
      <div className="min-w-0 flex-1">
        <PlayerTag displayName={displayName} discriminator={discriminator} />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button variant="secondary" fullWidth={false} onClick={onMessage} className="shrink-0 !px-2 !py-1 !text-xs">
          Message
        </Button>
        <Button variant="outline" fullWidth={false} onClick={onUnfriend} className="shrink-0 !px-2 !py-1 !text-xs">
          Unfriend
        </Button>
      </div>
    </div>
  );
}
