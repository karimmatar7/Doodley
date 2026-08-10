"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/validation/password";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
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
        <h2 className="text-xl font-bold text-emerald-400 mb-2 text-center">Almost there!</h2>
        <p className="text-slate-400 text-sm text-center">
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
        <Input label="Password" type="password" required minLength={8} value={password} onChange={setPassword} />
        <PasswordHint password={password} />
        <ErrorMessage message={error} />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign up"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <GuestLoginButton />

      <p className="text-sm text-slate-500 mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-brand-maroon font-medium hover:underline">
          Log in here
        </a>
      </p>
    </AuthCard>
  );
}