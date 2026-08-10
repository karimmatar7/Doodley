"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import GuestLoginButton from "@/components/auth/GuestLoginButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/lobby");
    router.refresh();
  }

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setResetError(error.message);
      setResetLoading(false);
      return;
    }

    setResetSent(true);
    setResetLoading(false);
  }

  if (showForgot) {
    return (
      <AuthCard subtitle="Reset your password.">
        {resetSent ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-emerald-400">
              Check your inbox for a link to reset your password.
            </p>
            <button
              onClick={() => {
                setShowForgot(false);
                setResetSent(false);
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Back to log in
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <Input label="Email" type="email" required value={resetEmail} onChange={setResetEmail} />
            <ErrorMessage message={resetError} />
            <Button type="submit" disabled={resetLoading}>
              {resetLoading ? "Sending..." : "Send reset link"}
            </Button>
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-sm text-slate-400 hover:text-white transition-colors text-center"
            >
              Back to log in
            </button>
          </form>
        )}
      </AuthCard>
    );
  }

  return (
    <AuthCard subtitle="Log in to draw and guess.">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input label="Email" type="email" required value={email} onChange={setEmail} />
        <Input label="Password" type="password" required value={password} onChange={setPassword} />

        <div className="flex justify-end -mt-1">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <ErrorMessage message={error} />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Log in"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <GuestLoginButton />

      <p className="text-sm text-slate-500 mt-4 text-center">
        No account yet?{" "}
        <a href="/signup" className="text-emerald-400 font-medium hover:underline">
          Sign up here
        </a>
      </p>
    </AuthCard>
  );
}