"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const MAX_SELECTIONS = 7;

const workStyleOptions = [
  { emoji: "🌅", label: "Early Bird" },
  { emoji: "🌙", label: "Night Owl" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "🔄", label: "Flexible" },
  { emoji: "⚡", label: "Intensive" },
  { emoji: "🌊", label: "Flow State" },
  { emoji: "📅", label: "Planned" },
  { emoji: "☕", label: "Slow Burn" },
  { emoji: "🔇", label: "No Distract" },
  { emoji: "🎧", label: "Music On" },
];

const recoveryOptions = [
  { emoji: "🚶", label: "Walk" },
  { emoji: "🎵", label: "Music" },
  { emoji: "😴", label: "Rest" },
  { emoji: "👫", label: "Friends" },
  { emoji: "🏋️", label: "Exercise" },
  { emoji: "📖", label: "Reading" },
  { emoji: "🍳", label: "Cooking" },
  { emoji: "🎮", label: "Gaming" },
];

type Chip = { emoji: string; label: string };

export default function ProfilePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    if (selected.includes(label)) {
      setSelected(selected.filter((s) => s !== label));
    } else if (selected.length < MAX_SELECTIONS) {
      setSelected([...selected, label]);
    }
  };

  const canContinue = selected.length > 0;

  const ChipItem = ({ chip }: { chip: Chip }) => {
    const isSelected = selected.includes(chip.label);
    const atMax = selected.length >= MAX_SELECTIONS && !isSelected;
    return (
      <button
        onClick={() => toggle(chip.label)}
        disabled={atMax}
        className="flex items-center gap-3 py-4 rounded-xl text-base font-semibold transition-all"
        style={{
          paddingLeft: 5,
          paddingRight: 5,
          background: isSelected ? "#1A1A3E" : "#F5F5F5",
          color: isSelected ? "white" : "#1A1A3E",
          border: isSelected ? "1.5px solid #1A1A3E" : "1.5px solid #E8E8E8",
          opacity: atMax ? 0.4 : 1,
          cursor: atMax ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 20 }}>{chip.emoji}</span>
        {chip.label}
      </button>
    );
  };

  return (
    <div className="screen" style={{ background: "#F0F1FF" }}>
      {/* White card panel */}
      <div
        style={{
          background: "white",
          margin: "16px 12px",
          borderRadius: 24,
          padding: "28px 28px 32px 28px",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full mb-5"
          style={{ background: "#F5F5F5" }}
        >
          <X size={16} color="#1A1A3E" />
        </button>

        {/* Title */}
        <h1
          className="text-2xl font-extrabold mb-2"
          style={{ color: "#1A1A3E", lineHeight: 1.25 }}
        >
          What do you vibe with?
        </h1>
        <p className="text-sm mb-10" style={{ color: "#9CA3AF", lineHeight: 1.5 }}>
          Select up to {MAX_SELECTIONS} preferences to personalise your workload planning.
        </p>

        {/* ── Section: Work Style ── */}
        <p className="text-xl font-bold mb-10" style={{ color: "#1A1A3E", margin: "10px 0" }}>
          Work Style
        </p>
        <div className="flex flex-wrap mb-10" style={{ gap: 12 }}>
          {workStyleOptions.map((chip) => (
            <ChipItem key={chip.label} chip={chip} />
          ))}
        </div>

        {/* ── Section: Recovery ── */}
        <p className="text-xl font-bold mb-6" style={{ color: "#1A1A3E", margin: "10px 0" }}>
          Recovery
        </p>
        <div className="flex flex-wrap mb-8" style={{ gap: 12 }}>
          {recoveryOptions.map((chip) => (
            <ChipItem key={chip.label} chip={chip} />
          ))}
        </div>



        {/* ── Counter + Continue — inline, always visible ── */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: "#F5F5F7", marginTop: "20px" }}
        >
          <div>
            <p
              className="text-xl font-extrabold"
              style={{ color: selected.length > 0 ? "#1A1A3E" : "#C4C4CF" }}
            >
              {selected.length}/{MAX_SELECTIONS}
            </p>
            <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
              Selected
            </p>
          </div>
          <button
            onClick={() => canContinue && router.push("/")}
            className="px-8 py-3.5 rounded-xl font-bold text-base"
            style={{
              background: canContinue ? "#1A1A3E" : "#E5E7EB",
              color: canContinue ? "white" : "#9CA3AF",
              cursor: canContinue ? "pointer" : "not-allowed",
              minWidth: 130,
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
