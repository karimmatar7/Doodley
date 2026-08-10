"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/hooks/useProfile";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PasswordHint from "@/components/ui/PasswordHint";
import { validatePassword } from "@/lib/validation/password";

export default function SettingsPage() {
  const { profile } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showNameField, setShowNameField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (showNameField && displayName && profile) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("id", profile.id);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    if (showPasswordField && password) {
      const { valid, errors } = validatePassword(password);
      if (!valid) {
        setError(errors.join(", "));
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.updateUser({ password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess("Settings updated.");
    setLoading(false);
    router.refresh();
    setShowNameField(false);
    setShowPasswordField(false);
    setPassword("");
  }

 return (
  <AuthCard subtitle="Profile and security settings.">
    <div className="mb-6">
      <BackButton />
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowNameField((value) => !value)}
          className="text-sm font-medium text-emerald-400 hover:underline"
        >
          {showNameField ? "Hide name change?" : "Change name?"}
        </button>

        {showNameField && (
          <Input
            label="Player name"
            required
            maxLength={20}
            value={displayName}
            onChange={setDisplayName}
          />
        )}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowPasswordField((value) => !value)}
          className="text-sm font-medium text-emerald-400 hover:underline"
        >
          {showPasswordField ? "Hide password change?" : "Change password?"}
        </button>

        {showPasswordField && (
          <>
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <PasswordHint password={password} />
          </>
        )}
      </div>

      <ErrorMessage message={error} />

      {success && (
        <p className="text-sm text-emerald-400">{success}</p>
      )}

      <Button
        type="submit"
        disabled={loading || (!showNameField && !showPasswordField)}
      >
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  </AuthCard>
);
}