import { validatePassword } from "@/lib/validation/password";

export default function PasswordHint({ password }: { password: string }) {
  if (!password) return null;
  const { errors } = validatePassword(password);
  if (errors.length === 0) {
    return <p className="text-xs font-hand text-brand-green">Password meets all requirements ✓</p>;
  }
  return (
    <ul className="space-y-0.5 text-xs font-hand text-ink-soft">
      {errors.map((err) => (
        <li key={err}>• {err}</li>
      ))}
    </ul>
  );
}
