import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="page-shell page-shell--narrow">
      <section className="panel">
        <p className="eyebrow">Club officers</p>
        <h1 className="page-title">Officer login</h1>
        <p className="account-note">
          Sign in with your provisioned officer account to manage club events.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}