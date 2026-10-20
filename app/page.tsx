import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const eventDateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const eventDayFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
});

const eventMonthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
});

const eventWeekdayFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
});

const eventTimeFormatter = new Intl.DateTimeFormat("en", {
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
    <main className="page-shell">
      <header className="page-header home-header">
        <p className="eyebrow">Club calendar</p>
        <h1 className="page-title home-page-title">Upcoming events</h1>
        <p className="home-intro">
          Find an event, check the details, and sign up.
        </p>
      </header>

      <section aria-labelledby="upcoming-events-heading">
        <h2 id="upcoming-events-heading" className="home-section-heading">
          Dates &amp; details
        </h2>

        {loadError ? (
          <p role="alert" className="state-card state-card--error">
            {loadError}
          </p>
        ) : events?.length ? (
          <ul className="home-event-list">
            {events.map((event) => {
              const eventDate = new Date(event.date);

              return (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className="home-event-link"
                    aria-label={`${event.title}, ${eventDateFormatter.format(eventDate)}${event.location ? `, ${event.location}` : ""}. Event details and sign-up`}
                  >
                    <time
                      className="home-date"
                      dateTime={event.date}
                      aria-hidden="true"
                    >
                      <span className="home-date-weekday">
                        {eventWeekdayFormatter.format(eventDate)}
                      </span>
                      <span className="home-date-day">
                        {eventDayFormatter.format(eventDate)}
                      </span>
                      <span className="home-date-month">
                        {eventMonthFormatter.format(eventDate)}
                      </span>
                    </time>
                    <span className="home-event-copy">
                      <span className="home-event-title">{event.title}</span>
                      <span className="home-event-details">
                        {eventTimeFormatter.format(eventDate)}
                        {event.location && <> · {event.location}</>}
                      </span>
                      {event.description && (
                        <span className="home-event-description">
                          {event.description}
                        </span>
                      )}
                      <span className="home-event-action">
                        Event details &amp; sign-up{" "}
                        <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="state-card">No events yet. Check back later.</p>
        )}
      </section>
    </main>
  );
}
