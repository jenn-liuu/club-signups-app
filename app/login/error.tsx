"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-shell page-shell--narrow">
      <h1 className="page-title">Officer login could not load</h1>
      <p role="alert" className="state-card state-card--error page-spacer">
        Unable to load officer login: {error.message}
      </p>
      <button type="button" onClick={reset} className="primary-button page-spacer">
        Try again
      </button>
    </main>
  );
}
