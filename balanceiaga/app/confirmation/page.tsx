"use client";
import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockRebalanceOptions, mockCapacity } from "@/lib/mockData";

const recoveryActivities = ["🚶 Walk", "🎵 Music", "😴 Rest", "👋 Meet a friend"];

export default function Confirmation() {
  const accepted = mockRebalanceOptions[0]; // Option A was accepted
  const cap = mockCapacity;

  return (
    <>
      <div className="screen px-4 pt-6">
        {/* Success hero */}
        <div
          className="card mb-4 text-center py-8"
          style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)" }}
        >
          <div className="flex justify-center mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <CheckCircle size={36} color="white" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-white mb-1">Week Rebalanced!</p>
          <p className="text-sm text-white opacity-80">Your workload is back in balance.</p>
        </div>

        {/* Before / After */}
        <div className="card mb-4">
          <p className="text-sm font-bold mb-4" style={{ color: "#1A1A3E" }}>Before → After</p>
          <div className="flex gap-4">
            <div className="flex-1 p-3 rounded-xl" style={{ background: "#FFF0F0" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#FF4444" }}>Before</p>
              <p className="text-xl font-bold" style={{ color: "#FF4444" }}>{cap.overloadPercent}%</p>
              <p className="text-xs" style={{ color: "#FF8888" }}>{cap.totalWorkload}h / {cap.realisticCapacity}h</p>
            </div>
            <div className="flex items-center">
              <span style={{ fontSize: 20 }}>→</span>
            </div>
            <div className="flex-1 p-3 rounded-xl" style={{ background: "#F0FDF4" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#00C853" }}>After</p>
              <p className="text-xl font-bold" style={{ color: "#00C853" }}>{accepted.resultingPercent}%</p>
              <p className="text-xs" style={{ color: "#86EFAC" }}>{cap.realisticCapacity}h / {cap.realisticCapacity}h</p>
            </div>
          </div>
        </div>

        {/* Changes applied */}
        <div className="card mb-4">
          <p className="text-sm font-bold mb-3" style={{ color: "#1A1A3E" }}>Changes Applied</p>
          <div className="flex flex-col gap-2">
            {accepted.changes.map((change) => (
              <div key={change.taskId} className="flex items-start gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "#F0FDF4" }}
                >
                  <span style={{ fontSize: 10 }}>✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>{change.taskTitle}</p>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{change.detail}</p>
                </div>
                <span className="ml-auto text-xs font-bold" style={{ color: "#00C853" }}>−{change.hoursSaved}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery */}
        <div className="card mb-4" style={{ border: "1.5px solid #EEF0FF" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>🎉 You recovered {accepted.hoursFreed}h</p>
          <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>Protect this time for yourself?</p>
          <div className="flex gap-2 flex-wrap">
            {recoveryActivities.map((act) => (
              <button
                key={act}
                className="pill"
                style={{ background: "#EEF0FF", color: "#6C63FF" }}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm mb-4"
          style={{ background: "#1A1A3E", color: "white" }}
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
      </div>
      <BottomNav />
    </>
  );
}
