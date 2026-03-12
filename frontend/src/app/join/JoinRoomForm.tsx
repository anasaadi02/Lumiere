"use client";

import { useActionState } from "react";
import { joinRoom, type JoinRoomState } from "./actions";

type Props = {
  isLoggedIn: boolean;
};

export function JoinRoomForm({ isLoggedIn }: Props) {
  const [state, formAction] = useActionState<JoinRoomState, FormData>(
    joinRoom,
    { error: null }
  );

  return (
    <form className="create-form" action={formAction}>
      {state?.error && (
        <div className="auth-error" role="alert">
          {state.error}
        </div>
      )}
      <div className="create-field">
        <label className="create-label" htmlFor="room-link">
          Room Link or Code
        </label>
        <input
          id="room-link"
          name="room-link"
          className="create-input"
          type="text"
          placeholder="e.g. lumiere.app/room/abc123 or abc123"
          autoComplete="off"
          required
        />
      </div>

      {isLoggedIn ? (
        <p className="create-form-note">
          You&apos;ll join as your profile name.
        </p>
      ) : (
        <div className="create-field">
          <label className="create-label" htmlFor="nickname">
            Your Name
          </label>
          <input
            id="nickname"
            name="nickname"
            className="create-input"
            type="text"
            placeholder="How others will see you"
            maxLength={32}
            autoComplete="off"
            required
          />
        </div>
      )}

      <div className="create-field">
        <label className="create-label" htmlFor="join-password">
          Room Password
          <span className="create-label-hint">If required</span>
        </label>
        <input
          id="join-password"
          name="join-password"
          className="create-input"
          type="password"
          placeholder="Leave empty if none"
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="btn-primary create-submit">
        Join the Room
      </button>
    </form>
  );
}
