"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-shell">
      <h1 className="page-title">Event could not load</h1>
      <p role="alert" className="state-card state-card--error page-spacer">
        Unable to load this event: {error.message}
      </p>
      <button type="button" onClick={reset} className="primary-button page-spacer">
        Try again
      </button>
    </main>
  );
}
