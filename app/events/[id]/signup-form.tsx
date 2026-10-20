"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { validateSignup } from "@/lib/validate";

type SignupFormProps = {
  eventId: string;
};

export default function SignupForm({ eventId }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateSignup(name, email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: insertError } = await createClient()
        .from("signups")
        .insert({
          event_id: eventId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("This email is already signed up for this event.");
        } else {
          setError(`Unable to sign you up: ${insertError.message}`);
        }
        return;
      }

      setMessage("You’re signed up! We look forward to seeing you there.");
      setName("");
      setEmail("");
    } catch (submitError) {
      setError(
        `Unable to sign you up: ${
          submitError instanceof Error
            ? submitError.message
            : String(submitError)
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div>
        <label htmlFor="signup-name" className="field-label">
          Name
        </label>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="field-input"
        />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="field-label"
        >
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field-input"
        />
      </div>

      {error && (
        <p role="alert" className="feedback-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="feedback-success">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="primary-button"
      >
        {isSubmitting ? "Signing you up..." : "Sign up for this event"}
      </button>
    </form>
  );
}
