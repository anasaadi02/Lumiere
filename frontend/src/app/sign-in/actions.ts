"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SignInState = { error: string | null };

export async function signIn(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";
  redirect(safeRedirect);
}
