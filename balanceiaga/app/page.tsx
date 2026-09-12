"use client";
import Link from "next/link";
import { Bell, ChevronRight, TrendingUp, AlertTriangle, Brain } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import LoadRing from "@/components/LoadRing";
import CategoryBar from "@/components/CategoryBar";
import TaskCard from "@/components/TaskCard";
import { mockCapacity, mockCategoryLoads, mockTasks } from "@/lib/mockData";
import { useNotifications } from "@/lib/notificationStore";

export default function Dashboard() {
  const cap = mockCapacity;
  const { unreadCount } = useNotifications();
  const todayTasks = mockTasks.filter(
    (t) => t.status !== "done" && t.scheduledSlots.some((s) => s.day === "Mon")
  );

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 120px 16px" }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: "32px" }}>
          <Link href="/profile" className="flex items-center" style={{ gap: "12px" }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)" }}
            >
              AM
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "#8B8FB5" }}>Welcome back,</p>
              <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>Andrew Mike 👋</p>
            </div>
          </Link>
          <Link href="/notifications" className="relative transition-transform active:scale-95">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#EEF0FF" }}
            >
              <Bell size={18} color="#6C63FF" />
            </div>
            {unreadCount > 0 && (
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#FF4444", border: "2px solid #F0F1FF" }}
              >
                <span className="text-white font-bold" style={{ fontSize: "9px" }}>{unreadCount}</span>
              </div>
            )}
          </Link>
        </div>

        {/* ── Today's Balance Module ── */}
        {cap.totalWorkload > 12 && (
          <Link href="/recovery/emergency" className="block w-full rounded-2xl flex items-center justify-between" style={{ padding: "16px", margin: "24px 0", background: "linear-gradient(135deg, #FF4444 0%, #D32F2F 100%)", boxShadow: "0 4px 16px rgba(255,68,68,0.3)" }}>
            <div className="flex items-center" style={{ gap: "12px" }}>
              <span className="text-2xl">🛟</span>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Critical Overload Detected</p>
                <p className="text-xs text-red-100" style={{ color: "rgba(255,255,255,0.8)" }}>Tap to triage your schedule</p>
              </div>
            </div>
            <ChevronRight size={20} color="white" />
          </Link>
        )}

        <div className="relative" style={{ marginBottom: "32px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "16px", padding: "0 4px" }}>
            <h2 className="text-xl font-black" style={{ color: "#1A1A3E" }}>Today&apos;s Balance</h2>
            <div className="flex items-center rounded-full" style={{ padding: "4px 12px", gap: "6px", background: "#EEF0FF", border: "1px solid #D4D1FF" }}>
              <span className="text-xs">🌱</span>
              <span className="text-xs font-bold" style={{ color: "#6C63FF" }}>4 Day Streak</span>
            </div>
          </div>

          <div className="rounded-3xl" style={{ padding: "24px", background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #F0F1FF" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#FF4444" }}>Workload Score</p>
                <div className="flex items-baseline" style={{ gap: "8px" }}>
                  <span className="text-4xl font-black" style={{ color: "#FF4444" }}>84</span>
                  <span className="text-base font-bold" style={{ color: "#FFB3B3" }}>/ 100 🔴</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "Mental", val: cap.mentalLoad, color: "#6C63FF", bg: "#EEF0FF" },
                { label: "Physical", val: cap.physicalLoad, color: "#00C9B1", bg: "#E0F7FA" },
                { label: "Social", val: cap.socialLoad, color: "#FF6B9D", bg: "#FFF0F5" },
                { label: "Time Pressure", val: cap.timePressure, color: "#FF7043", bg: "#FFF3F0" }
              ].map(load => (
                <div key={load.label} className="flex items-center" style={{ gap: "12px" }}>
                  <span className="text-xs font-bold w-24" style={{ color: "#1A1A3E" }}>{load.label}</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: load.bg }}>
                    <div className="h-full rounded-full" style={{ width: `${load.val}%`, background: load.color }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: load.color }}>{load.val}</span>
                </div>
              ))}
            </div>

            {/* AI Contextual Insight */}
            <div className="rounded-2xl" style={{ padding: "16px", marginBottom: "16px", background: "#F8F9FF", border: "1px solid #E8E9FF" }}>
              <div className="flex items-start" style={{ gap: "12px" }}>
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>High mental workload today.</p>
                  <p className="text-xs" style={{ color: "#8B8FB5", lineHeight: 1.5, marginBottom: "12px" }}>
                    You&apos;ve been working for 2 hours and have 25 minutes before your next task.
                  </p>
                  <div className="flex items-center rounded-xl" style={{ padding: "12px", gap: "8px", marginBottom: "12px", background: "white" }}>
                    <span className="text-lg">🚶</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#6C63FF" }}>Suggestion</p>
                      <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Take a 15-min reset</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex" style={{ gap: "8px" }}>
                <Link href="/recovery" className="flex-1 rounded-xl text-center font-bold text-sm" style={{ padding: "12px 0", background: "#6C63FF", color: "white" }}>
                  Recover
                </Link>
                <Link href="/rebalance" className="flex-1 rounded-xl text-center font-bold text-sm" style={{ padding: "12px 0", background: "#EEF0FF", color: "#6C63FF" }}>
                  Rebalance Day
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live Task Banner */}
        <Link href="/notifications/task-status"
          className="w-full rounded-2xl flex items-center mb-6"
          style={{ padding: "16px", gap: "12px", background: "linear-gradient(135deg, #1A1A3E, #2D2B6B)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(108,99,255,0.4)" }}>
            <Brain size={20} color="white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white">Database Assignment</p>
            <p className="text-xs" style={{ color: "#9B99CC" }}>8:00 PM — 10:00 PM • Tap to track live</p>
          </div>
          <div>
            <div className="flex items-center rounded-full mb-1" style={{ gap: "4px", padding: "4px 8px", background: "rgba(108,99,255,0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ margin: "0 5px" }} />
              <span className="text-xs font-bold" style={{ marginRight: "5px", color: "#A89CFF" }}>Scheduled</span>
            </div>
            <ChevronRight size={16} color="#9B99CC" className="ml-auto" />
          </div>
        </Link>

        {/* Category Breakdown */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold" style={{ color: "#1A1A3E", marginBottom: "10px" }}>Category Breakdown</p>
            <Link href="/capacity" className="flex items-center gap-1">
              <span className="text-xs" style={{ color: "#6C63FF" }}>Details</span>
              <ChevronRight size={14} color="#6C63FF" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {mockCategoryLoads.filter(c => c.hours > 0).map((load) => (
              <CategoryBar key={load.category} load={load} maxHours={cap.totalWorkload} />
            ))}
          </div>
        </div>

        {/* Monthly View Link */}
        <Link href="/monthly" className="card mb-6 flex items-center justify-between" style={{ background: "#F8F9FF", border: "1px solid #E8E9FF" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <span className="text-lg">📅</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Monthly Calendar</p>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>Plan ahead & prevent overload</p>
            </div>
          </div>
          <ChevronRight size={16} color="#6C63FF" />
        </Link>

        {/* 📉 Deadline Heatmap (Moved from Monthly) 📉 */}
        <div className="mb-6">
          <div className="flex items-center justify-between" >
            <p className="text-base font-bold" style={{ marginBottom: "10px", color: "#1A1A3E" }}>Deadline Clusters</p>
          </div>

          <div className="rounded-2xl" style={{ padding: "16px", border: "1px solid rgba(255,68,68,0.2)", background: "#FFF0F0" }}>
            <div className="flex items-start" style={{ gap: 7 }}>
              <div className="mt-0.5 flex-shrink-0"><AlertTriangle size={18} color="#FF4444" /></div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#D32F2F", marginBottom: "4px" }}>⚠️ 18 September Cluster</p>
                <p className="text-xs" style={{ color: "#B71C1C", marginBottom: "12px", lineHeight: 1.5 }}>You have 3 major assignments due within 2 days. Starting them only on their due dates may create a high workload.</p>
                <Link href="/rebalance" className="inline-flex items-center rounded-lg text-xs font-bold" style={{ gap: "6px", padding: "8px 12px", background: "#FF4444", color: "white" }}>
                  Help Me Plan <TrendingUp size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold" style={{ color: "#1A1A3E", margin: "10px 0" }}>Today&apos;s Sessions</p>
            <span className="text-xs" style={{ color: "#8B8FB5" }}>Mon, 7 Sep</span>
          </div>
          <div className="flex flex-col" style={{ gap: 7 }}>
            {todayTasks.map((task) => {
              const slot = task.scheduledSlots.find((s) => s.day === "Mon")!;
              return <TaskCard key={task.id} task={task} showSlot={slot} />;
            })}
          </div>
        </div>
      </div >
      <BottomNav />
    </>
  );
}
