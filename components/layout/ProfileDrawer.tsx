import type { Profile } from "@/lib/hooks/useProfile";
import { useRouter } from "next/navigation";

export default function ProfileDrawer({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  const router = useRouter();

  function goToSettings() {
    onClose();
    router.push("/settings");
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="fixed sm:absolute left-4 right-4 sm:left-4 sm:right-auto top-16 sm:top-full sm:mt-2 z-40 sm:w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-slate-900 shadow-2xl p-4 space-y-3">
        <p className="text-sm">
          <span className="font-semibold text-white">{profile.display_name}</span>
          <span className="text-slate-500">#{profile.discriminator}</span>
        </p>
        <button
          onClick={goToSettings}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
        >
          Settings
        </button>
      </div>
    </>
  );
}