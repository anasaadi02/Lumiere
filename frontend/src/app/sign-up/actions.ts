"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SignUpState = { error: string | null };

export async function signUp(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = (formData.get("username") as string)?.trim();
  const confirmPassword = formData.get("confirm-password") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username || undefined },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Explicitly upsert profile with username from form (ensures display name is correct)
  if (data.user && data.session && username) {
    await supabase.auth.setSession(data.session);
    await supabase.from("profiles").upsert(
      { id: data.user.id, username },
      { onConflict: "id" }
    );
  }

  redirect("/dashboard");
}
