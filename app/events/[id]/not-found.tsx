import Link from "next/link";

export default function EventNotFound() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-950">
        Event not found
      </h1>
      <p className="mt-3 text-gray-600">
        This event may have been removed or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
      >
        Browse upcoming events
      </Link>
    </main>
  );
}
