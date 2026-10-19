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
    <div className="shrink-0 text-right">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-lg border border-gray-300 px-4 py-2 font-medium disabled:opacity-60"
      >
        {isLoggingOut ? "Signing out..." : "Log out"}
      </button>
      {error && (
        <p role="alert" className="mt-2 max-w-48 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
