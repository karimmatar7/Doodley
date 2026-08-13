"use client";

type SettingsSectionProps = {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function SettingsSection({
  label,
  open,
  onToggle,
  children,
}: SettingsSectionProps) {
  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="link-btn text-sm"
      >
        {open ? `Hide ${label.toLowerCase()}` : label}
      </button>

      {open && children}
    </section>
  );
}