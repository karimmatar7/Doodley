import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DoodleyLogo from "@/components/DoodleyLogo";
import Button from "@/components/ui/Button";
import GameScreen from "@/components/ui/GameScreen";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/lobby");
  }

  return (
    <GameScreen className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <DoodleyLogo size="text-5xl sm:text-6xl" />
        <p className="max-w-sm font-hand text-sm text-ink-soft sm:text-base">
          Draw, guess, and score points in real time with friends.
        </p>
        <div className="flex w-full max-w-xs flex-col gap-4">
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">Sign up</Button>
          </Link>
        </div>
      </div>
    </GameScreen>
  );
}
