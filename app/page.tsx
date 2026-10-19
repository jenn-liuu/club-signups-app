const events = [
  {
    title: "Club Kickoff",
    date: "Friday, October 23",
    location: "Student Center",
  },
  {
    title: "Game Night",
    date: "Tuesday, October 27",
    location: "Room 204",
  },
  {
    title: "Volunteer Day",
    date: "Saturday, October 31",
    location: "Community Garden",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Club Sign-ups</h1>
        <p className="mt-2 text-gray-600">Find a club and sign up.</p>
      </header>

      <section aria-labelledby="upcoming-events-heading">
        <h2 id="upcoming-events-heading" className="mb-4 text-lg font-semibold">
          Upcoming events
        </h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-xl font-bold tracking-tight">{event.title}</h3>
              <p className="mt-2 text-gray-700">{event.date}</p>
              <p className="mt-1 text-gray-600">{event.location}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
