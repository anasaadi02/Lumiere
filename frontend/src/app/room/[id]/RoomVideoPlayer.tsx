"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  VolumeMutedIcon,
  FullscreenIcon,
  SparklesIcon,
  MicrophoneIcon,
  SyncIcon,
} from "@/components/Icons";
import { getYouTubeVideoId } from "@/lib/videoUtils";

type HlsInstance = InstanceType<typeof import("hls.js").default>;

type QueueItem = {
  id: string;
  title: string;
  src: string;
  position: number;
};

type Props = {
  roomId: string;
  isHost?: boolean;
};

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  setVolume: (vol: number) => void;
  getVolume: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: string | HTMLElement, opts: unknown) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
      ready: (fn: () => void) => void;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(tag, first);
  });
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getPlayerType(url: string): "youtube" | "gdrive" | "hls" | "direct" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("drive.google.com")) return "gdrive";
  if (url.includes("m3u8")) return "hls";
  return "direct";
}

export function RoomVideoPlayer({ roomId, isHost = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HlsInstance | null>(null);

  const [currentItem, setCurrentItem] = useState<QueueItem | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingSyncRef = useRef<{ queue_item_id: string | null; position_sec: number; is_playing: boolean } | null>(null);
  const broadcastChannelRef = useRef<{ send: (args: { type: "broadcast"; event: string; payload?: unknown }) => Promise<unknown> } | null>(null);
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeekRef = useRef<{ target: number; at: number } | null>(null);
  const advanceToNextRef = useRef(false);

  const getPlayer = useCallback((): { play: () => void | Promise<unknown>; pause: () => void; seek: (s: number) => void; getTime: () => number; getDur: () => number } | null => {
    const yt = ytPlayerRef.current;
    if (yt) {
      return {
        play: () => yt.playVideo(),
        pause: () => yt.pauseVideo(),
        seek: (s) => yt.seekTo(s),
        getTime: () => yt.getCurrentTime(),
        getDur: () => yt.getDuration(),
      };
    }
    const video = videoRef.current;
    if (video) {
      return {
        play: () => video.play(),
        pause: () => video.pause(),
        seek: (s) => {
          video.currentTime = s;
        },
        getTime: () => video.currentTime,
        getDur: () =>
          Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0,
      };
    }
    return null;
  }, []);

  const currentItemRef = useRef(currentItem);
  const playingRef = useRef(playing);
  useEffect(() => { currentItemRef.current = currentItem; }, [currentItem]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  const applySync = useCallback(
    (sync: { queue_item_id: string | null; position_sec: number; is_playing: boolean }) => {
      const item = currentItemRef.current;
      if (!item || sync.queue_item_id !== item.id) {
        pendingSyncRef.current = sync;
        return;
      }
      const player = getPlayer();
      if (!player) {
        pendingSyncRef.current = sync;
        return;
      }
      const targetPos = Math.max(0, Number(sync.position_sec));
      const currentPos = player.getTime();
      if (Math.abs(targetPos - currentPos) > 0.8) {
        player.seek(targetPos);
        setCurrentTime(targetPos);
      }
      if (sync.is_playing) {
        const playPromise = player.play();
        if (playPromise && typeof (playPromise as Promise<unknown>).catch === "function") {
          (playPromise as Promise<unknown>).catch(() => {
            if (!isHost) setNeedsGesture(true);
          });
        }
      } else {
        player.pause();
      }
      setPlaying(sync.is_playing);
      pendingSyncRef.current = null;
    },
    [getPlayer, isHost]
  );

  const applySyncRef = useRef(applySync);
  useEffect(() => { applySyncRef.current = applySync; }, [applySync]);

  useEffect(() => {
    const supabase = createClient();

    const fetchSync = async () => {
      const { data } = await supabase
        .from("room_sync")
        .select("queue_item_id, position_sec, is_playing")
        .eq("room_id", roomId)
        .single();
      if (data) {
        applySyncRef.current({
          queue_item_id: data.queue_item_id as string | null,
          position_sec: Number(data.position_sec),
          is_playing: Boolean(data.is_playing),
        });
      }
    };

    fetchSync();

    const channel = supabase
      .channel(`room-sync:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_sync",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const r = payload.new as { queue_item_id: string | null; position_sec: number; is_playing: boolean } | undefined;
          if (r) applySyncRef.current(r);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel(`room-sync-broadcast:${roomId}`)
      .on("broadcast", { event: "sync_request" }, () => {
        if (!isHost) return;
        const player = getPlayer();
        if (!player || !currentItemRef.current) return;
        const pos = player.getTime();
        ch.send({
          type: "broadcast",
          event: "sync_response",
          payload: {
            queue_item_id: currentItemRef.current.id,
            position_sec: pos,
            is_playing: playingRef.current,
          },
        });
      })
      .on("broadcast", { event: "sync_response" }, (payload: unknown) => {
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
          fallbackTimeoutRef.current = null;
        }
        const raw = payload as Record<string, unknown>;
        const r = (raw?.payload ?? raw) as { queue_item_id?: string | null; position_sec?: number; is_playing?: boolean };
        if (r && typeof r.position_sec === "number") {
          applySyncRef.current({
            queue_item_id: r.queue_item_id ?? null,
            position_sec: r.position_sec,
            is_playing: Boolean(r.is_playing),
          });
        }
      })
      .subscribe();
    broadcastChannelRef.current = ch;
    return () => {
      broadcastChannelRef.current = null;
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
      supabase.removeChannel(ch);
    };
  }, [roomId, isHost, getPlayer]);

  useEffect(() => {
    const supabase = createClient();

    const fetchQueue = async () => {
      const { data } = await supabase
        .from("queue_items")
        .select("id, title, src, position")
        .eq("room_id", roomId)
        .order("position", { ascending: true })
        .limit(1);
      const first = data?.[0] as QueueItem | undefined;
      if (first) {
        setCurrentItem(first);
      } else {
        setCurrentItem(null);
      }
    };

    fetchQueue();

    const channel = supabase
      .channel(`queue-player:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue_items",
          filter: `room_id=eq.${roomId}`,
        },
        () => fetchQueue()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    if (!currentItem) return;

    const src = currentItem.src.trim();
    if (getPlayerType(src) !== "youtube") return;

    const ytId = getYouTubeVideoId(src);
    if (!ytId) return;

    loadYouTubeAPI().then(() => {
      if (!ytContainerRef.current || !window.YT?.Player) return;
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      ytPlayerRef.current = null;

      new window.YT.Player(ytContainerRef.current, {
        videoId: ytId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 2,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          autohide: 1,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            ytPlayerRef.current = e.target;
            setDuration(e.target.getDuration());
            e.target.setVolume((muted ? 0 : volume) * 100);
            const pending = pendingSyncRef.current;
            if (pending && pending.queue_item_id === currentItem?.id) {
              e.target.seekTo(Math.max(0, pending.position_sec));
              if (pending.is_playing) {
                try {
                  const p = e.target.playVideo() as unknown;
                  if (p && typeof (p as Promise<unknown>).catch === "function") {
                    (p as Promise<unknown>).catch(() => {
                      if (!isHost) setNeedsGesture(true);
                    });
                  }
                } catch {
                  if (!isHost) setNeedsGesture(true);
                }
              } else {
                e.target.pauseVideo();
              }
              setCurrentTime(pending.position_sec);
              setPlaying(pending.is_playing);
              pendingSyncRef.current = null;
            } else if (advanceToNextRef.current) {
              advanceToNextRef.current = false;
              e.target.playVideo();
              setPlaying(true);
              void createClient()
                .from("room_sync")
                .upsert(
                  {
                    room_id: roomId,
                    queue_item_id: currentItem?.id,
                    position_sec: 0,
                    is_playing: true,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: "room_id" }
                );
            }
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === window.YT!.PlayerState.PLAYING) setPlaying(true);
            else if (e.data === window.YT!.PlayerState.PAUSED) setPlaying(false);
            else if (e.data === window.YT!.PlayerState.ENDED) {
              setPlaying(false);
              if (isHost && currentItem) {
                advanceToNextRef.current = true;
                void createClient().from("queue_items").delete().eq("id", currentItem.id);
              }
            }
          },
        },
      });
    });

    return () => {
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      ytPlayerRef.current = null;
    };
  }, [currentItem?.id, currentItem?.src]);

  useEffect(() => {
    if (!currentItem) return;

    const src = currentItem.src.trim();
    const pt = getPlayerType(src);
    if (pt === "youtube") return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    hlsRef.current?.destroy();
    hlsRef.current = null;

    const onLoadedMetadata = () => {
      if (cancelled) return;
      const dur = video.duration;
      setDuration(Number.isFinite(dur) && dur > 0 ? dur : 0);
      video.volume = muted ? 0 : volume;
      const pending = pendingSyncRef.current;
      const item = currentItemRef.current;
      if (pending && item && pending.queue_item_id === item.id) {
        video.currentTime = Math.max(0, pending.position_sec);
        if (pending.is_playing) {
          void video.play().catch(() => {
            if (!isHost) setNeedsGesture(true);
          });
        } else {
          video.pause();
        }
        setCurrentTime(pending.position_sec);
        setPlaying(pending.is_playing);
        pendingSyncRef.current = null;
      } else if (advanceToNextRef.current) {
        advanceToNextRef.current = false;
        void video.play().then(() => {
          setPlaying(true);
          void createClient()
            .from("room_sync")
            .upsert(
              {
                room_id: roomId,
                queue_item_id: item?.id,
                position_sec: 0,
                is_playing: true,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "room_id" }
            );
        });
      }
    };

    const onEnded = () => {
      setPlaying(false);
      const item = currentItemRef.current;
      if (isHost && item) {
        advanceToNextRef.current = true;
        void createClient().from("queue_items").delete().eq("id", item.id);
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    void (async () => {
      if (pt === "hls") {
        const { default: Hls } = await import("hls.js");
        if (cancelled) return;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hlsRef.current = hls;
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        } else {
          return;
        }
      } else {
        video.src = src;
      }
    })();

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [currentItem?.id, currentItem?.src, roomId, isHost]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentItem) return;
    const src = currentItem.src.trim();
    if (getPlayerType(src) === "youtube") return;
    video.volume = muted ? 0 : volume;
  }, [volume, muted, currentItem?.id, currentItem?.src]);

  useEffect(() => {
    if (currentItem && pendingSyncRef.current) {
      applySyncRef.current(pendingSyncRef.current);
    }
  }, [currentItem?.id]);

  const upsertSync = useCallback(
    (positionSec: number, isPlaying: boolean) => {
      if (!currentItem) return;
      const supabase = createClient();
      supabase
        .from("room_sync")
        .upsert(
          {
            room_id: roomId,
            queue_item_id: currentItem.id,
            position_sec: positionSec,
            is_playing: isPlaying,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "room_id" }
        )
        .then(({ error }) => {
          if (error) console.error("[room_sync] upsert failed:", error.message, error.code);
        });
    },
    [roomId, currentItem]
  );

  useEffect(() => {
    if (!playing) return;
    const player = getPlayer();
    if (!player) return;

    tickRef.current = setInterval(() => {
      const t = player.getTime();
      const d = player.getDur();
      setCurrentTime(t);
      if (Number.isFinite(d) && d > 0) setDuration(d);
    }, 250);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [playing, getPlayer, currentItem?.id]);

  useEffect(() => {
    if (!isHost || !playing || !currentItem) return;
    const player = getPlayer();
    if (!player) return;

    const syncInterval = setInterval(() => {
      const lastSeek = lastSeekRef.current;
      const now = Date.now();
      const t =
        lastSeek && now - lastSeek.at < 2000
          ? lastSeek.target
          : player.getTime();
      if (!lastSeek || now - lastSeek.at >= 2000) {
        lastSeekRef.current = null;
      }
      upsertSync(t, true);
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [isHost, playing, currentItem, getPlayer, upsertSync]);

  const handlePlayPause = () => {
    if (!isHost) return;
    const player = getPlayer();
    if (!player) return;
    if (playing) {
      player.pause();
      upsertSync(player.getTime(), false);
    } else {
      player.play();
      upsertSync(player.getTime(), true);
    }
  };

  const handleGuestSync = () => {
    const player = getPlayer();
    if (!player) return;

    const playResult = player.play();
    if (playResult && typeof (playResult as Promise<unknown>).catch === "function") {
      (playResult as Promise<unknown>).catch(() => setNeedsGesture(true));
    }
    setPlaying(true);
    setNeedsGesture(false);

    broadcastChannelRef.current?.send({
      type: "broadcast",
      event: "sync_request",
      payload: {},
    });

    const fallback = () => {
      fallbackTimeoutRef.current = null;
      const supabase = createClient();
      supabase
        .from("room_sync")
        .select("queue_item_id, position_sec, is_playing")
        .eq("room_id", roomId)
        .single()
        .then(({ data }) => {
          if (!data || data.queue_item_id !== currentItemRef.current?.id) return;
          const p = getPlayer();
          if (!p) return;
          const targetPos = Math.max(0, Number(data.position_sec));
          p.seek(targetPos);
          setCurrentTime(targetPos);
          if (data.is_playing) p.play();
          setPlaying(Boolean(data.is_playing));
        });
    };

    fallbackTimeoutRef.current = setTimeout(fallback, 2500);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHost) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const seekTo = Math.max(0, Math.min(1, x)) * (duration || 1);
    const player = getPlayer();
    if (player) {
      lastSeekRef.current = { target: seekTo, at: Date.now() };
      player.seek(seekTo);
      setCurrentTime(seekTo);
      upsertSync(seekTo, playing);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setMuted(v === 0);
    ytPlayerRef.current?.setVolume(v * 100);
    const el = videoRef.current;
    if (el) el.volume = v;
  };

  const handleVolumeClick = () => {
    if (muted || volume === 0) {
      setVolume(1);
      setMuted(false);
      ytPlayerRef.current?.setVolume(100);
      if (videoRef.current) videoRef.current.volume = 1;
    } else {
      setMuted(true);
      ytPlayerRef.current?.setVolume(0);
      if (videoRef.current) videoRef.current.volume = 0;
    }
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const dur = duration > 0 ? duration : 1;
  const progress = (currentTime / dur) * 100;

  if (!currentItem) {
    return (
      <div className="room-player" ref={containerRef}>
        <div className="room-player-screen">
          <div className="room-player-placeholder">
            <PlayIcon size={48} />
            <p>Add a video to the queue to start</p>
          </div>
        </div>
      </div>
    );
  }

  const src = currentItem.src.trim();
  const pt = getPlayerType(src);
  const ytId = getYouTubeVideoId(src);
  const nativeOk = pt === "hls" || pt === "direct";
  const isGdrive = pt === "gdrive";

  const playerKey = `player-${currentItem.id}-${src.slice(0, 50)}`;

  return (
    <div className="room-player" ref={containerRef}>
      <div className="room-player-screen" key={playerKey}>
        {pt === "youtube" && ytId && (
          <div
            ref={ytContainerRef}
            className="room-player-embed"
            style={{ width: "100%", height: "100%", minHeight: 200 }}
          />
        )}
        {pt === "youtube" && !ytId && (
          <div className="room-player-placeholder">
            <PlayIcon size={48} />
            <p>This YouTube link could not be loaded. Remove it and try another URL.</p>
          </div>
        )}
        {nativeOk && (
          <video
            ref={videoRef}
            className="room-player-embed"
            playsInline
            style={{
              width: "100%",
              height: "100%",
              minHeight: 200,
              objectFit: "contain",
              background: "#000",
            }}
          />
        )}
        {isGdrive && (
          <iframe
            src={src}
            className="room-player-embed"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ width: "100%", height: "100%", minHeight: 200, border: "none" }}
          />
        )}
      </div>

      {isGdrive && (
        <div className="room-controls">
          <div className="room-controls-left" />
          <div className="room-controls-center">
            <span className="room-sync-badge room-sync-badge--manual">
              ◎ Google Drive — use the player controls above to play
            </span>
          </div>
          <div className="room-controls-right">
            <button
              type="button"
              className="room-ctrl-btn"
              title="Fullscreen"
              onClick={handleFullscreen}
            >
              <FullscreenIcon size={18} />
            </button>
          </div>
        </div>
      )}

      {((pt === "youtube" && ytId) || nativeOk) && (
        <>
          <div className="room-progress">
            <span className="room-time">{formatTime(currentTime)}</span>
            <div
              className={`room-progress-bar${!isHost ? " room-progress-bar--readonly" : ""}`}
              onClick={handleSeek}
              role="slider"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={duration}
              tabIndex={isHost ? 0 : -1}
              aria-readonly={!isHost}
            >
              <div
                className="room-progress-fill"
                style={{ width: `${progress}%` }}
              />
              <div
                className="room-progress-thumb"
                style={{ left: `${progress}%` }}
              />
            </div>
            <span className="room-time">{formatTime(duration)}</span>
          </div>

          <div className="room-controls">
            <div className="room-controls-left">
              {isHost ? (
                <button
                  type="button"
                  className="room-ctrl-btn room-ctrl-btn--primary"
                  title={playing ? "Pause" : "Play"}
                  onClick={handlePlayPause}
                >
                  {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                </button>
              ) : (
                (!playing || needsGesture) && (
                  <button
                    type="button"
                    className="room-ctrl-btn room-ctrl-btn--sync"
                    title="Sync with host"
                    onClick={handleGuestSync}
                  >
                    <SyncIcon size={18} />
                  </button>
                )
              )}
              <div className="room-volume">
                <button
                  type="button"
                  className="room-ctrl-btn"
                  title={muted || volume === 0 ? "Unmute" : "Mute"}
                  onClick={handleVolumeClick}
                >
                  {muted || volume === 0 ? (
                    <VolumeMutedIcon size={18} />
                  ) : (
                    <VolumeIcon size={18} />
                  )}
                </button>
                <div className="room-volume-wrap">
                  <div
                    className="room-volume-fill"
                    style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                  />
                  <input
                    type="range"
                    className="room-volume-slider"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    title="Volume"
                  />
                </div>
              </div>
            </div>
            <div className="room-controls-center">
              <span className="room-sync-badge">● In Sync</span>
            </div>
            <div className="room-controls-right">
              <button type="button" className="room-ctrl-btn" title="Reactions">
                <SparklesIcon size={18} />
              </button>
              <button type="button" className="room-ctrl-btn" title="Voice">
                <MicrophoneIcon size={18} />
              </button>
              <button
                type="button"
                className="room-ctrl-btn"
                title="Fullscreen"
                onClick={handleFullscreen}
              >
                <FullscreenIcon size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
