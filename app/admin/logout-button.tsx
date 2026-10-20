"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setError("");
    setIsLoggingOut(true);

    try {
      const { error: signOutError } = await createClient().auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (authError) {
      setError(
        authError instanceof Error ? authError.message : String(authError),
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="secondary-button"
      >
        {isLoggingOut ? "Signing out..." : "Log out"}
      </button>
      {error && (
        <p role="alert" className="feedback-error page-spacer">
          {error}
        </p>
      )}
    </div>
  );
}
