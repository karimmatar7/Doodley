"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  display_name: string;
  discriminator: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, discriminator")
        .eq("id", userData.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    load();
  }, [supabase]);

  return { profile, loading };
}