export default function Loading() {
  return (
    <main className="page-shell" aria-busy="true">
      <p role="status" className="state-card">
        Loading upcoming events...
      </p>
    </main>
  );
}
