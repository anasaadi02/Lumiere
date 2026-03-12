import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  FullscreenIcon,
  SparklesIcon,
  MicrophoneIcon,
} from "@/components/Icons";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RoomTopbarActions } from "./RoomTopbarActions";
import { RoomMembers } from "./RoomMembers";
import { RoomQueue } from "./RoomQueue";
import { RoomChat } from "./RoomChat";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Room ${id} — Lumière`,
  };
}

const REACTIONS = ["😂", "😮", "❤️", "👏", "🔥", "😭"];

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nickname?: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: room, error } = await supabase
    .from("rooms")
    .select("id, name, current_video_title, created_by")
    .eq("id", id)
    .single();

  if (error || !room) {
    notFound();
  }

  const { nickname } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let displayName: string;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    displayName = profile?.username ?? user.email?.split("@")[0] ?? "Guest";
  } else {
    displayName = nickname?.trim() || "Host";
  }

  const isHost =
    (user && room.created_by && room.created_by === user.id) ||
    (!user && !nickname);

  return (
    <div className="room-page">

      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <header className="room-topbar">
        <div className="room-topbar-left">
          <a href="/" className="room-logo">
            Lumi<span>ère</span>
          </a>
          <div className="room-title-wrap">
            <span className="room-name">{room.name}</span>
            <span className="room-id">#{room.id}</span>
          </div>
        </div>
        <div className="room-topbar-right">
          <RoomTopbarActions roomId={room.id} />
        </div>
      </header>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div className="room-layout">

        {/* ── QUEUE (left sidebar) ─────────────────────────── */}
        <aside className="room-sidebar room-sidebar--left">
          <RoomQueue roomId={room.id} />
        </aside>

        {/* ── VIDEO (center) ───────────────────────────────── */}
        <main className="room-center">
          {/* Player */}
          <div className="room-player">
            <div className="room-player-screen">
              <div className="room-player-placeholder">
                <PlayIcon size={48} />
                <p>Interstellar (2014)</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="room-progress">
              <span className="room-time">1:02:34</span>
              <div className="room-progress-bar">
                <div className="room-progress-fill" style={{ width: "38%" }} />
                <div className="room-progress-thumb" style={{ left: "38%" }} />
              </div>
              <span className="room-time">2:49:00</span>
            </div>

            {/* Controls */}
            <div className="room-controls">
              <div className="room-controls-left">
                <button className="room-ctrl-btn room-ctrl-btn--primary" title="Play / Pause">
                  <PauseIcon size={20} />
                </button>
                <div className="room-volume">
                  <button className="room-ctrl-btn" title="Volume">
                    <VolumeIcon size={18} />
                  </button>
                  <div className="room-volume-slider">
                    <div className="room-volume-fill" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>
              <div className="room-controls-center">
                <span className="room-sync-badge">● In Sync</span>
              </div>
              <div className="room-controls-right">
                <button className="room-ctrl-btn" title="Reactions">
                  <SparklesIcon size={18} />
                </button>
                <button className="room-ctrl-btn" title="Voice">
                  <MicrophoneIcon size={18} />
                </button>
                <button className="room-ctrl-btn" title="Fullscreen">
                  <FullscreenIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Reactions row */}
          <div className="room-reactions">
            {REACTIONS.map((r) => (
              <button key={r} className="room-reaction-btn" title={r}>
                {r}
              </button>
            ))}
          </div>
        </main>

        {/* ── CHAT (right sidebar) ─────────────────────────── */}
        <aside className="room-sidebar room-sidebar--right">
          {/* Members */}
          <RoomMembers
            roomId={room.id}
            nickname={displayName}
            isHost={isHost}
          />

          <div className="room-sidebar-divider" />

          <RoomChat roomId={room.id} nickname={displayName} />
        </aside>
      </div>
    </div>
  );
}
