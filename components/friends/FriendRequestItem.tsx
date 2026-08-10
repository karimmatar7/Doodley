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
    <div className="flex items-center justify-between bg-brand-blue-light rounded-lg px-4 py-2 animate-pop-in">
      <PlayerTag displayName={displayName} discriminator={discriminator} />
      <div className="flex gap-2">
        <Button variant="secondary" fullWidth={false} onClick={onAccept}>
          Accept
        </Button>
        <Button variant="outline" fullWidth={false} onClick={onDecline}>
          Decline
        </Button>
      </div>
    </div>
  );
}