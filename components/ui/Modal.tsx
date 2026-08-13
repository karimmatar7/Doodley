"use client";

export default function Modal({
  onClose,
  ariaLabel,
  children,
  className = "",
}: {
  onClose?: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className={`sketch-card w-full max-w-md animate-pop-in p-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
