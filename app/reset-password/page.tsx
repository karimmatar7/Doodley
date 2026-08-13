"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/validation/password";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PasswordHint from "@/components/ui/PasswordHint";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { valid, errors } = validatePassword(password);
    if (!valid) {
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/lobby");
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <AuthCard subtitle="">
        <p className="text-center font-hand text-sm text-brand-green">
          Password updated! Taking you to the lobby...
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard subtitle="Choose a new password.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput label="New password" required minLength={8} value={password} onChange={setPassword} />
        <PasswordHint password={password} />
        <ErrorMessage message={error} />
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}