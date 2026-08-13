export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="animate-wobble border-2 border-dashed border-brand-maroon bg-brand-maroon/5 px-3 py-2 text-sm font-hand text-brand-maroon"
    >
      {message}
    </p>
  );
}
