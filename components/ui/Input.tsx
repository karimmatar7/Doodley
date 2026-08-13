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
      {!hideLabel && <span className="label mb-1.5 block">{label}</span>}
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
          w-full bg-transparent ink-underline
          text-ink placeholder-ink-soft outline-none py-2
          ${isCode
            ? "text-2xl sm:text-3xl font-bold tracking-widest text-center uppercase"
            : "text-sm sm:text-base text-left font-hand"}
        `}
      />
    </label>
  );
}
