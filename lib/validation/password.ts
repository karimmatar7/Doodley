export type PasswordCheck = {
  valid: boolean;
  errors: string[];
};

export function validatePassword(password: string): PasswordCheck {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Minimum 8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least 1 lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least 1 uppercase letter");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
    errors.push("At least 1 special character");
  }

  return { valid: errors.length === 0, errors };
}