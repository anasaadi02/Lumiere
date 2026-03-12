import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "./client";

type Entry = {
  channel: RealtimeChannel;
  refCount: number;
  removeTimeout: ReturnType<typeof setTimeout> | null;
};

const store = new Map<string, Entry>();

const REMOVE_DELAY_MS = 3000;

function getOrCreate(roomId: string): RealtimeChannel {
  const channelName = `presence-${roomId}`;
  let entry = store.get(channelName);

  if (entry) {
    entry.refCount++;
    if (entry.removeTimeout) {
      clearTimeout(entry.removeTimeout);
      entry.removeTimeout = null;
    }
    return entry.channel;
  }

  const supabase = createClient();
  const channel = supabase.channel(channelName);
  store.set(channelName, { channel, refCount: 1, removeTimeout: null });
  return channel;
}

function release(roomId: string, channel: RealtimeChannel): void {
  const channelName = `presence-${roomId}`;
  const entry = store.get(channelName);
  if (!entry || entry.channel !== channel) return;

  entry.refCount--;
  if (entry.refCount > 0) return;

  const supabase = createClient();
  entry.removeTimeout = setTimeout(() => {
    entry.removeTimeout = null;
    channel.untrack().then(() => {
      supabase.removeChannel(channel);
      store.delete(channelName);
    });
  }, REMOVE_DELAY_MS);
}

export { getOrCreate, release };
