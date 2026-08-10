export default function PlayerTag({
  displayName,
  discriminator,
}: {
  displayName: string;
  discriminator: string;
}) {
  return (
    <p className="text-sm">
      <span className="font-semibold text-white">{displayName}</span>
      <span className="text-slate-500">#{discriminator}</span>
    </p>
  );
}