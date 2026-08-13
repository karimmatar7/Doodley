"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/validation/password";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PasswordHint from "@/components/ui/PasswordHint";
import GuestLoginButton from "@/components/auth/GuestLoginButton";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { valid, errors } = validatePassword(password);
    if (!valid) {
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/lobby");
      router.refresh();
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard subtitle="">
        <h2 className="mb-2 text-center text-xl font-bold text-brand-green">
          Almost there!
        </h2>
        <p className="text-center font-hand text-sm text-ink-soft">
          Check your inbox and confirm your email address to log in.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard subtitle="Create an account to draw and guess.">
      <form onSubmit={handleSignup} className="space-y-3">
        <Input label="Player name" required maxLength={20} value={displayName} onChange={setDisplayName} />
        <Input label="Email" type="email" required value={email} onChange={setEmail} />
        <PasswordInput label="Password" required minLength={8} value={password} onChange={setPassword} />
        <PasswordHint password={password} />
        <ErrorMessage message={error} />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign up"}
        </Button>
      </form>

      <div className="divider my-4" />

      <GuestLoginButton />

      <p className="mt-4 text-center font-hand text-sm text-ink-soft">
        Already have an account?{" "}
        <a href="/login" className="link-btn text-sm">
          Log in here
        </a>
      </p>
    </AuthCard>
  );
}
