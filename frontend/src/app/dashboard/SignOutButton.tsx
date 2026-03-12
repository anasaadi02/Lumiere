"use client";

import { signOut } from "./actions";

export function SignOutButton() {
  return (
    <form action={signOut} style={{ display: "contents" }}>
      <button type="submit" className="nav-sign-out">
        Sign out
      </button>
    </form>
  );
}
