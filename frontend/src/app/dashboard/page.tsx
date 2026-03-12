import FilmStrip from "@/components/FilmStrip";
import {
  TicketIcon,
  CalendarIcon,
  FilmReelIcon,
  UsersIcon,
  ClapperboardIcon,
  SparklesIcon,
} from "@/components/Icons";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

export const metadata = {
  title: "Dashboard — Lumière",
  description: "Your personal screening room at Lumière.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  let profile: { username?: string } | null = null;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  if (profileData) profile = profileData;

  const displayName =
    profile?.username ||
    (user.user_metadata?.username as string | undefined) ||
    user.email?.split("@")[0] ||
    "Member";

  const initials = displayName
    .split(/[\s_\-\.]+/)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="dash-page">
      <div className="dash-bg" />
      <div className="spotlight spotlight-1" />
      <div className="spotlight spotlight-2" />

      <FilmStrip position="top" />

      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className="sr-nav">
        <a href="/" className="logo">
          Lumi<span>ère</span>
        </a>
        <ul>
          <li><a href="/#features">Features</a></li>
          <li><a href="/create">Create Room</a></li>
          <li><a href="/join">Join a Room</a></li>
          <li>
            <SignOutButton />
          </li>
          <li>
            <a href="/dashboard" className="nav-cta">Dashboard</a>
          </li>
        </ul>
      </nav>

      {/* ── Hero header ───────────────────────────────────── */}
      <header className="dash-hero">
        <div className="dash-hero-inner">
          <div className="dash-avatar" aria-hidden>
            {initials || "?"}
          </div>
          <div className="dash-hero-text">
            <p className="dash-eyebrow">Your Seat</p>
            <h1 className="dash-headline">
              Welcome back, <em>{displayName}</em>
            </h1>
            <div className="dash-meta">
              <span className="dash-meta-item">{user.email}</span>
              {memberSince && (
                <>
                  <span className="dash-meta-dot" />
                  <span className="dash-meta-item dash-meta-since">
                    <CalendarIcon size={13} />
                    Member since {memberSince}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="dash-hero-divider" />
      </header>

      {/* ── Main content ──────────────────────────────────── */}
      <main className="dash-main">

        {/* Stat row */}
        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat-num">0</span>
            <span className="dash-stat-label">Rooms Created</span>
          </div>
          <div className="dash-stat-sep" />
          <div className="dash-stat">
            <span className="dash-stat-num">0</span>
            <span className="dash-stat-label">Screenings Joined</span>
          </div>
          <div className="dash-stat-sep" />
          <div className="dash-stat">
            <span className="dash-stat-num">0</span>
            <span className="dash-stat-label">Hours Watched</span>
          </div>
          <div className="dash-stat-sep" />
          <div className="dash-stat">
            <span className="dash-stat-num">0</span>
            <span className="dash-stat-label">Friends Invited</span>
          </div>
        </div>

        {/* Quick actions */}
        <section className="dash-section">
          <p className="dash-section-eyebrow">Quick Actions</p>
          <h2 className="dash-section-title">
            Ready for <em>tonight's</em> showing?
          </h2>
          <div className="dash-actions-grid">

            <a href="/create" className="dash-action-card dash-action-card--primary">
              <div className="dash-action-card-bg" />
              <span className="dash-action-num">I</span>
              <span className="dash-action-icon">
                <TicketIcon size={36} />
              </span>
              <h3 className="dash-action-title">Open a Room</h3>
              <p className="dash-action-desc">
                Set the stage in seconds. Share the link and the show begins.
              </p>
              <span className="dash-action-cta">
                Open a Room
                <span className="dash-action-arrow">→</span>
              </span>
            </a>

            <a href="/join" className="dash-action-card dash-action-card--secondary">
              <div className="dash-action-card-bg" />
              <span className="dash-action-num">II</span>
              <span className="dash-action-icon">
                <ClapperboardIcon size={36} />
              </span>
              <h3 className="dash-action-title">Join a Screening</h3>
              <p className="dash-action-desc">
                Got a ticket link? Enter the room and take your seat.
              </p>
              <span className="dash-action-cta dash-action-cta--ghost">
                Join a Room
                <span className="dash-action-arrow">→</span>
              </span>
            </a>

            <a href="/create" className="dash-action-card dash-action-card--muted">
              <div className="dash-action-card-bg" />
              <span className="dash-action-num">III</span>
              <span className="dash-action-icon">
                <UsersIcon size={32} />
              </span>
              <h3 className="dash-action-title">Invite Friends</h3>
              <p className="dash-action-desc">
                Create a room, grab the link, and send your crew the ticket.
              </p>
              <span className="dash-action-cta dash-action-cta--ghost">
                Create &amp; Invite
                <span className="dash-action-arrow">→</span>
              </span>
            </a>

          </div>
        </section>

        {/* Recent screenings */}
        <section className="dash-section dash-section--screenings">
          <div className="dash-section-header">
            <div>
              <p className="dash-section-eyebrow">The Archive</p>
              <h2 className="dash-section-title dash-section-title--sm">
                Recent <em>Screenings</em>
              </h2>
            </div>
          </div>

          <div className="dash-screenings-empty">
            <span className="dash-empty-reel">
              <FilmReelIcon size={52} />
            </span>
            <p className="dash-empty-title">The reel is blank.</p>
            <p className="dash-empty-sub">
              Your screening history will appear here once you open or join your
              first room.
            </p>
            <a href="/create" className="btn-primary dash-empty-cta">
              Open your first room
            </a>
          </div>
        </section>

        {/* Profile details */}
        <section className="dash-section dash-section--profile">
          <p className="dash-section-eyebrow">Profile</p>
          <h2 className="dash-section-title dash-section-title--sm">
            Your <em>Details</em>
          </h2>
          <div className="dash-profile-grid">
            <div className="dash-profile-card">
              <SparklesIcon size={18} />
              <div className="dash-profile-card-body">
                <dt>Username</dt>
                <dd>{displayName}</dd>
              </div>
            </div>
            <div className="dash-profile-card">
              <TicketIcon size={18} />
              <div className="dash-profile-card-body">
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
            </div>
            {memberSince && (
              <div className="dash-profile-card">
                <CalendarIcon size={18} />
                <div className="dash-profile-card-body">
                  <dt>Member Since</dt>
                  <dd>{memberSince}</dd>
                </div>
              </div>
            )}
            <div className="dash-profile-card dash-profile-card--id">
              <div className="dash-profile-card-body">
                <dt>Account ID</dt>
                <dd className="dash-monospace">{user.id}</dd>
              </div>
            </div>
          </div>
        </section>

      </main>

      <FilmStrip position="bottom" />
    </div>
  );
}
