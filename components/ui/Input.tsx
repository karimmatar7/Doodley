"use client";

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  hideLabel?: boolean;
  type?: string;
  variant?: "default" | "code";
};

export default function Input({
  label,
  value,
  onChange,
  required = false,
  maxLength,
  minLength,
  hideLabel = false,
  type = "text",
  variant = "default",
}: InputProps) {
  const isCode = variant === "code";

  return (
    <label className="block w-full">
      {!hideLabel && (
        <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
          {label}
        </span>
      )}
      <input
        type={type}
        value={value}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        onChange={(e) => onChange(isCode ? e.target.value.toUpperCase() : e.target.value)}
        placeholder={hideLabel ? label : undefined}
        aria-label={label}
        className={`
          w-full bg-transparent border-0 border-b-2 border-white/15
          text-white placeholder-slate-500 outline-none py-2
          focus:border-white transition-colors duration-200
          ${isCode ? "text-lg font-medium tracking-widest text-center" : "text-sm sm:text-base text-left"}
        `}
      />
    </label>
  );
}