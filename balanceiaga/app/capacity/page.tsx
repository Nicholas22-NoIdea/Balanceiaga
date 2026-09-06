import Link from "next/link";
import { ArrowLeft, TrendingUp, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockCapacity, mockTasks } from "@/lib/mockData";

export default function CapacityView() {
  const cap = mockCapacity;

  const calcRows = [
    { label: "Available time",     value: cap.availableTime,       sign: "",  color: "#1A1A3E" },
    { label: "Fixed commitments",  value: cap.fixedCommitments,    sign: "−", color: "#FF7043" },
    { label: "Protected time",     value: cap.protectedTime,       sign: "−", color: "#FF6B9D" },
    { label: "Planning buffer",    value: cap.buffer,              sign: "−", color: "#00C9B1" },
    { label: "Realistic capacity", value: cap.realisticCapacity,   sign: "=", color: "#6C63FF" },
  ];

  return (
    <>
      <div className="screen px-4 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "#EEF0FF" }}
          >
            <ArrowLeft size={18} color="#6C63FF" />
          </Link>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Capacity View</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>Week of 7–13 Sep 2026</p>
          </div>
        </div>

        {/* Overload status */}
        {cap.isOverloaded && (
          <div
            className="card mb-4 flex items-center gap-3"
            style={{ background: "#FFF0F0", border: "1.5px solid #FFD0D0" }}
          >
            <AlertTriangle size={20} color="#FF4444" />
            <div>
              <p className="text-sm font-bold" style={{ color: "#FF4444" }}>You are overloaded</p>
              <p className="text-xs" style={{ color: "#FF8888" }}>
                {cap.totalWorkload}h workload vs {cap.realisticCapacity}h capacity (+{cap.overloadHours}h)
              </p>
            </div>
          </div>
        )}

        {/* Capacity formula */}
        <div className="card mb-8">
          <p className="text-base font-bold mb-4" style={{ color: "#1A1A3E" }}>Capacity Breakdown</p>
          <div className="flex flex-col gap-3">
            {calcRows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: i === calcRows.length - 1 ? "#1A1A3E" : "#8B8FB5", fontWeight: i === calcRows.length - 1 ? 700 : 400 }}>
                    {row.sign} {row.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}h</span>
                </div>
                {i === calcRows.length - 2 && (
                  <div className="border-b my-2" style={{ borderColor: "#EBEBFF" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-day bars */}
        <div className="card mb-8">
          <p className="text-base font-bold mb-4" style={{ color: "#1A1A3E" }}>Daily Load</p>
          <div className="flex gap-2 justify-between">
            {cap.weekDays.map((day) => {
              const maxH = 8;
              const scheduledPct = Math.min((day.scheduledHours / maxH) * 100, 100);
              const availPct = Math.min((day.availableHours / maxH) * 100, 100);
              return (
                <div key={day.day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-xl overflow-hidden relative"
                    style={{ height: 60, background: "#F0F1FF" }}
                  >
                    {/* Available bar */}
                    <div
                      className="absolute bottom-0 w-full rounded-xl"
                      style={{
                        height: `${availPct}%`,
                        background: "#EBEBFF",
                      }}
                    />
                    {/* Scheduled bar */}
                    <div
                      className="absolute bottom-0 w-full rounded-xl"
                      style={{
                        height: `${scheduledPct}%`,
                        background: day.isOverloaded ? "#FF4444" : "#6C63FF",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: day.isOverloaded ? "#FF4444" : "#8B8FB5" }}>
                    {day.day}
                  </span>
                  <span className="text-xs" style={{ color: "#B0B3D6" }}>{day.scheduledHours}h</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#6C63FF" }} />
              <span className="text-xs" style={{ color: "#8B8FB5" }}>Scheduled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#FF4444" }} />
              <span className="text-xs" style={{ color: "#8B8FB5" }}>Overloaded</span>
            </div>
          </div>
        </div>

        {/* Scheduled sessions */}
        <div className="mb-8">
          <p className="text-base font-bold mb-3" style={{ color: "#1A1A3E" }}>Scheduled This Week</p>
          <div className="flex flex-col" style={{ gap: 3 }}>
            {mockTasks.flatMap((task) =>
              task.scheduledSlots.map((slot) => (
                <div key={task.id + slot.day} className="card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>{task.title}</p>
                    <p className="text-xs" style={{ color: "#8B8FB5" }}>{slot.day} · {slot.startTime}–{slot.endTime}</p>
                  </div>
                  <span
                    className="pill text-xs"
                    style={{
                      color: task.category === "Academic" ? "#6C63FF" : task.category === "Social" ? "#FF6B9D" : task.category === "Errands" ? "#FF7043" : "#00C9B1",
                      background: task.category === "Academic" ? "#EEF0FF" : task.category === "Social" ? "#FFF0F5" : task.category === "Errands" ? "#FFF3F0" : "#F0FDFA",
                    }}
                  >
                    {task.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {cap.isOverloaded && (
          <Link
            href="/overload"
            className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-base mb-4"
            style={{ background: "#FF4444", color: "white" }}
          >
            <TrendingUp size={20} />
            View Overload Details
          </Link>
        )}
      </div>
      <BottomNav />
    </>
  );
}
