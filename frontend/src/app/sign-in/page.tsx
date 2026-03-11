import FilmStrip from "@/components/FilmStrip";

export const metadata = {
  title: "Sign In — Lumière",
  description: "Sign in to save rooms and track your watch history.",
};

export default function SignIn() {
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

          <form className="auth-form" action="#" method="POST">
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <a href="/forgot-password" className="auth-forgot">
              Forgot password?
            </a>

            <button type="submit" className="btn-primary auth-submit">
              Sign In
            </button>
          </form>

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
