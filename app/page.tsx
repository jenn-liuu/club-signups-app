import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const eventDateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const instant = false;

export default async function Home() {
  let events: {
    id: string;
    title: string;
    date: string;
    location: string | null;
    description: string | null;
  }[] = [];
  let loadError: string | null = null;

  try {
    const supabase = await createClient();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const result = await supabase
      .from("events")
      .select("id, title, date, location, description")
      .gte("date", today.toISOString())
      .order("date", { ascending: true });

    if (result.error) {
      loadError = `Unable to load events: ${result.error.message}`;
    } else {
      events = result.data ?? [];
    }
  } catch (error) {
    loadError = `Unable to load events: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Club community
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
          Club events
        </h1>
        <p className="mt-3 text-gray-600">
          Find your next event and save your spot.
        </p>
      </header>

      <section aria-labelledby="upcoming-events-heading">
        <h2
          id="upcoming-events-heading"
          className="mb-4 text-xl font-semibold text-gray-900"
        >
          Upcoming events
        </h2>

        {loadError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {loadError}
          </p>
        ) : events?.length ? (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <h3 className="text-xl font-bold tracking-tight text-gray-950">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-gray-700">
                    {eventDateFormatter.format(new Date(event.date))}
                  </p>
                  {event.location && (
                    <p className="mt-1 text-gray-600">{event.location}</p>
                  )}
                  {event.description && (
                    <p className="mt-3 line-clamp-2 text-gray-600">
                      {event.description}
                    </p>
                  )}
                  <span className="mt-4 inline-block font-semibold text-blue-700">
                    View event & sign up <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-white p-5 text-gray-600">
            There are no upcoming events right now. Please check back soon.
          </p>
        )}
      </section>
    </main>
  );
}
