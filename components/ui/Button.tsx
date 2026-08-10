"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-brand-maroon text-white hover:bg-brand-maroon/90 border border-brand-maroon/50",
  secondary:
    "bg-emerald-700 text-white hover:bg-emerald-700/90 border border-emerald-700/50",
  outline:
    "bg-white/5 text-white/90 border border-white/15 hover:bg-white/10 hover:border-white/25",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = true,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : "w-auto"}
        ${variants[variant]}
        ${className}
        px-6 py-3 rounded-lg font-medium text-sm sm:text-base
        transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
}