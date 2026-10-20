"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const result =
        mode === "sign-in"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (mode === "sign-up" && !result.data.session) {
        setMessage("Check your email for a confirmation link to finish signing up.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (authError) {
      setError(
        authError instanceof Error ? authError.message : String(authError),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  return (
    <div className="page-spacer">
      <div className="mode-switch">
        <button
          type="button"
          aria-pressed={mode === "sign-in"}
          onClick={() => changeMode("sign-in")}
          className="mode-button"
        >
          Sign in
        </button>
        <button
          type="button"
          aria-pressed={mode === "sign-up"}
          onClick={() => changeMode("sign-up")}
          className="mode-button"
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-stack">
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          {isSubmitting
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
