import DoodleyLogo from "@/components/DoodleyLogo";

export default function AuthCard({
  subtitle,
  children,
}: {
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-slate-950 bg-grid flex items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-8">
        <div className="flex justify-center mb-4">
          <DoodleyLogo />
        </div>
        <p className="text-slate-400 mb-6 text-sm text-center">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}