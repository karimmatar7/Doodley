import { validatePassword } from "@/lib/validation/password";

export default function PasswordHint({ password }: { password: string }) {
  if (!password) return null;
  const { errors } = validatePassword(password);
  if (errors.length === 0) {
    return <p className="text-xs text-emerald-400">Password meets all requirements ✓</p>;
  }
  return (
    <ul className="text-xs text-slate-500 space-y-0.5">
      {errors.map((err) => (
        <li key={err}>• {err}</li>
      ))}
    </ul>
  );
}