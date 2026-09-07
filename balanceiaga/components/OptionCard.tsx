"use client";
import { useState } from "react";
import { RebalanceOption } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Star, ArrowRight, Scissors, Shuffle, Lock } from "lucide-react";

const actionIcons: Record<string, React.ReactNode> = {
  MOVE:         <ArrowRight size={13} />,
  SPLIT:        <Scissors size={13} />,
  REDISTRIBUTE: <Shuffle size={13} />,
  KEEP:         <Lock size={13} />,
};

const actionColors: Record<string, { color: string; bg: string }> = {
  MOVE:         { color: "#FF7043", bg: "#FFF3F0" },
  SPLIT:        { color: "#6C63FF", bg: "#EEF0FF" },
  REDISTRIBUTE: { color: "#00C9B1", bg: "#F0FDFA" },
  KEEP:         { color: "#00C853", bg: "#F0FDF4" },
};

interface OptionCardProps {
  option: RebalanceOption;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function OptionCard({ option, onAccept, onReject }: OptionCardProps) {
  const [expanded, setExpanded] = useState(option.isRecommended);

  return (
    <div
      className="card"
      style={{
        border: option.isRecommended ? "2px solid #6C63FF" : "2px solid #EBEBFF",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {option.isRecommended && (
            <Star size={14} color="#FFB800" fill="#FFB800" />
          )}
          <span className="font-bold text-sm" style={{ color: "#1A1A3E" }}>
            {option.label}
          </span>
          {option.isRecommended && (
            <span className="pill" style={{ color: "#6C63FF", background: "#EEF0FF" }}>
              Recommended
            </span>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp size={18} color="#8B8FB5" /> : <ChevronDown size={18} color="#8B8FB5" />}
        </button>
      </div>

      {/* Result badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="pill"
          style={{
            color: option.resultingOverload === 0 ? "#00C853" : "#FF4444",
            background: option.resultingOverload === 0 ? "#F0FDF4" : "#FFF0F0",
          }}
        >
          {option.resultingOverload === 0
            ? `✓ ${option.resultingPercent}% — Balanced`
            : `${option.resultingPercent}% — Still over`}
        </span>
        <span className="text-xs" style={{ color: "#8B8FB5" }}>
          Frees {option.hoursFreed}h
        </span>
      </div>

      <p className="text-xs mb-5 leading-relaxed" style={{ color: "#8B8FB5" }}>
        {option.description}
      </p>

      {/* Expanded changes */}
      {expanded && (
        <div className="flex flex-col gap-3 mb-5">
          {option.changes.map((change) => {
            const ac = actionColors[change.action] ?? actionColors["MOVE"];
            return (
              <div
                key={change.taskId}
                className="rounded-xl"
                style={{ background: "#F8F8FF", padding: "14px 16px" }}
              >
                {/* Top row: badge aligned left, hours saved aligned right */}
                <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                  <span
                    className="pill flex items-center gap-1"
                    style={{ color: ac.color, background: ac.bg }}
                  >
                    {actionIcons[change.action]}
                    {change.action}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "#00C853" }}>
                    −{change.hoursSaved}h
                  </span>
                </div>
                {/* Task title */}
                <p className="text-xs font-semibold" style={{ color: "#1A1A3E", marginBottom: 5 }}>
                  {change.taskTitle}
                </p>
                {/* Description */}
                <p className="text-xs" style={{ color: "#8B8FB5" }}>
                  {change.detail}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(option.id)}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: "#6C63FF", color: "white" }}
        >
          Accept
        </button>
        <button
          onClick={() => onReject(option.id)}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: "#F0F1FF", color: "#8B8FB5" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
