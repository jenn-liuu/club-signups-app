type AuthVerificationError = {
  name: string;
  status?: number;
};

export function isUnauthenticatedError(
  error: AuthVerificationError | null,
): boolean {
  return (
    !error ||
    error.name === "AuthSessionMissingError" ||
    error.status === 400 ||
    error.status === 401 ||
    error.status === 403
  );
}
