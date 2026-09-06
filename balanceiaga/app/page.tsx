"use client";
import Link from "next/link";
import { Bell, ChevronRight, TrendingUp } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import LoadRing from "@/components/LoadRing";
import CategoryBar from "@/components/CategoryBar";
import TaskCard from "@/components/TaskCard";
import { mockCapacity, mockCategoryLoads, mockTasks } from "@/lib/mockData";

export default function Dashboard() {
  const cap = mockCapacity;
  const todayTasks = mockTasks.filter((t) =>
    t.scheduledSlots.some((s) => s.day === "Mon")
  );

  return (
    <>
      <div className="screen px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium" style={{ color: "#8B8FB5" }}>Welcome back,</p>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Andrew Mike 👋</p>
          </div>
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#EEF0FF" }}
            >
              <Bell size={18} color="#6C63FF" />
            </div>
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "#FF4444" }}
            >
              <span className="text-white" style={{ fontSize: 9, fontWeight: 700 }}>3</span>
            </div>
          </div>
        </div>

        {/* Load Summary Card */}
        <div className="card mb-4" style={{ background: "linear-gradient(135deg, #1A1A3E 0%, #2D2B6B 100%)" }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-white">This Week's Load</p>
            <span
              className="pill"
              style={{ background: "#FF4444", color: "white", fontSize: 11 }}
            >
              🔴 {cap.overloadPercent}% Capacity
            </span>
          </div>
          <div className="flex items-center justify-center py-2">
            <LoadRing
              percent={cap.overloadPercent}
              workloadHours={cap.totalWorkload}
              capacityHours={cap.realisticCapacity}
            />
          </div>
          <div
            className="mt-3 p-3 rounded-xl"
            style={{ background: "rgba(255,68,68,0.15)" }}
          >
            <p className="text-xs font-medium" style={{ color: "#FFB3B3" }}>
              ⚠️ You&apos;re {cap.overloadHours}h over capacity. Academic workload is the biggest contributor.
            </p>
          </div>
          <Link
            href="/rebalance"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
            style={{ background: "#6C63FF", color: "white" }}
          >
            Rebalance My Week
            <TrendingUp size={16} />
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="card">
            <p className="text-xs font-medium mb-1" style={{ color: "#8B8FB5" }}>Workload</p>
            <p className="text-2xl font-bold" style={{ color: "#1A1A3E" }}>{cap.totalWorkload}h</p>
            <p className="text-xs" style={{ color: "#FF4444" }}>+{cap.overloadHours}h over</p>
          </div>
          <div className="card">
            <p className="text-xs font-medium mb-1" style={{ color: "#8B8FB5" }}>Capacity</p>
            <p className="text-2xl font-bold" style={{ color: "#1A1A3E" }}>{cap.realisticCapacity}h</p>
            <p className="text-xs" style={{ color: "#00C853" }}>Realistic max</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Category Breakdown</p>
            <Link href="/capacity" className="flex items-center gap-1">
              <span className="text-xs" style={{ color: "#6C63FF" }}>Details</span>
              <ChevronRight size={14} color="#6C63FF" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {mockCategoryLoads.filter(c => c.hours > 0).map((load) => (
              <CategoryBar key={load.category} load={load} maxHours={cap.totalWorkload} />
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Today&apos;s Sessions</p>
            <span className="text-xs" style={{ color: "#8B8FB5" }}>Mon, 7 Sep</span>
          </div>
          <div className="flex flex-col gap-2">
            {todayTasks.map((task) => {
              const slot = task.scheduledSlots.find((s) => s.day === "Mon")!;
              return <TaskCard key={task.id} task={task} showSlot={slot} />;
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
