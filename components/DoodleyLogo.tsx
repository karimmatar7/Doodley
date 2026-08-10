export default function DoodleyLogo({ size = "text-3xl" }: { size?: string }) {
  return (
    <h1 className={`${size} font-extrabold tracking-tight`}>
      <span className="text-brand-maroon">Doodl</span>
      <span className="text-brand-green">ey</span>
    </h1>
  );
}