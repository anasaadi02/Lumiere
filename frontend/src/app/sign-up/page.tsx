import FilmStrip from "@/components/FilmStrip";
import { SignUpForm } from "./SignUpForm";

export const metadata = {
  title: "Sign Up — Lumière",
  description: "Create an account to save rooms and track your watch history.",
};

export default function SignUp() {
  return (
    <div className="auth-page auth-page--signup">
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
            <p className="auth-eyebrow">Join Lumière</p>
            <h1 className="auth-title">
              Create <em>account</em>
            </h1>
            <p className="auth-subtitle">
              Save rooms, track history, and get your seat in every screening.
            </p>
          </div>

          <SignUpForm />

          <p className="auth-note">
            Already have an account?{" "}
            <a href="/sign-in" className="auth-link">Sign in</a>
          </p>
        </div>
      </main>

      <FilmStrip position="bottom" />
    </div>
  );
}
