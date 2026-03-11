import FilmStrip from "@/components/FilmStrip";

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

          <form className="auth-form" action="#" method="POST">
            <div className="auth-field">
              <label className="auth-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="auth-input"
                type="text"
                placeholder="johndoe"
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="auth-input"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="btn-primary auth-submit">
              Create Account
            </button>
          </form>

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
