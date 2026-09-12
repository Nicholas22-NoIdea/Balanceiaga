"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function GoogleSignInButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [syncing, setSyncing] = useState(false);
  const [events, setEvents] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to sync");
      }
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{
          padding: "16px",
          background: "#F8F9FF",
          border: "1px solid #E8E9FF",
        }}
      >
        <div
          className="w-5 h-5 rounded-full animate-spin"
          style={{ border: "2px solid #6C63FF", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  /* ── Not signed in: show the Sign-in button ── */
  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="w-full rounded-2xl flex items-center justify-between transition-all active:scale-[0.98]"
        style={{
          padding: "16px",
          background: "linear-gradient(135deg, #4285F4 0%, #5B9BF5 100%)",
          boxShadow: "0 4px 16px rgba(66,133,244,0.3)",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div className="flex items-center" style={{ gap: "12px" }}>
          {/* Google icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              Connect your account
            </p>
            <p className="text-sm font-bold text-white">
              Sync Google Calendar
            </p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    );
  }

  /* ── Signed in: show status + sync/sign-out ── */
  return (
    <div className="rounded-2xl" style={{ padding: "16px", background: "#F8F9FF", border: "1px solid #E8E9FF" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: events ? "16px" : "0" }}>
        <div className="flex items-center" style={{ gap: "12px" }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "#E8F5E9" }}
          >
            <span className="text-lg">✅</span>
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "#8B8FB5" }}>
              Google Calendar connected
            </p>
            <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>
              {session.user?.email ?? "Signed in"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: "8px", marginBottom: events ? "16px" : "0" }}>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex-1 rounded-xl text-center font-bold text-sm transition-all active:scale-[0.97]"
          style={{
            padding: "10px 0",
            background: syncing ? "#B3B0FF" : "#6C63FF",
            color: "white",
            border: "none",
            cursor: syncing ? "not-allowed" : "pointer",
          }}
        >
          {syncing ? "Syncing…" : "Sync Now"}
        </button>
        <button
          onClick={() => { signOut(); setEvents(null); }}
          className="rounded-xl text-center font-bold text-sm transition-all active:scale-[0.97]"
          style={{
            padding: "10px 16px",
            background: "#EEF0FF",
            color: "#6C63FF",
            border: "none",
            cursor: "pointer",
          }}
        >
          Disconnect
        </button>
      </div>

      {error && (
        <div className="rounded-xl" style={{ padding: "12px", background: "#FFF0F0", border: "1px solid rgba(255,68,68,0.2)" }}>
          <p className="text-xs font-bold" style={{ color: "#FF4444" }}>⚠️ {error}</p>
        </div>
      )}

      {events && events.length > 0 && (
        <div className="flex flex-col" style={{ gap: "8px" }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8B8FB5" }}>
            Upcoming Events ({events.length})
          </p>
          {events.slice(0, 5).map((ev: any, i: number) => (
            <div
              key={ev.id ?? i}
              className="rounded-xl flex items-center"
              style={{ padding: "12px", gap: "10px", background: "white", border: "1px solid #F0F1FF" }}
            >
              <div
                className="w-1 rounded-full"
                style={{ height: "32px", background: "#6C63FF" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="text-sm font-bold truncate" style={{ color: "#1A1A3E" }}>
                  {ev.summary ?? "No title"}
                </p>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>
                  {ev.start?.dateTime
                    ? new Date(ev.start.dateTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                    : ev.start?.date ?? "All day"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {events && events.length === 0 && (
        <div className="rounded-xl text-center" style={{ padding: "16px", background: "white" }}>
          <p className="text-sm" style={{ color: "#8B8FB5" }}>🎉 No upcoming events — you're free!</p>
        </div>
      )}
    </div>
  );
}
