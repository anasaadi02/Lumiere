import FilmStrip from "@/components/FilmStrip";
import { TicketIcon } from "@/components/Icons";
import { JoinRoomForm } from "./JoinRoomForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Join a Room — Lumière",
  description: "Join a screening room with your friends.",
};

export default async function JoinRoom() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

          <JoinRoomForm isLoggedIn={!!user} />

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
