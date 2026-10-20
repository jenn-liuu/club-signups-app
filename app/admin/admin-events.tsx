"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Signup = {
  id: string;
  name: string;
  email: string;
  attended: boolean;
};

export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  signups: Signup[];
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function AdminEvents({
  initialEvents,
}: {
  initialEvents: AdminEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState("");
  const [actionError, setActionError] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [pendingSignups, setPendingSignups] = useState<string[]>([]);

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError("");
    setIsCreating(true);

    try {
      const { data, error } = await createClient()
        .from("events")
        .insert({
          title: title.trim(),
          date: new Date(`${date}T00:00:00`).toISOString(),
          location: location.trim() || null,
          description: description.trim() || null,
        })
        .select("id, title, date, location, description")
        .single();

      if (error) {
        setCreateError(error.message);
        return;
      }

      setEvents((currentEvents) =>
        [...currentEvents, { ...data, signups: [] }].sort(
          (left, right) => left.date.localeCompare(right.date),
        ),
      );
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
    } catch (error) {
      setCreateError(errorMessage(error));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteEvent(eventToDelete: AdminEvent) {
    if (!window.confirm(`Delete event "${eventToDelete.title}"?`)) {
      return;
    }

    setActionError("");
    try {
      const { data, error } = await createClient()
        .from("events")
        .delete()
        .eq("id", eventToDelete.id)
        .select("id");

      if (error) {
        setActionError(error.message);
        return;
      }
      if (!data.length) {
        setActionError("The event was not deleted.");
        return;
      }

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventToDelete.id),
      );
    } catch (error) {
      setActionError(errorMessage(error));
    }
  }

  async function handleAttendanceChange(
    signup: Signup,
    checked: boolean,
    eventId: string,
  ) {
    setSignupErrors((current) => {
      const next = { ...current };
      delete next[signup.id];
      return next;
    });
    setPendingSignups((current) => [...current, signup.id]);
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              signups: event.signups.map((currentSignup) =>
                currentSignup.id === signup.id
                  ? { ...currentSignup, attended: checked }
                  : currentSignup,
              ),
            }
          : event,
      ),
    );

    try {
      const { data, error } = await createClient()
        .from("signups")
        .update({ attended: checked })
        .eq("id", signup.id)
        .select("id");

      if (error) {
        throw error;
      }
      if (!data.length) {
        throw new Error("The attendance update did not affect a signup.");
      }
    } catch (error) {
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                signups: event.signups.map((currentSignup) =>
                  currentSignup.id === signup.id
                    ? { ...currentSignup, attended: signup.attended }
                    : currentSignup,
                ),
              }
            : event,
        ),
      );
      setSignupErrors((current) => ({
        ...current,
        [signup.id]: errorMessage(error),
      }));
    } finally {
      setPendingSignups((current) =>
        current.filter((id) => id !== signup.id),
      );
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Create event</h2>
        <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
          <div>
            <label htmlFor="event-title" className="mb-1 block text-sm font-medium">
              Title
            </label>
            <input
              id="event-title"
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </div>
          <div>
            <label htmlFor="event-date" className="mb-1 block text-sm font-medium">
              Date
            </label>
            <input
              id="event-date"
              name="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="event-location"
              className="mb-1 block text-sm font-medium"
            >
              Location
            </label>
            <input
              id="event-location"
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="event-description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="event-description"
              name="description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </div>
          {createError && (
            <p role="alert" className="text-sm text-red-700">
              Unable to create event: {createError}
            </p>
          )}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            Create event
          </button>
        </form>
      </section>

      <section aria-labelledby="my-events-heading">
        <h2 id="my-events-heading" className="mb-4 text-lg font-semibold">
          My events
        </h2>
        {actionError && (
          <p role="alert" className="mb-4 text-sm text-red-700">
            {actionError}
          </p>
        )}
        {events.length === 0 ? (
          <p className="text-gray-600">You have no events yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold tracking-tight">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-gray-700">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.location && (
                      <p className="mt-1 text-gray-600">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-3 whitespace-pre-wrap text-gray-700">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(event)}
                    className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                  >
                    Delete event
                  </button>
                </div>

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <h4 className="font-semibold">
                    Sign-ups ({event.signups.length})
                  </h4>
                  {event.signups.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-600">No sign-ups yet.</p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {event.signups.map((signup) => (
                        <li
                          key={signup.id}
                          className="flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="font-medium">{signup.name}</p>
                            <p className="break-all text-sm text-gray-600">
                              {signup.email}
                            </p>
                          </div>
                          <label className="flex shrink-0 items-center gap-2">
                            <input
                              type="checkbox"
                              checked={signup.attended}
                              disabled={pendingSignups.includes(signup.id)}
                              onChange={(change) =>
                                handleAttendanceChange(
                                  signup,
                                  change.target.checked,
                                  event.id,
                                )
                              }
                              className="size-5"
                            />
                            Attended
                          </label>
                          {signupErrors[signup.id] && (
                            <p
                              role="alert"
                              className="w-full text-sm text-red-700"
                            >
                              Unable to update attendance:{" "}
                              {signupErrors[signup.id]}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
