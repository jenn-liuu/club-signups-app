export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email);
}

export function validateSignup(name: string, email: string): string | null {
  if (!name.trim()) {
    return "Please enter your name.";
  }

  if (!validateEmail(email.trim())) {
    return "Please enter a valid email address.";
  }

  return null;
}
