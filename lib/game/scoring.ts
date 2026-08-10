export function calculatePoints(
  timeRemainingSeconds: number,
  totalSeconds: number,
  minPoints = 20,
  maxPoints = 100
): number {
  const clamped = Math.max(0, Math.min(timeRemainingSeconds, totalSeconds));
  const ratio = totalSeconds > 0 ? clamped / totalSeconds : 0;
  return Math.round(minPoints + (maxPoints - minPoints) * ratio);
}