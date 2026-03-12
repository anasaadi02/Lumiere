"use client";

import { useActionState } from "react";
import { createRoom, type CreateRoomState } from "./actions";

export function CreateRoomForm() {
  const [state, formAction] = useActionState<CreateRoomState, FormData>(
    createRoom,
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
        <label className="create-label" htmlFor="room-name">
          Room Name
        </label>
        <input
          id="room-name"
          name="room-name"
          className="create-input"
          type="text"
          placeholder="e.g. Friday Night Cinema"
          maxLength={48}
          autoComplete="off"
          required
        />
      </div>

      <div className="create-field">
        <label className="create-label" htmlFor="room-password">
          Password
          <span className="create-label-hint">Optional</span>
        </label>
        <input
          id="room-password"
          name="room-password"
          className="create-input"
          type="password"
          placeholder="Leave empty for an open room"
          autoComplete="new-password"
        />
      </div>

      <button type="submit" className="btn-primary create-submit">
        Open the Room
      </button>
    </form>
  );
}
