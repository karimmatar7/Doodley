export default function GameScreen({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`relative min-h-screen overflow-x-hidden bg-paper px-4 py-8 ${className}`}>
      {children}
    </main>
  );
}
