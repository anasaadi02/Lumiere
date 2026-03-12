"use client";

import { useEffect, useState } from "react";
import { getOrCreate, release } from "@/lib/supabase/presenceChannel";
import { UsersIcon } from "@/components/Icons";

type Member = {
  key: string;
  nickname: string;
  isHost?: boolean;
};

type Props = {
  roomId: string;
  nickname: string;
  isHost: boolean;
};

export function RoomMembers({ roomId, nickname, isHost }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting"
  );
  useEffect(() => {
    const channel = getOrCreate(roomId);
    let active = true;

    const readState = () => {
      if (!active) return;
      const state = channel.presenceState<{
        nickname: string;
        is_host?: boolean;
      }>();
      const seen = new Set<string>();
      const all: Member[] = [];
      Object.entries(state).forEach(([key, presences]) => {
        presences.forEach((p) => {
          const dedupKey = `${key}:${p.nickname}`;
          if (!seen.has(dedupKey)) {
            seen.add(dedupKey);
            all.push({ key, nickname: p.nickname, isHost: p.is_host });
          }
        });
      });
      setMembers(all);
    };

    const trackWithRetry = async (attempt = 0): Promise<void> => {
      const result = await channel.track({
        nickname: nickname || "Anonymous",
        is_host: isHost,
      });
      if (result !== "ok" && active && attempt < 5) {
        const delay = Math.min(500 * Math.pow(2, attempt), 8000);
        setTimeout(() => trackWithRetry(attempt + 1), delay);
      }
    };

    channel
      .on("presence", { event: "sync" }, readState)
      .on("presence", { event: "join" }, readState)
      .on("presence", { event: "leave" }, readState)
      .subscribe(async (subStatus, err) => {
        if (err) {
          if (active) setStatus("error");
          return;
        }
        if (subStatus === "SUBSCRIBED") {
          if (active) setStatus("connected");
          await trackWithRetry();
        }
      });

    return () => {
      active = false;
      release(roomId, channel);
    };
  }, [roomId, nickname, isHost]);

  return (
    <>
      <div className="room-sidebar-header">
        <UsersIcon size={14} />
        <span>Members ({members.length})</span>
      </div>
      <div className="room-members">
        {status === "error" ? (
          <p className="room-members-empty">
            Realtime unavailable. Enable it in Supabase Dashboard → Project
            Settings → API.
          </p>
        ) : members.length === 0 && status === "connecting" ? (
          <p className="room-members-empty">Connecting...</p>
        ) : members.length === 0 ? (
          <div className="room-member">
            <div className="room-member-dot" />
            <span>
              {nickname || "You"}
              {isHost && <span className="room-member-host"> (host)</span>}
            </span>
          </div>
        ) : (
          members.map((m) => (
            <div key={m.key} className="room-member">
              <div className="room-member-dot" />
              <span>
                {m.nickname}
                {m.isHost && <span className="room-member-host"> (host)</span>}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
