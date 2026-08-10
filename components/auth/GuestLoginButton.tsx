"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function GuestLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleGuestLogin() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/lobby");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" onClick={handleGuestLogin} disabled={loading}>
        {loading ? "Loading..." : "Play as guest"}
      </Button>
      <ErrorMessage message={error} />
    </div>
  );
}