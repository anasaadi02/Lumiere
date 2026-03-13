import FilmStrip from "@/components/FilmStrip";
import { SignInForm } from "./SignInForm";

export const metadata = {
  title: "Sign In — Lumière",
  description: "Sign in to save rooms and track your watch history.",
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;
  return (
    <div className="auth-page">
      <div className="create-bg" />
      <div className="spotlight spotlight-1" />
      <div className="spotlight spotlight-2" />

      <FilmStrip position="top" />

      <nav className="sr-nav">
        <a href="/" className="logo">
          Lumi<span>ère</span>
        </a>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-eyebrow">Welcome back</p>
            <h1 className="auth-title">
              Sign <em>in</em>
            </h1>
            <p className="auth-subtitle">
              Access your saved rooms and watch history.
            </p>
          </div>

          <SignInForm redirectTo={redirectTo} />

          <p className="auth-note">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="auth-link">Sign up</a>
          </p>
        </div>
      </main>

      <FilmStrip position="bottom" />
    </div>
  );
}
