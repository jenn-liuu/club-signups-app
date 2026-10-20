import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Officer login</h1>
        <p className="mt-2 text-gray-600">
          Sign in with your provisioned officer account to manage club events.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
