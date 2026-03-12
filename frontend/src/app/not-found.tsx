import FilmStrip from "@/components/FilmStrip";
import { TicketIcon } from "@/components/Icons";
import Link from "next/link";

export const metadata = {
  title: "404 — Not Found | Lumière",
  description: "This page doesn't exist. Return to Lumière to create or join a screening room.",
};

export default function NotFound() {
  return (
    <div className="nf-page">
      <div className="create-bg" />
      <div className="spotlight spotlight-1" />
      <div className="spotlight spotlight-2" />

      <FilmStrip position="top" />

      <nav className="sr-nav">
        <Link href="/" className="logo">
          Lumi<span>ère</span>
        </Link>
        <ul>
          <li><Link href="/create">Create Room</Link></li>
          <li><Link href="/join">Join a Room</Link></li>
          <li><Link href="/" className="nav-cta">Home</Link></li>
        </ul>
      </nav>

      <main className="nf-main">
        <div className="nf-card">
          <p className="nf-eyebrow">Error 404</p>
          <h1 className="nf-title">
            <span className="nf-number">404</span>
            <em>Not Found</em>
          </h1>
          <p className="nf-subtitle">
            This screening has ended. The reel you&apos;re looking for doesn&apos;t
            exist or has been removed.
          </p>
          <div className="nf-actions">
            <Link href="/" className="btn-primary nf-btn">
              <TicketIcon size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <FilmStrip position="bottom" />
    </div>
  );
}
