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
  primary: "bg-brand-maroon text-cream hover:bg-brand-maroon-light",
  secondary: "bg-brand-green text-cream hover:bg-brand-green-light",
  outline: "bg-paper-light text-ink hover:bg-paper-dark",
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
        sketch-btn
        ${fullWidth ? "w-full" : "w-auto"}
        ${variants[variant]}
        ${className}
        px-6 py-3 text-sm sm:text-base font-bold tracking-wide
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
}
