export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-brand-maroon bg-red-50 border border-brand-maroon/20 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}