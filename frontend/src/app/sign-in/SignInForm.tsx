"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "./actions";

type Props = { redirectTo?: string };

export function SignInForm({ redirectTo }: Props) {
  const [state, formAction] = useActionState<SignInState, FormData>(signIn, { error: null });

  return (
    <form className="auth-form" action={formAction}>
      {redirectTo && (
        <input type="hidden" name="redirect" value={redirectTo} />
      )}
      {state?.error && (
        <div className="auth-error" role="alert">
          {state.error}
        </div>
      )}
      <div className="auth-field">
        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          className="auth-input"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          className="auth-input"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <a href="/forgot-password" className="auth-forgot">
        Forgot password?
      </a>

      <button type="submit" className="btn-primary auth-submit">
        Sign In
      </button>
    </form>
  );
}
