export default function PlayerTag({
  displayName,
  discriminator,
}: {
  displayName: string;
  discriminator: string;
}) {
  return (
    <p className="truncate font-hand text-sm">
      <span className="font-bold text-ink">{displayName}</span>
      <span className="text-ink-soft">#{discriminator}</span>
    </p>
  );
}
