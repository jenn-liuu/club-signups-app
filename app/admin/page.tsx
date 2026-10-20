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
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Officer dashboard</h1>
        <p role="alert" className="mt-4 text-red-700">
          Unable to verify your login: {error.message}
        </p>
      </main>
    );
  }

  if (!user) {
    redirect("/login");
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
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Officer dashboard
            </h1>
            <p className="mt-3 text-gray-600">
              Signed in as{" "}
              <span className="font-medium text-gray-900">{user.email}</span>
            </p>
          </div>
          <LogoutButton />
        </div>
        <p role="alert" className="mt-6 text-red-700">
          Unable to load your events: {eventsError.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Officer dashboard
          </h1>
          <p className="mt-3 text-gray-600">
            Signed in as <span className="font-medium text-gray-900">{user.email}</span>
          </p>
        </div>
        <LogoutButton />
      </div>
      <AdminEvents initialEvents={events as AdminEvent[]} />
    </main>
  );
}
