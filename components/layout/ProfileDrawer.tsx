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
      <div className="sketch-card fixed left-4 right-4 top-16 z-40 space-y-3 p-4 sm:absolute sm:left-4 sm:right-auto sm:top-full sm:mt-2 sm:w-72 sm:max-w-[calc(100vw-2rem)]">
        <div className="tape tape-tr" />
        <p className="font-hand text-sm">
          <span className="font-bold text-ink">{profile.display_name}</span>
          <span className="text-ink-soft">#{profile.discriminator}</span>
        </p>
        <button
          onClick={goToSettings}
          className="chip-btn w-full bg-paper-dark px-4 py-2 text-sm font-bold text-ink hover:bg-brand-blue-light"
        >
          Settings
        </button>
      </div>
    </>
  );
}
