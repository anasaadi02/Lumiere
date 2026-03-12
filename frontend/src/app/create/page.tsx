import FilmStrip from "@/components/FilmStrip";
import { TicketIcon } from "@/components/Icons";
import { CreateRoomForm } from "./CreateRoomForm";

export const metadata = {
  title: "Open a Room — Lumière",
  description: "Create a private screening room and invite your friends.",
};

export default function CreateRoom() {
  return (
    <div className="create-page">
      {/* Background */}
      <div className="create-bg" />
      <div className="spotlight spotlight-1" />
      <div className="spotlight spotlight-2" />

      <FilmStrip position="top" />

      {/* Nav */}
      <nav className="sr-nav">
        <a href="/" className="logo">
          Lumi<span>ère</span>
        </a>
      </nav>

      {/* Card */}
      <main className="create-main">
        <div className="create-card">

          {/* Header */}
          <div className="create-card-header">
            <span className="create-icon">
              <TicketIcon size={32} />
            </span>
            <p className="create-eyebrow">New Screening Room</p>
            <h1 className="create-title">
              Set the <em>stage.</em>
            </h1>
            <p className="create-subtitle">
              Your room is ready in seconds. Share the link and the show begins.
            </p>
          </div>

          <CreateRoomForm />

          {/* Footer note */}
          <p className="create-note">
            Want to save rooms and track your history?{" "}
            <a href="/sign-in" className="create-link">Sign in</a>
          </p>
          <div className="create-note-actions">
            <a href="/join" className="create-btn-secondary">Join a room instead</a>
          </div>

        </div>
      </main>

      <FilmStrip position="bottom" />
    </div>
  );
}
