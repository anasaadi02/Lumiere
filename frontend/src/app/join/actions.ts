"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export type JoinRoomState = { error: string | null };

function extractRoomId(input: string): string | null {
  const trimmed = input?.trim();
  if (!trimmed) return null;

  // Match /room/abc123 or room/abc123 or just abc123
  const match = trimmed.match(/(?:room\/)?([a-zA-Z0-9_-]+)$/);
  return match ? match[1] : trimmed;
}

export async function joinRoom(
  _prevState: JoinRoomState,
  formData: FormData
): Promise<JoinRoomState> {
  const supabase = await createClient();

  const roomInput = formData.get("room-link") as string;
  const nickname = (formData.get("nickname") as string)?.trim();
  const password = formData.get("join-password") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const roomId = extractRoomId(roomInput);
  if (!roomId) {
    return { error: "Please enter a room link or code" };
  }

  if (!user && !nickname) {
    return { error: "Please enter your name" };
  }

  const { data: room, error: fetchError } = await supabase
    .from("rooms")
    .select("id, name, password_hash, max_members")
    .eq("id", roomId)
    .single();

  if (fetchError || !room) {
    return { error: "Room not found. Check the link or code." };
  }

  if (room.password_hash) {
    if (!password) {
      return { error: "This room requires a password" };
    }
    const valid = await bcrypt.compare(password, room.password_hash);
    if (!valid) {
      return { error: "Incorrect password" };
    }
  }

  const url = user
    ? `/room/${roomId}`
    : `/room/${roomId}?nickname=${encodeURIComponent(nickname!)}`;
  redirect(url);
}
