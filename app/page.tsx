import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DoodleyLogo from "@/components/DoodleyLogo";
import Button from "@/components/ui/Button";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/lobby");
  }

  return (
    <main className="relative min-h-screen bg-slate-950 bg-grid flex flex-col items-center justify-center px-4 gap-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <DoodleyLogo size="text-5xl sm:text-6xl" />
        <p className="text-slate-400 text-sm sm:text-base max-w-sm">
          Draw, guess, and score points in real time with friends.
        </p>
        <div className="w-full max-w-xs flex flex-col gap-4">
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">Sign up</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}