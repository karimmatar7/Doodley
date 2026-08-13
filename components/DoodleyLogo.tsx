export default function DoodleyLogo({ size = "text-3xl" }: { size?: string }) {
  return (
    <div className={`relative inline-block ${size} font-marker font-bold`}>
      <span className="inline-block -rotate-2">
        <span className="text-brand-maroon">Doodl</span>
        <span className="text-brand-green">ey</span>
      </span>
      <svg
        className="absolute inset-x-0 -bottom-1 h-[0.2em] w-full text-brand-maroon"
        viewBox="0 0 120 10"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 6 Q 12 -2, 24 5 T 48 6 T 72 5 T 96 6 T 118 5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
