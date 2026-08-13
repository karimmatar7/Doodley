import PlayerTag from "@/components/ui/PlayerTag";
import Button from "@/components/ui/Button";

export default function FriendRequestItem({
  displayName,
  discriminator,
  onAccept,
  onDecline,
}: {
  displayName: string;
  discriminator: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-2 border-ink/20 bg-brand-blue-light px-3 py-2 animate-pop-in">
      <div className="min-w-0 flex-1">
        <PlayerTag displayName={displayName} discriminator={discriminator} />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button variant="secondary" fullWidth={false} onClick={onAccept} className="shrink-0 !px-2 !py-1 !text-xs">
          Accept
        </Button>
        <Button variant="outline" fullWidth={false} onClick={onDecline} className="shrink-0 !px-2 !py-1 !text-xs">
          Decline
        </Button>
      </div>
    </div>
  );
}
