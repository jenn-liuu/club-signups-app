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
      <main className="page-shell">
        <Link href="/" className="text-link">
          ← All events
        </Link>
        <p role="alert" className="state-card state-card--error page-spacer">
          {loadError}
        </p>
      </main>
    );
  }

  if (!event) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Link href="/" className="text-link">
        ← All events
      </Link>

      <article className="page-spacer">
        <header>
          <h1 className="page-title">
            {event.title}
          </h1>
          <p className="event-meta">
            {eventDateFormatter.format(new Date(event.date))}
          </p>
          {event.location && (
            <p className="event-meta">{event.location}</p>
          )}
        </header>

        {event.description && (
          <p className="event-description">
            {event.description}
          </p>
        )}

        <section
          aria-labelledby="signup-heading"
          className="panel page-spacer"
        >
          <h2 id="signup-heading" className="panel-heading">
            Save your spot
          </h2>
          <SignupForm eventId={event.id} />
        </section>
      </article>
    </main>
  );
}
