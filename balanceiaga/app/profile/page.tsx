"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Shield, BookOpen, Coffee, Plus, X } from "lucide-react";

type WorkPeriod = "Morning" | "Afternoon" | "Evening" | "Night";
type RecoveryPref = "Walk" | "Music" | "Rest" | "Meet a friend" | "Exercise" | "Reading";

const workPeriods: WorkPeriod[] = ["Morning", "Afternoon", "Evening", "Night"];
const recoveryOptions: RecoveryPref[] = ["Walk", "Music", "Rest", "Meet a friend", "Exercise", "Reading"];

const periodIcons: Record<WorkPeriod, string> = {
  Morning: "🌅",
  Afternoon: "☀️",
  Evening: "🌆",
  Night: "🌙",
};

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1 — Basic info
  const [name, setName] = useState("Andrew Mike");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");

  // Step 2 — Working preferences
  const [selectedPeriods, setSelectedPeriods] = useState<WorkPeriod[]>(["Morning", "Afternoon"]);
  const [sessionDuration, setSessionDuration] = useState(2);

  // Step 3 — Protected commitments
  const [protectedItems, setProtectedItems] = useState<string[]>(["Exam Revision", "Lectures"]);
  const [newProtected, setNewProtected] = useState("");

  // Step 4 — Recovery
  const [selectedRecovery, setSelectedRecovery] = useState<RecoveryPref[]>(["Walk", "Music"]);

  const togglePeriod = (p: WorkPeriod) =>
    setSelectedPeriods((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const toggleRecovery = (r: RecoveryPref) =>
    setSelectedRecovery((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const addProtected = () => {
    if (newProtected.trim()) {
      setProtectedItems([...protectedItems, newProtected.trim()]);
      setNewProtected("");
    }
  };

  const removeProtected = (item: string) =>
    setProtectedItems(protectedItems.filter((i) => i !== item));

  const stepTitles = [
    "About You",
    "Working Style",
    "Protected Time",
    "Recovery",
  ];

  const stepSubtitles = [
    "Tell us about yourself so we can personalise your experience.",
    "When do you work best? We'll schedule tasks around your energy.",
    "What should never be moved by rebalancing?",
    "How do you like to recharge when you free up time?",
  ];

  return (
    <div className="screen px-4 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "#EEF0FF" }}
          >
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
        <div className="flex-1">
          <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>
            {stepTitles[step - 1]}
          </p>
          <p className="text-xs" style={{ color: "#8B8FB5" }}>
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-full overflow-hidden mb-6" style={{ height: 6, background: "#EBEBFF" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(step / totalSteps) * 100}%`, background: "#6C63FF" }}
        />
      </div>

      {/* Step subtitle */}
      <p className="text-sm mb-6" style={{ color: "#8B8FB5" }}>
        {stepSubtitles[step - 1]}
      </p>

      {/* ── STEP 1: About You ── */}
      {step === 1 && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>
              FULL NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Andrew Mike"
              className="w-full text-sm font-medium outline-none placeholder:text-gray-300"
              style={{ color: "#1A1A3E", background: "transparent" }}
            />
          </div>
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>
              <BookOpen size={11} className="inline mr-1" />
              MAJOR / COURSE
            </label>
            <input
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full text-sm font-medium outline-none placeholder:text-gray-300"
              style={{ color: "#1A1A3E", background: "transparent" }}
            />
          </div>
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>
              YEAR OF STUDY
            </label>
            <div className="flex gap-2 flex-wrap">
              {["Year 1", "Year 2", "Year 3", "Year 4", "Postgrad"].map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className="pill"
                  style={{
                    background: year === y ? "#6C63FF" : "#EEF0FF",
                    color: year === y ? "white" : "#6C63FF",
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Working Style ── */}
      {step === 2 && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>
              PREFERRED WORKING PERIODS
            </label>
            <div className="grid grid-cols-2 gap-2">
              {workPeriods.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePeriod(p)}
                  className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: selectedPeriods.includes(p) ? "#6C63FF" : "#F0F1FF",
                    color: selectedPeriods.includes(p) ? "white" : "#1A1A3E",
                  }}
                >
                  <span>{periodIcons[p]}</span>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>
              <Clock size={11} className="inline mr-1" />
              PREFERRED SESSION DURATION
            </label>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSessionDuration(Math.max(0.5, sessionDuration - 0.5))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ background: "#F0F1FF", color: "#6C63FF" }}
              >
                −
              </button>
              <div className="text-center">
                <p className="text-2xl font-extrabold" style={{ color: "#1A1A3E" }}>
                  {sessionDuration}h
                </p>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>per session</p>
              </div>
              <button
                onClick={() => setSessionDuration(Math.min(6, sessionDuration + 0.5))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ background: "#EEF0FF", color: "#6C63FF" }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Protected Commitments ── */}
      {step === 3 && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>
              <Shield size={11} className="inline mr-1" />
              PROTECTED COMMITMENTS
            </label>
            <p className="text-xs mb-3" style={{ color: "#B0B3D6" }}>
              These will never be moved or split by rebalancing.
            </p>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {protectedItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{ background: "#EEF0FF" }}
                >
                  <div className="flex items-center gap-2">
                    <Shield size={13} color="#6C63FF" />
                    <span className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>{item}</span>
                  </div>
                  <button onClick={() => removeProtected(item)}>
                    <X size={14} color="#B0B3D6" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input
                value={newProtected}
                onChange={(e) => setNewProtected(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProtected()}
                placeholder="Add commitment..."
                className="flex-1 text-sm outline-none px-3 py-2 rounded-xl placeholder:text-gray-300"
                style={{ background: "#F0F1FF", color: "#1A1A3E" }}
              />
              <button
                onClick={addProtected}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#6C63FF" }}
              >
                <Plus size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Recovery ── */}
      {step === 4 && (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>
              <Coffee size={11} className="inline mr-1" />
              HOW DO YOU LIKE TO RECOVER?
            </label>
            <p className="text-xs mb-4" style={{ color: "#B0B3D6" }}>
              When you free up time, we'll suggest these instead of filling it with more work.
            </p>
            <div className="flex flex-wrap gap-2">
              {recoveryOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRecovery(r)}
                  className="pill"
                  style={{
                    background: selectedRecovery.includes(r) ? "#6C63FF" : "#F0F1FF",
                    color: selectedRecovery.includes(r) ? "white" : "#8B8FB5",
                    padding: "8px 16px",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Summary preview */}
          <div className="card" style={{ marginBottom: 0, border: "1.5px solid #EEF0FF" }}>
            <p className="text-xs font-bold mb-3" style={{ color: "#1A1A3E" }}>Your Profile Summary</p>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: "#8B8FB5" }}>Name</span>
                <span className="text-xs font-semibold" style={{ color: "#1A1A3E" }}>{name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: "#8B8FB5" }}>Work periods</span>
                <span className="text-xs font-semibold" style={{ color: "#1A1A3E" }}>{selectedPeriods.join(", ") || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: "#8B8FB5" }}>Session length</span>
                <span className="text-xs font-semibold" style={{ color: "#1A1A3E" }}>{sessionDuration}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: "#8B8FB5" }}>Protected</span>
                <span className="text-xs font-semibold" style={{ color: "#1A1A3E" }}>{protectedItems.length} items</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav button */}
      <button
        onClick={() => {
          if (step < totalSteps) setStep(step + 1);
          else router.push("/");
        }}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base mt-8"
        style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)", color: "white" }}
      >
        {step < totalSteps ? "Continue" : "Start Balancing 🎉"}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
