"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "bagco_admin_session";
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "bagco123";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
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
          North Pole · Staff only
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Admin sign-in</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This is a separate login from the customer account — staff credentials
          only. Demo login:{" "}
          <code className="rounded bg-[var(--card)] px-1.5 py-0.5">
            {DEMO_USERNAME} / {DEMO_PASSWORD}
          </code>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            autoFocus
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
          {error && (
            <p className="text-sm text-rose-600">
              Those credentials aren&apos;t right.
            </p>
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

export function adminSignOut() {
  window.sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "/admin";
}
