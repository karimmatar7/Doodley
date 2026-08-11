"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/lib/hooks/useProfile";
import { validatePassword } from "@/lib/validation/password";

import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PasswordHint from "@/components/ui/PasswordHint";
import SettingsSection from "@/components/settings/SettingsSection";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const {
    profile,
    loading: profileLoading,
  } = useProfile();

  const [displayName, setDisplayName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showNameField, setShowNameField] = useState(false);
  const [showPasswordField, setShowPasswordField] =
    useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
    }
  }, [profile]);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  function toggleNameField() {
    clearMessages();
    setShowNameField((value) => !value);
  }

  function togglePasswordField() {
    clearMessages();
    setShowPasswordField((value) => !value);
  }

  function clearPasswordFields() {
    setOldPassword("");
    setNewPassword("");
  }

  async function verifyCurrentPassword() {
    if (!showPasswordField) {
      return;
    }

    if (!oldPassword) {
      throw new Error("Enter your current password.");
    }

    if (!newPassword) {
      throw new Error("Enter a new password.");
    }

    const {
      valid,
      errors,
    } = validatePassword(newPassword);

    if (!valid) {
      throw new Error(errors.join(", "));
    }

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !userData.user?.email) {
      throw new Error(
        "Could not verify your account email."
      );
    }

    const {
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: oldPassword,
    });

    if (signInError) {
      throw new Error(
        "Your current password is incorrect."
      );
    }
  }

  async function updateDisplayName() {
    if (!profile || !showNameField) {
      return;
    }

    const nextName = displayName.trim();

    if (!nextName) {
      throw new Error("Player name is required.");
    }

    if (nextName.length > 20) {
      throw new Error(
        "Player name must be 20 characters or fewer."
      );
    }

    if (nextName === profile.display_name) {
      return;
    }

    const {
      data: updatedProfile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .update({
        display_name: nextName,
      })
      .eq("id", profile.id)
      .select("id, display_name")
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!updatedProfile) {
      throw new Error(
        "Your name was not changed. Check your profile permissions."
      );
    }

    setDisplayName(updatedProfile.display_name);
  }

  async function updatePassword() {
    if (!showPasswordField) {
      return;
    }

    const {
      error: passwordError,
    } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      throw new Error(passwordError.message);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile || loading) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await verifyCurrentPassword();
      await updateDisplayName();
      await updatePassword();

      setSuccess("Settings updated successfully.");
      setShowNameField(false);
      setShowPasswordField(false);
      clearPasswordFields();

      router.refresh();
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Could not update settings.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (profileLoading) {
    return (
      <AuthCard subtitle="Profile and security settings.">
        <p className="text-sm text-slate-400">
          Loading settings...
        </p>
      </AuthCard>
    );
  }

  if (!profile) {
    return (
      <AuthCard subtitle="Profile and security settings.">
        <p className="text-sm text-slate-400">
          Please log in to manage your settings.
        </p>
      </AuthCard>
    );
  }

  const hasChanges =
    showNameField || showPasswordField;

  return (
    <AuthCard subtitle="Profile and security settings.">
      <div className="mb-6">
        <BackButton />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <SettingsSection
          label="Change name"
          open={showNameField}
          onToggle={toggleNameField}
        >
          <Input
            label="Player name"
            required
            maxLength={20}
            value={displayName}
            onChange={setDisplayName}
          />
        </SettingsSection>

        <SettingsSection
          label="Change password"
          open={showPasswordField}
          onToggle={togglePasswordField}
        >
          <div className="space-y-4">
            <Input
              label="Current password"
              type="password"
              required
              value={oldPassword}
              onChange={setOldPassword}
            />

            <Input
              label="New password"
              type="password"
              required
              value={newPassword}
              onChange={setNewPassword}
            />

            <PasswordHint password={newPassword} />
          </div>
        </SettingsSection>

        <ErrorMessage message={error} />

        {success && (
          <p className="text-sm text-emerald-400">
            {success}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !hasChanges}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </AuthCard>
  );
}