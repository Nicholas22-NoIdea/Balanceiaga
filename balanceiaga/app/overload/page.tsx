import Link from "next/link";
import { ArrowLeft, Zap, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockCapacity, mockTasks } from "@/lib/mockData";

const flexibilityColors = {
  Low: { color: "#FF4444", bg: "#FFF0F0", label: "Hard to move" },
  Medium: { color: "#FF7043", bg: "#FFF3F0", label: "Can shift" },
  High: { color: "#00C853", bg: "#F0FDF4", label: "Easily moved" },
};

export default function OverloadDetection() {
  const cap = mockCapacity;
  const overloadedDays = cap.weekDays.filter((d) => d.isOverloaded);

  return (
    <>
      <div className="screen px-4 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/capacity"
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "#FFF0F0" }}
          >
            <ArrowLeft size={18} color="#FF4444" />
          </Link>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Overload Detected</p>
            <p className="text-xs" style={{ color: "#8B8FB5", marginBottom: "10px" }}>Here's what's causing the overload</p>
          </div>
        </div>

        {/* Big alert card */}
        <div
          className="card mb-8 text-center py-6"
          style={{ background: "linear-gradient(135deg, #FF4444 0%, #FF6B6B 100%)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle size={22} color="white" />
            <p className="text-2xl font-extrabold text-white">+{cap.overloadHours}h Over Capacity</p>
          </div>
          <p className="text-sm text-white opacity-80">
            {cap.totalWorkload}h scheduled · {cap.realisticCapacity}h available
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            {overloadedDays.map((d) => (
              <span
                key={d.day}
                className="pill text-xs"
                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
              >
                {d.day} +{d.scheduledHours - d.availableHours}h
              </span>
            ))}
          </div>
        </div>

        {/* Overload bar */}
        <div className="card mb-8">
          <p className="text-xl font-bold mb-3" style={{ color: "#1A1A3E" }}>Workload vs Capacity</p>
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: "#8B8FB5" }}>
                <span>Workload</span><span>{cap.totalWorkload}h</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#F0F1FF" }}>
                <div className="h-full rounded-full" style={{ width: "100%", background: "#FF4444" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: "#8B8FB5" }}>
                <span>Capacity</span><span>{cap.realisticCapacity}h</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#F0F1FF" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(cap.realisticCapacity / cap.totalWorkload) * 100}%`, background: "#6C63FF" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Commitments breakdown */}
        <div className="card mb-8">
          <p className="text-xl font-bold mb-3" style={{ color: "#1A1A3E", marginBottom: "10px" }}>All Commitments</p>
          <div className="flex flex-col gap-3">
            {mockTasks.map((task) => {
              const flex = flexibilityColors[task.flexibility];
              return (
                <div key={task.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "#F0F1FF" }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>{task.title}</p>
                      {task.isProtected && (
                        <span className="pill text-xs" style={{ color: "#6C63FF", background: "#EEF0FF" }}>🛡 Protected</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#8B8FB5" }}>
                      {task.estimatedHours}h · Due {task.deadline}
                    </p>
                  </div>
                  <span className="pill text-xs" style={{ color: flex.color, background: flex.bg }}>
                    {flex.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href="/rebalance"
          className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-base mb-4"
          style={{ background: "#6C63FF", color: "white" }}
        >
          <Zap size={20} />
          Find Solutions
        </Link>
      </div>
      <BottomNav />
    </>
  );
}
