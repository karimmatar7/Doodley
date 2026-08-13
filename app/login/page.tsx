"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
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
            <p className="text-sm font-hand text-brand-green">
              Check your inbox for a link to reset your password.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setResetSent(false);
              }}
              className="link-btn text-sm"
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
              className="link-btn w-full text-center text-sm"
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
        <PasswordInput label="Password" required value={password} onChange={setPassword} />

        <div className="-mt-1 flex justify-end">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="link-btn text-xs"
          >
            Forgot password?
          </button>
        </div>

        <ErrorMessage message={error} />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Log in"}
        </Button>
      </form>

      <div className="divider my-4" />

      <GuestLoginButton />

      <p className="mt-4 text-center font-hand text-sm text-ink-soft">
        No account yet?{" "}
        <a href="/signup" className="link-btn text-sm">
          Sign up here
        </a>
      </p>
    </AuthCard>
  );
}
