import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export const instant = false;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Officer dashboard</h1>
        <p role="alert" className="mt-4 text-red-700">
          Unable to read your login session: {sessionError.message}
        </p>
      </main>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
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
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Event management</h2>
        <p className="mt-2 text-gray-600">
          Event management tools will appear here.
        </p>
      </section>
    </main>
  );
}
