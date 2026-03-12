"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

export type CreateRoomState = { error: string | null };

export async function createRoom(
  _prevState: CreateRoomState,
  formData: FormData
): Promise<CreateRoomState> {
  const supabase = await createClient();

  const name = (formData.get("room-name") as string)?.trim();
  const password = formData.get("room-password") as string | null;

  if (!name) {
    return { error: "Room name is required" };
  }

  const id = nanoid(8);
  let passwordHash: string | null = null;

  if (password && password.length > 0) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("rooms").insert({
    id,
    name,
    password_hash: passwordHash,
    created_by: user?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/room/${id}`);
}
