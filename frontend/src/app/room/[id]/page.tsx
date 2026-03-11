import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  FullscreenIcon,
  ShareIcon,
  LeaveIcon,
  SendIcon,
  PlusIcon,
  UsersIcon,
  QueueIcon,
  SparklesIcon,
  MicrophoneIcon,
} from "@/components/Icons";

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Room ${params.id} — Lumière`,
  };
}

const REACTIONS = ["😂", "😮", "❤️", "👏", "🔥", "😭"];

const MOCK_MESSAGES = [
  { user: "sofia", text: "omg this scene", time: "21:04" },
  { user: "leo", text: "i knew it was him!!", time: "21:04" },
  { user: "mia", text: "the music is so good", time: "21:05" },
  { user: "sofia", text: "no spoilers for the ending please 😭", time: "21:06" },
];

const MOCK_QUEUE = [
  { title: "Now Playing", src: "Interstellar (2014)", active: true },
  { title: "Up Next", src: "Arrival (2016)", active: false },
  { title: "Queued", src: "Dune: Part One (2021)", active: false },
];

const MOCK_MEMBERS = ["sofia", "leo", "mia", "you"];

export default function RoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="room-page">

      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <header className="room-topbar">
        <div className="room-topbar-left">
          <a href="/" className="room-logo">
            Lumi<span>ère</span>
          </a>
          <div className="room-title-wrap">
            <span className="room-name">Friday Night Cinema</span>
            <span className="room-id">#{params.id}</span>
          </div>
        </div>
        <div className="room-topbar-right">
          <button className="room-topbar-btn" title="Share room">
            <ShareIcon size={16} />
            <span>Share</span>
          </button>
          <button className="room-topbar-btn room-topbar-btn--leave" title="Leave room">
            <LeaveIcon size={16} />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div className="room-layout">

        {/* ── QUEUE (left sidebar) ─────────────────────────── */}
        <aside className="room-sidebar room-sidebar--left">
          <div className="room-sidebar-header">
            <QueueIcon size={14} />
            <span>Queue</span>
          </div>

          <ul className="room-queue">
            {MOCK_QUEUE.map((item) => (
              <li key={item.src} className={`room-queue-item${item.active ? " room-queue-item--active" : ""}`}>
                <div className="room-queue-dot" />
                <div className="room-queue-info">
                  <span className="room-queue-label">{item.title}</span>
                  <span className="room-queue-src">{item.src}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="room-queue-add">
            <input className="room-queue-input" type="text" placeholder="Paste a link or title..." />
            <button className="room-queue-btn" title="Add to queue">
              <PlusIcon size={14} />
            </button>
          </div>
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
          <div className="room-sidebar-header">
            <UsersIcon size={14} />
            <span>Members ({MOCK_MEMBERS.length})</span>
          </div>
          <div className="room-members">
            {MOCK_MEMBERS.map((m) => (
              <div key={m} className="room-member">
                <div className="room-member-dot" />
                <span>{m}</span>
              </div>
            ))}
          </div>

          <div className="room-sidebar-divider" />

          {/* Chat */}
          <div className="room-sidebar-header">
            <span>Chat</span>
          </div>
          <div className="room-chat-messages">
            {MOCK_MESSAGES.map((msg, i) => (
              <div key={i} className="room-chat-msg">
                <span className="room-chat-user">{msg.user}</span>
                <span className="room-chat-time">{msg.time}</span>
                <p className="room-chat-text">{msg.text}</p>
              </div>
            ))}
          </div>

          <form className="room-chat-form" action="#" method="POST">
            <input
              className="room-chat-input"
              type="text"
              placeholder="Say something..."
              autoComplete="off"
            />
            <button type="submit" className="room-chat-send" title="Send">
              <SendIcon size={14} />
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
