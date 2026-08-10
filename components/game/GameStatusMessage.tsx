type GameStatusMessageProps = {
  children: React.ReactNode;
};

export default function GameStatusMessage({
  children,
}: GameStatusMessageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 bg-grid">
      <p className="text-sm text-slate-400">
        {children}
      </p>
    </main>
  );
}