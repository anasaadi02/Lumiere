import FilmStrip from "@/components/FilmStrip";
import { TicketIcon } from "@/components/Icons";

export const metadata = {
  title: "Join a Room — Lumière",
  description: "Join a screening room with your friends.",
};

export default function JoinRoom() {
  return (
    <div className="create-page create-page--join">
      <div className="create-bg" />
      <div className="spotlight spotlight-1" />
      <div className="spotlight spotlight-2" />

      <FilmStrip position="top" />

      <nav className="sr-nav">
        <a href="/" className="logo">
          Lumi<span>ère</span>
        </a>
      </nav>

      <main className="create-main">
        <div className="create-card">

          <div className="create-card-header">
            <span className="create-icon">
              <TicketIcon size={32} />
            </span>
            <p className="create-eyebrow">Join a Screening Room</p>
            <h1 className="create-title">
              Grab your <em>ticket.</em>
            </h1>
            <p className="create-subtitle">
              Paste the room link or enter the code. You&apos;re in with one click.
            </p>
          </div>

          <form className="create-form" action="#" method="POST">

            <div className="create-field">
              <label className="create-label" htmlFor="room-link">
                Room Link or Code
              </label>
              <input
                id="room-link"
                className="create-input"
                type="text"
                placeholder="e.g. lumiere.app/room/abc123 or abc123"
                autoComplete="off"
              />
            </div>

            <div className="create-field">
              <label className="create-label" htmlFor="nickname">
                Your Name
              </label>
              <input
                id="nickname"
                className="create-input"
                type="text"
                placeholder="How others will see you"
                maxLength={32}
                autoComplete="off"
              />
            </div>

            <div className="create-field">
              <label className="create-label" htmlFor="join-password">
                Room Password
                <span className="create-label-hint">If required</span>
              </label>
              <input
                id="join-password"
                className="create-input"
                type="password"
                placeholder="Leave empty if none"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary create-submit">
              Join the Room
            </button>

          </form>

          <p className="create-note">
            Want to save rooms and track your history?{" "}
            <a href="/sign-in" className="create-link">Sign in</a>
          </p>
          <div className="create-note-actions">
            <a href="/create" className="create-btn-secondary">Create a room instead</a>
          </div>

        </div>
      </main>

      <FilmStrip position="bottom" />
    </div>
  );
}
