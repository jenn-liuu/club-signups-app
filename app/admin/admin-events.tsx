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
    <div className="admin-stack">
      <section className="panel">
        <h2 className="panel-heading">Create event</h2>
        <form onSubmit={handleCreateEvent} className="form-stack">
          <div>
            <label htmlFor="event-title" className="field-label">
              Title
            </label>
            <input
              id="event-title"
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="event-date" className="field-label">
              Date
            </label>
            <input
              id="event-date"
              name="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label
              htmlFor="event-location"
              className="field-label"
            >
              Location
            </label>
            <input
              id="event-location"
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label
              htmlFor="event-description"
              className="field-label"
            >
              Description
            </label>
            <textarea
              id="event-description"
              name="description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="field-input"
            />
          </div>
          {createError && (
            <p role="alert" className="feedback-error">
              Unable to create event: {createError}
            </p>
          )}
          <button
            type="submit"
            disabled={isCreating}
            className="primary-button"
          >
            {isCreating ? "Creating event..." : "Create event"}
          </button>
        </form>
      </section>

      <section aria-labelledby="my-events-heading">
        <h2 id="my-events-heading" className="section-title">
          My events
        </h2>
        {actionError && (
          <p role="alert" className="state-card state-card--error">
            {actionError}
          </p>
        )}
        {events.length === 0 ? (
          <p className="state-card">No events yet. Create one above.</p>
        ) : (
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.id} className="event-card admin-event">
                <div className="admin-event-heading">
                  <div className="admin-event-content">
                    <h3 className="event-title">
                      {event.title}
                    </h3>
                    <p className="event-meta">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.location && (
                      <p className="event-meta">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="event-description">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(event)}
                    className="secondary-button"
                  >
                    Delete event
                  </button>
                </div>

                <div className="signup-section">
                  <h4 className="signup-heading">
                    Sign-ups ({event.signups.length})
                  </h4>
                  {event.signups.length === 0 ? (
                    <p className="event-meta">No sign-ups yet.</p>
                  ) : (
                    <ul className="signup-list">
                      {event.signups.map((signup) => (
                        <li key={signup.id} className="signup-row">
                          <div>
                            <p className="signup-name">{signup.name}</p>
                            <p className="signup-email">
                              {signup.email}
                            </p>
                          </div>
                          <label className="attendance-label">
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
                              className="attendance-checkbox"
                            />
                            Attended
                          </label>
                          {signupErrors[signup.id] && (
                            <p
                              role="alert"
                              className="feedback-error"
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
