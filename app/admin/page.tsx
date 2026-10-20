import { redirect } from "next/navigation";
import { isUnauthenticatedError } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import AdminEvents, { type AdminEvent } from "./admin-events";

export const instant = false;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && !isUnauthenticatedError(error)) {
    return (
      <main className="page-shell">
        <h1 className="page-title">Officer dashboard</h1>
        <p role="alert" className="state-card state-card--error page-spacer">
          Unable to verify your login: {error.message}
        </p>
      </main>
    );
  }

  if (!user) {
    redirect("/login");
  }

  if (user.app_metadata.role !== "officer") {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Officer dashboard
            </h1>
            <p role="alert" className="mt-4 text-red-700">
              This account is not authorized to manage club events.
            </p>
          </div>
          <LogoutButton />
        </div>
      </main>
    );
  }

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select(
      "id, title, date, location, description, signups(id, name, email, attended)",
    )
    .eq("owner_id", user.id)
    .order("date", { ascending: true });

  if (eventsError) {
    return (
      <main className="page-shell">
        <div className="topbar">
          <div>
            <h1 className="page-title">
              Officer dashboard
            </h1>
            <p className="account-note">
              Signed in as{" "}
              <span className="account-email">{user.email}</span>
            </p>
          </div>
          <div className="logout-area">
            <LogoutButton />
          </div>
        </div>
        <p role="alert" className="state-card state-card--error page-spacer">
          Unable to load your events: {eventsError.message}
        </p>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="topbar">
        <div>
          <h1 className="page-title">
            Officer dashboard
          </h1>
          <p className="account-note">
            Signed in as <span className="account-email">{user.email}</span>
          </p>
        </div>
        <div className="logout-area">
          <LogoutButton />
        </div>
      </div>
      <AdminEvents initialEvents={events as AdminEvent[]} />
    </main>
  );
}
