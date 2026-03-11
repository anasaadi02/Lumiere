import Image from "next/image";
import FilmStrip from "@/components/FilmStrip";
import {
  TicketIcon,
  ClapperboardIcon,
  MicrophoneIcon,
  SparklesIcon,
  ClipboardIcon,
  UserBadgeIcon,
  VideoCameraIcon,
} from "@/components/Icons";

const features = [
  {
    num: "01",
    Icon: TicketIcon,
    name: "Private Screening Rooms",
    desc: "Create a room in seconds, share a ticket link, and your crew is in. Rooms are private, ephemeral, and entirely yours.",
    tag: "Instant Setup",
  },
  {
    num: "02",
    Icon: ClapperboardIcon,
    name: "Perfectly Synced Playback",
    desc: "YouTube, uploaded files, or direct streams: every pause, seek and play is mirrored for everyone in the room, frame-perfect.",
    tag: "Zero Drift",
  },
  {
    num: "03",
    Icon: MicrophoneIcon,
    name: "Live Voice & Text Chat",
    desc: "Talk or type in real time without missing a beat. Spatial audio keeps the vibe natural, like you're actually on the couch together.",
    tag: "Crystal Clear",
  },
  {
    num: "04",
    Icon: SparklesIcon,
    name: "Reactions & Crowd Energy",
    desc: "Laugh, gasp, and react together. Animated emoji floods the screen when the moment calls for it: everyone feels the crowd.",
    tag: "Full Energy",
  },
  {
    num: "05",
    Icon: ClipboardIcon,
    name: "Collaborative Queue",
    desc: "Anyone in the room can suggest and upvote what's next. The program builds itself: democratic, fun, and always full.",
    tag: "The Program",
  },
  {
    num: "06",
    Icon: UserBadgeIcon,
    name: "Reserved Seating Profiles",
    desc: "Persistent member profiles, watch history, favourite genres. Your seat in every room remembers who you are and what you love.",
    tag: "Your Seat",
  },
];

const steps = [
  {
    roman: "I",
    title: "Open a Room",
    desc: 'Hit \u201cOpen a Screen\u201d and your private room is live in an instant. No account required to start.',
  },
  {
    roman: "II",
    title: "Send the Ticket",
    desc: "Share your room link: it's the ticket. Friends join with one click, no downloads, no friction.",
  },
  {
    roman: "III",
    title: "Pick the Feature",
    desc: "Paste a link, upload a file, or queue from your list. Add more with the collaborative program builder.",
  },
  {
    roman: "IV",
    title: "Lights Down",
    desc: "Press play. React, chat, and laugh in real time. The show has officially started.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sr-nav">
        <a href="#" className="logo">
          Lumi<span>ère</span>
        </a>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#" className="nav-cta">Open a Screen</a></li>
        </ul>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero">
        <div className="screen-bg" />
        <div className="spotlight spotlight-1" />
        <div className="spotlight spotlight-2" />

        <FilmStrip position="top" />
        <FilmStrip position="bottom" />

        <div className="curtain-left" />
        <div className="curtain-right" />

        <div className="hero-content">
          <p className="hero-eyebrow">Introducing Lumière</p>
          <h1 className="hero-title">
            The Cinema
            <em>Comes Home.</em>
          </h1>
          <p className="hero-tagline">
            Create a private screening room, invite your friends, and watch
            anything together, with voice, chat, and reactions in real time.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary">
              Open a Free Room
            </a>
            <a href="#" className="btn-ghost">
              <span className="play-icon" />
              Watch the Demo
            </a>
          </div>
        </div>

        <div className="hero-social-proof">
          <div className="avatars">
            <div className="avatar avatar-bg-1">
              <ClapperboardIcon size={20} />
            </div>
            <div className="avatar avatar-bg-2">
              <SparklesIcon size={20} />
            </div>
            <div className="avatar avatar-bg-3">
              <VideoCameraIcon size={20} />
            </div>
            <div className="avatar avatar-bg-4">
              <TicketIcon size={20} />
            </div>
          </div>
          <div className="divider-dot" />
          <div className="social-text">
            <strong>14,000+ screening rooms</strong> opened this week
          </div>
          <div className="divider-dot" />
          <div className="social-text">
            Rated <strong>4.9 ★</strong> by early members
          </div>
        </div>

      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="features" id="features">
        <p className="section-label">The Full Experience</p>
        <h2 className="section-title">
          Everything a great
          <br />
          <em>night in</em> deserves.
        </h2>

        <div className="features-grid">
          {features.map((f) => (
            <div key={f.num} className="feature-card">
              <span className="feature-number">{f.num}</span>
              <span className="feature-icon">
                <f.Icon size={28} />
              </span>
              <h3 className="feature-name">{f.name}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="how-it-works" id="how-it-works">
        <p className="section-label">The Program Tonight</p>
        <h2 className="section-title">
          From idea to <em>opening credits</em>
          <br />
          in four steps.
        </h2>

        <div className="steps">
          {steps.map((s) => (
            <div key={s.roman} className="step">
              <div className="step-num">{s.roman}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LUMIÈRE BROTHERS ────────────────────────────────── */}
      <section className="lumiere-tribute">
        <div className="lumiere-tribute-inner">
          <div className="lumiere-img-wrap">
            <Image
              src="/Lumière_brothers.jpg"
              alt="Auguste and Louis Lumière"
              width={320}
              height={400}
              className="lumiere-img"
            />
          </div>
          <div className="lumiere-text">
            <p className="section-label" style={{ textAlign: "left" }}>The Name</p>
            <h2 className="lumiere-title">
              Named after the brothers<br />who started it <em>all.</em>
            </h2>
            <p className="lumiere-desc">
              In 1895, Auguste and Louis Lumière held the world&apos;s first public
              film screening in Paris. They invented the Cinématographe and gave
              cinema to the world. Lumière carries their spirit: bringing people
              together around the screen, one room at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section className="cta-banner">
        <h2 className="cta-banner-title">
          Your next great
          <br />
          <em>night in</em> is one
          <br />
          link away.
        </h2>
        <p className="cta-banner-sub">
          No credit card. No install. Just a room, your friends, and whatever's
          worth watching tonight.
        </p>
        <a href="#" className="btn-primary">
          Open Your First Room for Free
        </a>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="sr-footer">
        <a href="#" className="logo">
          Lumi<span>ère</span>
        </a>
        <ul className="footer-links">
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <p>© 2026 ScreenRoom. All rights reserved.</p>
      </footer>
    </>
  );
}
