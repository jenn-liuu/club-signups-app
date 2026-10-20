"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const result = await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setError(result.error.message);
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
  
  return (
    <div className="page-spacer">
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
            autoComplete="current-password"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button"
        >
          {isSubmitting ? "Please wait..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
  