"use client";

import { useActionState } from "react";
import { signUp, type SignUpState } from "./actions";

export function SignUpForm() {
  const [state, formAction] = useActionState<SignUpState, FormData>(signUp, { error: null });

  return (
    <form className="auth-form" action={formAction}>
      {state?.error && (
        <div className="auth-error" role="alert">
          {state.error}
        </div>
      )}
      <div className="auth-field">
        <label className="auth-label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          className="auth-input"
          type="text"
          placeholder="johndoe"
          autoComplete="username"
          required
        />
      </div>

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="confirm-password">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          className="auth-input"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <button type="submit" className="btn-primary auth-submit">
        Create Account
      </button>
    </form>
  );
}
