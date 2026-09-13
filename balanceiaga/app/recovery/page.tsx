"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarPlus, CheckCircle2, X, Clock, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { recoveryCatalog, RecoveryActivity } from "@/lib/recoveryData";
import { useState } from "react";
import { useTaskStore } from "@/lib/taskStore";

interface ScheduleModal {
  activity: RecoveryActivity;
}

export default function RecoveryHub() {
  const router = useRouter();
  const addTask = useTaskStore((s) => s.addTask);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [scheduling, setScheduling] = useState<ScheduleModal | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [scheduledTime, setScheduledTime] = useState<string>("15:00");
  const [successInfo, setSuccessInfo] = useState<{ title: string; date: string; startTime: string; endTime: string } | null>(null);

  const categories = ["All", "Mind", "Body", "Fun", "Environment", "Social", "Rest"];
  const displayedActivities = activeCategory === "All"
    ? recoveryCatalog
    : recoveryCatalog.filter(a => a.category === activeCategory);

  const getDayLabel = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const calcEndTime = (start: string, minutes: number) => {
    const [h, min] = start.split(":").map(Number);
    const total = h * 60 + min + minutes;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const handleConfirm = () => {
    if (!scheduling) return;
    const act = scheduling.activity;
    const endTime = calcEndTime(scheduledTime, act.durationMinutes);
    const dateObj = new Date(scheduledDate + "T00:00:00");
    const dayAbbr = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    const newTask = {
      id: `recovery-${act.id}-${Date.now()}`,
      title: `${act.emoji} ${act.title}`,
      category: "Other" as const,
      deadline: scheduledDate,
      estimatedHours: act.durationMinutes / 60,
      sessions: 1,
      sessionDuration: act.durationMinutes / 60,
      priority: "Low" as const,
      flexibility: "High" as const,
      isProtected: false,
      status: "pending" as const,
      isRecovery: true,
      recoveryType: act.category,
      scheduledSlots: [
        { day: dayAbbr, date: scheduledDate, startTime: scheduledTime, endTime },
      ],
    };

    addTask(newTask);

    setSuccessInfo({ title: `${act.emoji} ${act.title}`, date: scheduledDate, startTime: scheduledTime, endTime });
    setScheduling(null);
  };

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 120px 16px" }}>
        {/* Header */}
        <div className="flex items-center" style={{ gap: "16px", marginBottom: "24px" }}>
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <ChevronLeft size={20} color="#1A1A3E" />
          </button>
          <h1 className="text-xl font-black" style={{ color: "#1A1A3E" }}>Recovery Hub</h1>
        </div>

        {/* Success Banner */}
        {successInfo && (
          <div
            className="rounded-2xl mb-5 flex items-start justify-between"
            style={{ padding: "16px", background: "linear-gradient(135deg, #00C853, #00B248)", boxShadow: "0 4px 16px rgba(0,200,83,0.25)" }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} color="white" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <p className="text-sm font-bold text-white">{successInfo.title} scheduled!</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {getDayLabel(successInfo.date)} · {successInfo.startTime} – {successInfo.endTime}
                </p>
                <button
                  onClick={() => router.push(`/daily?date=${successInfo.date}`)}
                  className="mt-2 text-xs font-bold rounded-lg"
                  style={{ padding: "6px 12px", background: "rgba(255,255,255,0.25)", color: "white" }}
                >
                  View in Daily Schedule →
                </button>
              </div>
            </div>
            <button onClick={() => setSuccessInfo(null)}>
              <X size={16} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
        )}

        {/* Intro */}
        <div className="rounded-3xl" style={{ padding: "24px", marginBottom: "24px", background: "linear-gradient(135deg, #1A1A3E 0%, #2D2B6B 100%)" }}>
          <p className="text-2xl mb-2">🌱</p>
          <p className="text-lg font-bold text-white mb-2">Schedule your recovery.</p>
          <p className="text-sm" style={{ color: "#B8B5FF", lineHeight: 1.5 }}>
            Recovery time is not wasted time. It is part of maintaining a sustainable workload.
          </p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto" style={{ gap: "8px", paddingBottom: "8px", marginBottom: "16px", scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full font-bold text-sm flex-shrink-0 transition-colors"
              style={{
                padding: "8px 16px",
                background: activeCategory === cat ? "#6C63FF" : "white",
                color: activeCategory === cat ? "white" : "#8B8FB5",
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(108,99,255,0.2)" : "0 2px 8px rgba(0,0,0,0.03)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="flex flex-col" style={{ gap: "12px" }}>
          {displayedActivities.map(act => (
            <div
              key={act.id}
              className="rounded-2xl flex items-center justify-between"
              style={{ padding: "16px", background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center" style={{ gap: "16px" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#F8F9FF" }}>
                  {act.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{act.title}</p>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{act.durationMinutes} min · {act.category}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#B0B3D6" }}>{act.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setScheduling({ activity: act });
                  setSuccessInfo(null);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 flex-shrink-0"
                style={{ background: "#EEF0FF" }}
              >
                <CalendarPlus size={18} color="#6C63FF" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {scheduling && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setScheduling(null); }}
        >
          <div
            className="bg-white w-full max-w-[420px] rounded-t-3xl flex flex-col animate-slide-up"
            style={{ padding: "24px 20px 40px", maxHeight: "85vh", overflowY: "auto" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#F8F9FF" }}>
                  {scheduling.activity.emoji}
                </div>
                <div>
                  <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>{scheduling.activity.title}</p>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{scheduling.activity.durationMinutes} min · {scheduling.activity.category}</p>
                </div>
              </div>
              <button
                onClick={() => setScheduling(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#F5F5F7" }}
              >
                <X size={16} color="#1A1A3E" />
              </button>
            </div>

            <p className="text-sm font-bold mb-4" style={{ color: "#1A1A3E" }}>When do you want to schedule this?</p>

            {/* Date Picker */}
            <div className="rounded-2xl mb-3" style={{ padding: "14px 16px", border: "1.5px solid #EBEBFF", background: "#F8F9FF" }}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} color="#6C63FF" />
                <span className="text-xs font-bold" style={{ color: "#6C63FF" }}>DATE</span>
              </div>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full text-sm font-bold bg-transparent outline-none"
                style={{ color: "#1A1A3E" }}
              />
            </div>

            {/* Time Picker */}
            <div className="rounded-2xl mb-5" style={{ padding: "14px 16px", border: "1.5px solid #EBEBFF", background: "#F8F9FF" }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} color="#6C63FF" />
                <span className="text-xs font-bold" style={{ color: "#6C63FF" }}>START TIME</span>
              </div>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full text-sm font-bold bg-transparent outline-none"
                style={{ color: "#1A1A3E" }}
              />
            </div>

            {/* Preview */}
            <div className="rounded-xl mb-5 flex items-center gap-2" style={{ padding: "12px 14px", background: "#EEF0FF" }}>
              <span className="text-lg">{scheduling.activity.emoji}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: "#6C63FF" }}>
                  {getDayLabel(scheduledDate)} · {scheduledTime} – {calcEndTime(scheduledTime, scheduling.activity.durationMinutes)}
                </p>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>{scheduling.activity.durationMinutes} minutes blocked</p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-transform active:scale-95"
              style={{ background: "linear-gradient(135deg, #6C63FF, #4F46E5)" }}
            >
              ✓ Add to My Schedule
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
