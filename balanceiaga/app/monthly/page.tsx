"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { signIn, signOut, useSession } from "next-auth/react";

interface GCalEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
  colorId?: string;
}

const EVENT_COLORS = [
  "#4285F4", // blue
  "#7B61FF", // purple
  "#0B8043", // green
  "#F4511E", // red-orange
  "#F6BF26", // yellow
  "#039BE5", // cyan
  "#D50000", // red
  "#8E24AA", // deep purple
  "#616161", // grey
  "#E67C73", // pink
  "#33B679", // teal
];

function getEventColor(index: number) {
  return EVENT_COLORS[index % EVENT_COLORS.length];
}

export default function MonthlyView() {
  const router = useRouter();
  const { data: session } = useSession();
  const connected = !!session;
  const [gcalEvents, setGcalEvents] = useState<GCalEvent[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed, 8 = September
  const [currentYear, setCurrentYear] = useState(2026);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Sync calendar events
  const syncCalendar = useCallback(async () => {
    if (!connected) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        setGcalEvents(data.events ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setSyncing(false);
    }
  }, [connected]);

  useEffect(() => {
    if (connected) {
      syncCalendar();
    }
  }, [connected, syncCalendar]);

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Convert to Monday-start (0=Mon, 6=Sun)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Group events by day
  const eventsByDay: Record<number, GCalEvent[]> = {};
  gcalEvents.forEach((ev) => {
    const dateStr = ev.start?.dateTime || ev.start?.date || "";
    const d = new Date(dateStr);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  // Build calendar cells
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Get selected day events
  const selectedDayEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];

  return (
    <>
      <div className="screen" style={{ padding: "16px 16px 120px 16px" }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
          <div className="flex items-center" style={{ gap: "12px" }}>
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "#EEF0FF" }}
            >
              <ArrowLeft size={18} color="#6C63FF" />
            </button>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Calendar</p>
          </div>

          {/* Sync status */}
          {connected ? (
            <div className="flex items-center" style={{ gap: "8px" }}>
              <button
                onClick={syncCalendar}
                disabled={syncing}
                className="flex items-center rounded-full"
                style={{
                  padding: "6px 12px",
                  gap: "6px",
                  background: syncing ? "#E8E9FF" : "#E8F5E9",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: syncing ? "#6C63FF" : "#00C853" }}
                />
                <span className="text-[10px] font-bold" style={{ color: syncing ? "#6C63FF" : "#00C853" }}>
                  {syncing ? "Syncing…" : "Synced"}
                </span>
              </button>
              <button
                onClick={() => { signOut(); setGcalEvents([]); }}
                className="text-[10px] font-bold"
                style={{ color: "#FF4444", background: "none", border: "none", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center rounded-full"
              style={{
                padding: "6px 14px",
                gap: "6px",
                background: "#4285F4",
                border: "none",
                cursor: "pointer",
                color: "white",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[11px] font-bold">Connect</span>
            </button>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between" style={{ marginBottom: "16px", padding: "0 4px" }}>
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#EEF0FF", border: "none", cursor: "pointer" }}
          >
            <ChevronLeft size={16} color="#6C63FF" />
          </button>
          <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>
            {monthNames[currentMonth]} {currentYear}
          </p>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#EEF0FF", border: "none", cursor: "pointer" }}
          >
            <ChevronRight size={16} color="#6C63FF" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-2xl" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #F0F1FF", overflow: "hidden" }}>
          {/* Day headers */}
          <div className="grid grid-cols-7" style={{ borderBottom: "1px solid #F0F1FF" }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div
                key={d}
                className="text-center text-[10px] font-bold uppercase tracking-wider"
                style={{
                  padding: "10px 0",
                  color: d === "Sat" || d === "Sun" ? "#C4C2E8" : "#8B8FB5",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {calendarCells.map((day, idx) => {
              const dayEvents = day ? (eventsByDay[day] ?? []) : [];
              const isSelected = selectedDay === day;
              const isTodayCell = day ? isToday(day) : false;
              const isWeekend = idx % 7 >= 5;

              return (
                <button
                  key={idx}
                  onClick={() => { if (day) setSelectedDay(day); }}
                  className="flex flex-col items-stretch"
                  style={{
                    minHeight: "60px",
                    padding: "4px 3px",
                    border: "none",
                    borderRight: (idx + 1) % 7 !== 0 ? "1px solid #F8F9FF" : "none",
                    borderBottom: idx < calendarCells.length - 7 ? "1px solid #F8F9FF" : "none",
                    background: isSelected
                      ? "#EEF0FF"
                      : isWeekend
                        ? "#FAFBFF"
                        : "white",
                    cursor: day ? "pointer" : "default",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                >
                  {day && (
                    <>
                      {/* Day number */}
                      <div className="flex items-center justify-center" style={{ marginBottom: "2px" }}>
                        <span
                          className="flex items-center justify-center text-xs font-bold"
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: isTodayCell
                              ? "#6C63FF"
                              : "transparent",
                            color: isTodayCell
                              ? "white"
                              : isSelected
                                ? "#6C63FF"
                                : "#1A1A3E",
                          }}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Event pills */}
                      <div className="flex flex-col" style={{ gap: "1px" }}>
                        {dayEvents.slice(0, 2).map((ev, i) => (
                          <div
                            key={ev.id ?? i}
                            className="truncate"
                            style={{
                              padding: "1px 3px",
                              borderRadius: "3px",
                              background: getEventColor(i),
                              color: "white",
                              fontSize: "8px",
                              fontWeight: 700,
                              lineHeight: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ev.summary ?? "Event"}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span style={{ fontSize: "8px", fontWeight: 700, color: "#8B8FB5", paddingLeft: "2px" }}>
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Not connected prompt */}
        {!connected && (
          <div className="rounded-2xl" style={{ padding: "20px", marginTop: "16px", background: "#F8F9FF", border: "1px solid #E8E9FF", textAlign: "center" }}>
            <span className="text-2xl" style={{ display: "block", marginBottom: "8px" }}>📅</span>
            <p className="text-sm font-bold" style={{ color: "#1A1A3E", marginBottom: "4px" }}>
              Connect Google Calendar
            </p>
            <p className="text-xs" style={{ color: "#8B8FB5", marginBottom: "12px", lineHeight: 1.5 }}>
              Sign in to see your events, meetings, and deadlines right here.
            </p>
            <button
              onClick={() => signIn("google")}
              className="rounded-xl font-bold text-sm flex items-center justify-center gap-2 mx-auto"
              style={{
                padding: "10px 24px",
                background: "#4285F4",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        {/* Connected but no events */}
        {connected && gcalEvents.length === 0 && !syncing && (
          <div className="rounded-2xl" style={{ padding: "20px", marginTop: "16px", background: "#F8F9FF", border: "1px solid #E8E9FF", textAlign: "center" }}>
            <span className="text-2xl" style={{ display: "block", marginBottom: "8px" }}>🌱</span>
            <p className="text-sm font-bold" style={{ color: "#1A1A3E", marginBottom: "4px" }}>No upcoming events</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>Your calendar is clear. Enjoy the free time!</p>
          </div>
        )}

        {/* Syncing indicator */}
        {syncing && (
          <div className="flex items-center justify-center" style={{ padding: "24px", gap: "8px" }}>
            <div className="w-4 h-4 rounded-full animate-spin" style={{ border: "2px solid #6C63FF", borderTopColor: "transparent" }} />
            <span className="text-xs font-medium" style={{ color: "#8B8FB5" }}>Fetching your events…</span>
          </div>
        )}

        {/* Upcoming events list (when no day is selected) */}
        {connected && gcalEvents.length > 0 && !selectedDay && (
          <div style={{ marginTop: "16px" }}>
            <p className="text-sm font-bold" style={{ color: "#1A1A3E", marginBottom: "12px" }}>
              Upcoming Events
            </p>
            <div className="flex flex-col" style={{ gap: "8px" }}>
              {gcalEvents.slice(0, 6).map((ev, i) => {
                const startDt = ev.start?.dateTime ? new Date(ev.start.dateTime) : null;
                const endDt = ev.end?.dateTime ? new Date(ev.end.dateTime) : null;
                const isAllDay = !ev.start?.dateTime && !!ev.start?.date;

                return (
                  <div
                    key={ev.id ?? i}
                    className="rounded-xl flex items-center"
                    style={{ padding: "12px 14px", gap: "12px", background: "white", border: "1px solid #F0F1FF" }}
                  >
                    <div
                      className="w-1 rounded-full flex-shrink-0"
                      style={{ height: "36px", background: getEventColor(i) }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="text-sm font-bold truncate" style={{ color: "#1A1A3E" }}>
                        {ev.summary ?? "No title"}
                      </p>
                      <p className="text-xs" style={{ color: "#8B8FB5" }}>
                        {isAllDay
                          ? `${new Date(ev.start.date!).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · All day`
                          : startDt
                            ? `${startDt.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · ${startDt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${endDt ? ` – ${endDt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}`
                            : "No time set"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Day Detail Bottom Sheet ── */}
      {selectedDay && (
        <div
          className="fixed inset-y-0 z-50 flex flex-col justify-end"
          style={{
            width: "375px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedDay(null); }}
        >
          <div
            className="bg-white rounded-t-3xl"
            style={{ padding: "24px 20px 100px 20px", maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
              <div>
                <p className="text-xl font-bold" style={{ color: "#1A1A3E" }}>
                  {selectedDay} {monthNames[currentMonth]}
                </p>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>
                  {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString([], { weekday: "long" })}
                  {selectedDayEvents.length > 0
                    ? ` · ${selectedDayEvents.length} event${selectedDayEvents.length > 1 ? "s" : ""}`
                    : ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#F5F5F5", border: "none", cursor: "pointer" }}
              >
                <span className="text-[#1A1A3E] font-bold text-lg">×</span>
              </button>
            </div>

            {/* Events for the selected day */}
            {selectedDayEvents.length > 0 ? (
              <div className="flex flex-col" style={{ gap: "10px" }}>
                {selectedDayEvents.map((ev, i) => {
                  const startDt = ev.start?.dateTime ? new Date(ev.start.dateTime) : null;
                  const endDt = ev.end?.dateTime ? new Date(ev.end.dateTime) : null;
                  const isAllDay = !ev.start?.dateTime && !!ev.start?.date;
                  const color = getEventColor(i);

                  return (
                    <div
                      key={ev.id ?? i}
                      className="rounded-2xl flex"
                      style={{
                        padding: "16px",
                        gap: "14px",
                        background: `${color}08`,
                        border: `1px solid ${color}20`,
                      }}
                    >
                      <div
                        className="w-1 rounded-full flex-shrink-0"
                        style={{ background: color, minHeight: "40px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <p className="text-sm font-bold" style={{ color: "#1A1A3E", marginBottom: "4px" }}>
                          {ev.summary ?? "No title"}
                        </p>
                        <div className="flex items-center" style={{ gap: "8px" }}>
                          <span className="text-xs font-medium" style={{ color: "#8B8FB5" }}>
                            {isAllDay
                              ? "All day"
                              : startDt
                                ? `${startDt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${endDt ? ` – ${endDt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}`
                                : "No time"}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-xs" style={{ color: "#8B8FB5", marginTop: "6px", lineHeight: 1.4 }}>
                            {ev.description.slice(0, 100)}{ev.description.length > 100 ? "…" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center" style={{ padding: "40px 0" }}>
                <span className="text-3xl" style={{ marginBottom: "8px" }}>🌱</span>
                <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>No events</p>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>This day is free — perfect for a break!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}