"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "bagco_admin_session";
const DEMO_PASSCODE = "bagco123";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === DEMO_PASSCODE) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (authed === null) {
    return null;
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-leather">
          Bag Co. · Staff only
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold">
          Admin sign-in
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Demo passcode is shown here for convenience:{" "}
          <code className="rounded bg-[var(--card)] px-1.5 py-0.5">
            {DEMO_PASSCODE}
          </code>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            autoFocus
            className="input"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError(false);
            }}
          />
          {error && (
            <p className="text-sm text-rose-600">That passcode isn&apos;t right.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-leather py-2.5 text-sm font-medium text-white transition hover:bg-leather-dark"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
