import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignupForm from "./signup-form";

const eventDateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type EventPageProps = {
  params: Promise<{ id: string }>;
};

type PublicEvent = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
};

export const instant = false;

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  let event: PublicEvent | null = null;
  let loadError: string | null = null;

  try {
    const supabase = await createClient();
    const result = await supabase
      .from("events")
      .select("id, title, date, location, description")
      .eq("id", id)
      .maybeSingle();

    if (result.error) {
      loadError = `Unable to load this event: ${result.error.message}`;
    } else {
      event = result.data;
    }
  } catch (error) {
    loadError = `Unable to load this event: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }

  if (loadError) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:py-12">
        <Link href="/" className="font-medium text-blue-700 hover:underline">
          ← All events
        </Link>
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {loadError}
        </p>
      </main>
    );
  }

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:py-12">
      <Link href="/" className="font-medium text-blue-700 hover:underline">
        ← All events
      </Link>

      <article className="mt-6">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950">
            {event.title}
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            {eventDateFormatter.format(new Date(event.date))}
          </p>
          {event.location && (
            <p className="mt-1 text-gray-600">{event.location}</p>
          )}
        </header>

        {event.description && (
          <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-700">
            {event.description}
          </p>
        )}

        <section
          aria-labelledby="signup-heading"
          className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 id="signup-heading" className="mb-5 text-xl font-semibold">
            Save your spot
          </h2>
          <SignupForm eventId={event.id} />
        </section>
      </article>
    </main>
  );
}
