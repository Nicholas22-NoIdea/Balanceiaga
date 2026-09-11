"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockTasks } from "@/lib/mockData";
import Link from "next/link";

export default function MonthlyView() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [lastSynced, setLastSynced] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Mocking calendar for September 2026
  // Sep 1, 2026 is a Tuesday.
  // We'll generate a grid where Monday is the first day.
  // So index 0 (Mon) is empty, index 1 (Tue) is 1.
  const daysInMonth = 30;
  const startOffset = 1; // Tuesday

  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const currentStr = `2026-09-${i.toString().padStart(2, "0")}`;
    const dayTasks = mockTasks.filter(t => t.scheduledSlots.some(s => s.date === currentStr));

    const totalWorkload = dayTasks.reduce((sum, t) => {
      const slot = t.scheduledSlots.find(s => s.date === currentStr);
      if (!slot) return sum;
      const [h1, m1] = slot.startTime.split(":").map(Number);
      const [h2, m2] = slot.endTime.split(":").map(Number);
      return sum + ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
    }, 0);

    const workloadScore = Math.round((totalWorkload / 8) * 100);

    let status = "low"; // green
    if (workloadScore > 75) status = "high"; // red
    else if (workloadScore > 40) status = "medium"; // yellow

    calendarCells.push({ day: i, status });
  }

  // Pad the end to complete the week
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const getStatusColor = (s: string) => {
    if (s === "high") return "#FF4444";
    if (s === "medium") return "#FFB74D";
    if (s === "low") return "#00C853";
    return "transparent";
  };

  const getStatusBg = (s: string) => {
    if (s === "high") return "rgba(255, 68, 68, 0.1)";
    if (s === "medium") return "rgba(255, 183, 77, 0.1)";
    if (s === "low") return "rgba(0, 200, 83, 0.1)";
    return "transparent";
  };

  return (
    <>
      <div className="screen px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: "#EEF0FF" }}>
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Monthly View</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>September 2026</p>
          </div>
        </div>

        {/* ── Calendar Grid ── */}
        <div className="rounded-2xl mb-6" style={{ padding: "16px", background: "white", marginBottom: "24px" }}>
          <div className="flex items-center justify-between mb-4" style={{ marginBottom: "16px" }}>
            <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>September 2026</p>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#EEF0FF" }}>
                <ChevronRight className="rotate-180" size={14} color="#6C63FF" />
              </div>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#EEF0FF" }}>
                <ChevronRight size={14} color="#6C63FF" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold" style={{ color: "#8B8FB5" }}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => { if (cell) setSelectedDay(cell.day); }}
                className="aspect-square rounded-lg flex flex-col items-center justify-center relative"
                style={{
                  background: cell ? getStatusBg(cell.status) : "transparent",
                  border: selectedDay === cell?.day ? "2px solid #6C63FF" : "none",
                  cursor: cell ? "pointer" : "default"
                }}
              >
                {cell && (
                  <>
                    <span className="text-sm font-bold" style={{ color: cell.status === "low" ? "#00C853" : cell.status === "medium" ? "#F57C00" : "#D32F2F" }}>
                      {cell.day}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full absolute bottom-1.5" style={{ background: getStatusColor(cell.status) }} />
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #F0F1FF" }}>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#00C853" }} /> <span className="text-xs text-gray-500">Low</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#FFB74D" }} /> <span className="text-xs text-gray-500">Moderate</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#FF4444" }} /> <span className="text-xs text-gray-500">High</span></div>
          </div>
        </div>

        {/* ── Section: Integrations ── */}
        <div className="rounded-2xl mb-6" style={{ padding: "16px", background: "#F8F9FF", border: "1px solid #E8E9FF", marginBottom: "24px" }}>
          <div className="flex items-start gap-4 mb-4" style={{ marginBottom: "16px" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <span className="text-xl">📅</span>
            </div>
            <div>
              <p className="text-base font-bold mb-1" style={{ color: "#1A1A3E" }}>Google Calendar</p>
              <p className="text-xs" style={{ color: "#8B8FB5", lineHeight: 1.5 }}>
                Connect to automatically import assignments and plan your month.
              </p>
            </div>
          </div>

          {!connected ? (
            <button
              onClick={() => {
                setConnected(true);
                setLastSynced("Just now");
              }}
              className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ padding: "10px 0", margin: "5px 0", background: "#6C63FF", color: "white" }}
            >
              Connect Google Calendar
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(0, 200, 83, 0.1)" }}>
                <span className="text-xs font-bold" style={{ color: "#00C853" }}>✅ Connected</span>
                <span className="text-xs font-medium ml-auto" style={{ color: "#8B8FB5" }}>Last synced: {lastSynced}</span>
              </div>
              <div className="flex gap-2" style={{ margin: "3px 0" }}>
                <button
                  onClick={() => setLastSynced("Just now")}
                  className="flex-1 rounded-xl font-bold text-sm"
                  style={{ padding: "7px 0", background: "#1A1A3E", color: "white" }}
                >
                  Sync Now
                </button>
                <button
                  onClick={() => setConnected(false)}
                  className="rounded-xl font-bold text-sm"
                  style={{ padding: "7px 16px", background: "#FFF0F0", color: "#FF4444" }}
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Monthly Workload Insights ── */}
        <div className="mb-6" style={{ marginBottom: "24px" }}>
          <p className="text-base font-bold mb-3" style={{ color: "#1A1A3E", marginBottom: "12px" }}>📊 September Workload</p>
          <div className="rounded-2xl" style={{ padding: "16px", background: "linear-gradient(135deg, #1A1A3E 0%, #2D2B6B 100%)" }}>
            <div className="grid grid-cols-2 gap-4 mb-4" style={{ marginBottom: "16px" }}>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: "#9B99CC", marginBottom: "4px" }}>Total Hours</p>
                <p className="text-xl font-bold text-white">38h</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: "#9B99CC", marginBottom: "4px" }}>Academic Ratio</p>
                <p className="text-xl font-bold text-white">72%</p>
              </div>
            </div>
            <div className="rounded-xl" style={{ padding: "16px", background: "rgba(255,255,255,0.05)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#9B99CC", marginBottom: "8px" }}>Highest Workload Period:</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">17–19 September</p>
                <span className="rounded-md text-[10px] font-bold" style={{ padding: "4px 8px", background: "rgba(255,68,68,0.2)", color: "#FFB3B3" }}>🔴 High</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Deadline Heatmap ── */}
        <div className="mb-6" style={{ marginBottom: "24px" }}>
          <div className="flex items-center justify-between mb-3" style={{ marginBottom: "12px" }}>
            <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>Deadline Clusters</p>
          </div>

          <div className="rounded-2xl mb-3" style={{ padding: "16px", border: "1px solid rgba(255,68,68,0.2)", background: "#FFF0F0", marginBottom: "12px" }}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><AlertTriangle size={18} color="#FF4444" /></div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "#D32F2F", marginBottom: "4px" }}>⚠️ 18 September Cluster</p>
                <p className="text-xs mb-3" style={{ color: "#B71C1C", marginBottom: "12px", lineHeight: 1.5 }}>You have 3 major assignments due within 2 days. Starting them only on their due dates may create a high workload.</p>
                <Link href="/rebalance" className="inline-flex items-center gap-1.5 rounded-lg text-xs font-bold" style={{ padding: "8px 12px", background: "#FF4444", color: "white" }}>
                  Help Me Plan <TrendingUp size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Long-Term Planning ── */}
        <div className="mb-6" style={{ marginBottom: "24px" }}>
          <p className="text-base font-bold mb-3" style={{ color: "#1A1A3E", marginBottom: "12px" }}>🔮 Looking Ahead</p>
          <div className="rounded-2xl" style={{ padding: "16px", background: "#F8F9FF" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#1A1A3E", marginBottom: "8px" }}>The week of Sep 14–20 is heavily loaded.</p>
            <p className="text-xs mb-3" style={{ color: "#6B7280", marginBottom: "12px", lineHeight: 1.5 }}>You currently have free capacity this week. **Suggestion:** Start your SQL Queries project this week to reduce next week's workload.</p>
            <Link href="/rebalance" className="w-full rounded-xl font-bold text-xs flex items-center justify-center gap-2" style={{ padding: "12px 0", background: "#1A1A3E", color: "white" }}>
              Preview Rebalance
            </Link>
          </div>
        </div>

      </div>

      {/* ── Day Details Modal ── */}
      {selectedDay && (() => {
        const selectedDateStr = `2026-09-${selectedDay.toString().padStart(2, "0")}`;
        const dayTasks = mockTasks.filter(t => t.scheduledSlots.some(s => s.date === selectedDateStr));
        const totalWorkload = dayTasks.reduce((sum, t) => {
          const slot = t.scheduledSlots.find(s => s.date === selectedDateStr);
          if (!slot) return sum;
          const [h1, m1] = slot.startTime.split(":").map(Number);
          const [h2, m2] = slot.endTime.split(":").map(Number);
          return sum + ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
        }, 0);
        const workloadScore = Math.round((totalWorkload / 8) * 100); // Mock score out of 8 ideal hours

        return (
          <div
            className="fixed inset-y-0 z-50 flex flex-col justify-end"
            style={{
              width: "375px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.4)"
            }}
          >
            <div className="bg-white rounded-t-3xl" style={{ padding: "24px 24px 100px 24px", maxHeight: "80vh", overflowY: "auto" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xl font-bold" style={{ color: "#1A1A3E", marginBottom: "4px" }}>{selectedDay} September</p>
                  <p className="text-sm font-medium" style={{ color: "#8B8FB5" }}>
                    Workload: {workloadScore}/100 {workloadScore > 75 ? "🔴" : workloadScore > 40 ? "🟡" : "🟢"}
                  </p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F5F5F5" }}>
                  <span className="text-[#1A1A3E] font-bold text-lg">×</span>
                </button>
              </div>

              {dayTasks.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {dayTasks.map(task => {
                    const slot = task.scheduledSlots.find(s => s.date === selectedDateStr)!;
                    return (
                      <div key={task.id} className="rounded-2xl" style={{ padding: "16px", background: task.category === "Academic" ? "#F8F9FF" : task.category === "Social" ? "#FFF0F5" : "#FFF3F0", border: `1px solid ${task.category === "Academic" ? "#E8E9FF" : task.category === "Social" ? "#FFE4ED" : "#FFE5DD"}` }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{task.title}</p>
                          <span className="text-[10px] font-bold rounded-md" style={{ padding: "4px 8px", background: task.category === "Academic" ? "#EEF0FF" : "white", color: task.category === "Academic" ? "#6C63FF" : task.category === "Social" ? "#FF6B9D" : "#FF7043" }}>{task.category}</span>
                        </div>
                        <p className="text-xs" style={{ color: "#8B8FB5", marginBottom: "12px" }}>Source: {task.source === "classroom" ? "Google Calendar" : "Manual"}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", marginBottom: "2px" }}>Time</span>
                            <span className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{slot.startTime} – {slot.endTime}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", marginBottom: "2px" }}>Deadline</span>
                            <span className="text-sm font-bold" style={{ color: task.deadline === selectedDateStr ? "#FF4444" : "#1A1A3E" }}>
                              {new Date(task.deadline).getDate()} Sep
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <Link href="/rebalance" className="w-full mt-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ padding: "14px 0", background: "#1A1A3E", color: "white" }}>
                    Manage Day <TrendingUp size={16} />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center" style={{ padding: "40px 0" }}>
                  <span className="text-3xl mb-2">🌱</span>
                  <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>No major tasks scheduled</p>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>Good day for a recovery break.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <BottomNav />
    </>
  );
}