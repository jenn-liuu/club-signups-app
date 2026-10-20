import Link from "next/link";

export default function EventNotFound() {
  return (
    <main className="page-shell">
      <h1 className="page-title">
        Event not found
      </h1>
      <p className="account-note">
        This event may have been removed or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="text-link page-spacer"
      >
        Browse upcoming events
      </Link>
    </main>
  );
}
