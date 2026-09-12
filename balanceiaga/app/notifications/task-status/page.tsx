"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Pause, CheckCircle2, Zap, Brain, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type TaskStatusType = "scheduled" | "in_progress" | "completed" | "paused" | "overrun";

const TASK = {
  name: "Database Assignment",
  category: "Academic",
  startTime: "8:00 PM",
  endTime: "10:00 PM",
  plannedDuration: 120,
  workloadScore: 78,
  demand: "High",
  demandColor: "#FF4444",
  demandBg: "rgba(255, 68, 68, 0.2)",
  description: "Complete ER diagram, SQL schema, 5 complex queries + stored procedures",
  nextTask: "Study Session",
  nextTaskTime: "10:00 PM",
};

const rebalanceOptions = [
  { id: "opt1", emoji: "💤", title: "Protect Sleep", desc: "Move Study → Tue 4 PM", before: 82, after: 76, recommended: true },
  { id: "opt2", emoji: "🏃", title: "Move Gym", desc: "Move gym → Wed", before: 82, after: 70, recommended: false },
  { id: "opt3", emoji: "🔴", title: "Continue Plan", desc: "Push through tonight — high overload risk", before: 82, after: 94, recommended: false },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TaskStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<TaskStatusType>("scheduled");
  const [elapsed, setElapsed] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showDelayPicker, setShowDelayPicker] = useState(false);
  const [showRebalance, setShowRebalance] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [chosenRebalance, setChosenRebalance] = useState<string | null>(null);
  const [overrunMinutes, setOverrunMinutes] = useState(0);
  const [stillWorkingChoice, setStillWorkingChoice] = useState<string | null>(null);

  const plannedSeconds = TASK.plannedDuration * 60;
  const isOverrun = elapsed > plannedSeconds && status === "in_progress";
  const progressPct = Math.min((elapsed / plannedSeconds) * 100, 100);
  const remainingSeconds = Math.max(plannedSeconds - elapsed, 0);

  useEffect(() => {
    if (status !== "in_progress") return;
    const interval = setInterval(() => {
      setElapsed((e) => {
        const next = e + 5;
        if (next > plannedSeconds) {
          setOverrunMinutes(Math.floor((next - plannedSeconds) / 60));
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [status, plannedSeconds]);

  useEffect(() => {
    if (elapsed >= plannedSeconds && status === "in_progress" && !showEndModal && !showComplete) {
      setShowEndModal(true);
    }
  }, [elapsed, plannedSeconds, status, showEndModal, showComplete]);

  const handleStart = () => setStatus("in_progress");
  const handlePause = () => setStatus("paused");
  const handleResume = () => setStatus("in_progress");
  const handleFinish = () => { setShowEndModal(false); setShowComplete(true); setStatus("completed"); };

  const statusLabel: Record<TaskStatusType, string> = {
    scheduled: "Scheduled", in_progress: "In Progress", completed: "Completed", paused: "Paused", overrun: "Overrun",
  };
  const statusColor: Record<TaskStatusType, string> = {
    scheduled: "#8B8FB5", in_progress: "#6C63FF", completed: "#00C853", paused: "#FF7043", overrun: "#FF4444",
  };
  const statusSteps: TaskStatusType[] = ["scheduled", "in_progress", "completed"];

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 100px 16px" }}>
        <div className="flex items-center gap-3" style={{ marginBottom: "27px" }}>
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "#EEF0FF" }}>
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div className="flex-1">
            <p className="text-lg font-bold truncate" style={{ color: "#1A1A3E" }}>{TASK.name}</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>{TASK.startTime} – {TASK.endTime}</p>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="flex items-center justify-center mb-6" style={{ marginBottom: "31px" }}>
          {statusSteps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: statusSteps.indexOf(status) > i ? "#00C853" : status === step ? statusColor[step] : "#E5E7EB" }}>
                  {statusSteps.indexOf(status) > i ? <CheckCircle2 size={16} color="white" /> : <span className="text-xs font-bold text-white">{i + 1}</span>}
                </div>
                <span className="text-xs font-semibold" style={{ color: status === step ? statusColor[step] : "#B0B3D6" }}>{statusLabel[step]}</span>
              </div>
              {i < statusSteps.length - 1 && (
                <div className="w-8 h-0.5 mx-2 mb-4" style={{ background: statusSteps.indexOf(status) > i ? "#00C853" : "#E5E7EB" }} />
              )}
            </div>
          ))}
        </div>

        {/* Main Task Card */}
        <div className="rounded-2xl" style={{ padding: "20px", marginBottom: "23px", background: "linear-gradient(135deg, #1A1A3E, #2D2B6B)" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-3">
              <p className="text-xl font-extrabold text-white mb-1">{TASK.name}</p>
              <p className="text-xs" style={{ color: "#9B99CC" }}>{TASK.description}</p>
            </div>
            <div className="rounded-full flex-shrink-0" style={{ padding: "0px 7px", background: "rgba(108,99,255,0.3)" }}>
              <span className="text-xs font-bold" style={{ color: "#A89CFF" }}>{TASK.workloadScore}/100</span>
            </div>
          </div>
          <div className="flex gap-4 mb-4" style={{ margin: "5px 0" }}>
            <div className="flex items-center gap-1.5">
              <Brain size={13} color="#9B99CC" />
              <span className="text-xs font-semibold rounded-full" style={{ padding: "0px 12px", background: TASK.demandBg, color: TASK.demandColor }}>{TASK.demand}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} color="#9B99CC" />
              <span className="text-xs" style={{ color: "#9B99CC" }}>Est. {TASK.plannedDuration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={13} color="#A89CFF" />
              <span className="text-xs" style={{ color: "#A89CFF" }}>+{TASK.workloadScore} pts</span>
            </div>
          </div>

          {(status === "in_progress" || status === "paused") && (
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "#9B99CC" }}>{isOverrun ? "Overrun" : "Elapsed"}</span>
                {!isOverrun && <span className="text-xs" style={{ color: "#9B99CC" }}>{formatTime(remainingSeconds)} remaining</span>}
              </div>
              <div className="w-full h-2 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${progressPct}%`, background: isOverrun ? "#FF4444" : "#6C63FF" }} />
              </div>
              <span className="text-2xl font-black" style={{ color: isOverrun ? "#FF6B6B" : "white" }}>
                {isOverrun ? `+${formatTime(elapsed - plannedSeconds)}` : formatTime(elapsed)}
              </span>
              <span className="text-xs ml-1" style={{ color: "#9B99CC" }}>/ {formatTime(plannedSeconds)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: statusColor[status], boxShadow: `0 0 6px ${statusColor[status]}` }} />
            <span className="text-xs font-bold" style={{ color: statusColor[status] }}>{statusLabel[status]}</span>
          </div>
        </div>

        {/* Overrun Warning */}
        {isOverrun && overrunMinutes > 0 && !showRebalance && (
          <div className="rounded-3xl" style={{ padding: "24px", marginBottom: "24px", background: "#FFF0F0", border: "1px solid #FFD0D0" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} color="#FF4444" />
              <p className="text-base font-bold" style={{ color: "#FF4444" }}>Task running {overrunMinutes} min over schedule</p>
            </div>
            <p className="text-xs mb-4" style={{ color: "#FF7070", lineHeight: 1.5 }}>
              Your {TASK.nextTask} starts at {TASK.nextTaskTime}. Continuing may affect your study session and recovery time.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowRebalance(true)} className="flex-1 py-3 rounded-xl text-xs font-bold text-white transition-transform active:scale-95" style={{ background: "#6C63FF" }}>✨ Rebalance</button>
              <button className="flex-1 py-3 rounded-xl text-xs font-bold transition-transform active:scale-95" style={{ background: "white", color: "#6C63FF" }}>Continue</button>
              <button className="flex-1 py-3 rounded-xl text-xs font-bold transition-transform active:scale-95" style={{ background: "#FFF3F0", color: "#FF7043" }}>Move Next</button>
            </div>
          </div>
        )}

        {/* Rebalance Options */}
        {showRebalance && (
          <div className="rounded-3xl" style={{ padding: "24px", background: "#F8F9FF", border: "1px solid #E8E9FF", marginBottom: "24px" }}>
            <p className="text-base font-bold mb-4" style={{ color: "#1A1A3E" }}>✨ Smart Rebalancing Options</p>
            <div className="flex flex-col" style={{ gap: "12px" }}>
              {rebalanceOptions.map((opt) => (
                <button key={opt.id} onClick={() => setChosenRebalance(opt.id)}
                  className="rounded-2xl text-left"
                  style={{ padding: "16px", background: chosenRebalance === opt.id ? "#EEF0FF" : "white", border: `2px solid ${chosenRebalance === opt.id ? "#6C63FF" : opt.recommended ? "#D4D1FF" : "#F0F1FF"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-start justify-between" style={{ marginBottom: "8px" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{opt.emoji}</span>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{opt.title}</p>
                        {opt.recommended && <span className="text-xs rounded-full font-bold inline-block mt-1" style={{ padding: "2px 8px", background: "#EEF0FF", color: "#6C63FF" }}>Recommended</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: "#8B8FB5" }}>Workload</p>
                      <p className="text-sm font-bold">
                        <span style={{ color: "#8B8FB5" }}>{opt.before} → </span>
                        <span style={{ color: opt.after > opt.before ? "#FF4444" : "#00C853" }}>{opt.after}</span>
                        {opt.after > opt.before && <span> ⚠️</span>}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{opt.desc}</p>
                </button>
              ))}
            </div>
            {chosenRebalance && (
              <button onClick={() => { setShowRebalance(false); setChosenRebalance(null); }}
                className="w-full rounded-xl font-bold text-sm text-white" style={{ padding: "12px 0", marginTop: "16px", background: "#6C63FF" }}>
                Apply Rebalancing ✓
              </button>
            )}
          </div>
        )}

        {/* Completion */}
        {showComplete && (
          <>
            <div className="rounded-3xl text-center" style={{ padding: "24px", marginBottom: "24px", background: "linear-gradient(135deg, #00C853, #00B341)", boxShadow: "0 4px 16px rgba(0,200,83,0.3)" }}>
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lg font-extrabold text-white mb-1">Nice work!</p>
              <p className="text-sm text-white mb-3" style={{ opacity: 0.9 }}>One difficult task down. Take a moment to reset.</p>
              <div className="mt-1 px-4 py-2 rounded-xl inline-block" style={{ background: "rgba(255,255,255,0.2)" }}>
                <p className="text-xs font-bold text-white">🧠 Badge earned: Deep Work</p>
              </div>
            </div>

            {/* Contextual Recovery Insight */}
            <div className="rounded-3xl" style={{ padding: "24px", marginBottom: "24px", background: "white", border: "1px solid #F0F1FF", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start" style={{ gap: "12px", marginBottom: "16px" }}>
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Want to take a short reset?</p>
                  <p className="text-xs" style={{ color: "#8B8FB5", lineHeight: 1.5 }}>
                    You just completed a mentally demanding assignment. You have 20 minutes before your next activity.
                  </p>
                </div>
              </div>
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <Link href="/recovery" className="w-full rounded-xl text-center font-bold text-sm text-white transition-transform active:scale-95" style={{ padding: "12px 0", background: "#6C63FF" }}>
                  Take a Break
                </Link>
                <Link href="/" className="w-full rounded-xl text-center font-bold text-sm transition-transform active:scale-95" style={{ padding: "12px 0", background: "#F0F1FF", color: "#6C63FF" }}>
                  Continue (Not Now)
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        {!showComplete && (
          <div className="flex flex-col gap-2">
            {status === "scheduled" && (
              <>
                <button onClick={handleStart} className="w-full rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 transition-transform active:scale-95" style={{ padding: "10px 0", background: "#6C63FF" }}>
                  <Play size={18} /> Start Now
                </button>
                <div className="flex gap-2" >
                  <button onClick={() => setShowDelayPicker(!showDelayPicker)} className="flex-1 py-3 rounded-2xl font-bold text-sm transition-transform active:scale-95" style={{ background: "#F0F1FF", color: "#6C63FF" }}>⏳ Delay</button>
                  <button onClick={() => setShowRebalance(!showRebalance)} className="flex-1 py-3 rounded-2xl font-bold text-sm transition-transform active:scale-95" style={{ background: "#F0F1FF", color: "#6C63FF" }}>✨ Rebalance</button>
                </div>
                {showDelayPicker && (
                  <div className="rounded-3xl" style={{ padding: "24px", background: "#F8F9FF", border: "1px solid #E8E9FF", marginTop: "8px" }}>
                    <p className="text-sm font-bold mb-3" style={{ color: "#1A1A3E" }}>DELAY BY</p>
                    <div className="flex gap-2">
                      {["15 min", "30 min", "1 hour"].map((d) => (
                        <button key={d} onClick={() => setShowDelayPicker(false)} className="flex-1 py-2 rounded-xl text-sm font-bold" style={{ background: "#EEF0FF", color: "#6C63FF" }}>{d}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {status === "in_progress" && (
              <>
                <button onClick={() => setShowEndModal(true)} className="w-full rounded-2xl font-bold text-base text-white flex items-center justify-center transition-transform active:scale-95" style={{ padding: "10px 0", gap: "8px", background: "#00C853" }}>
                  <CheckCircle2 size={18} /> Mark Finished
                </button>
                <button onClick={handlePause} className="w-full rounded-2xl font-bold text-sm flex items-center justify-center transition-transform active:scale-95" style={{ padding: "10px 0", gap: "8px", background: "#F0F1FF", color: "#FF7043" }}>
                  <Pause size={16} /> Pause
                </button>
              </>
            )}
            {status === "paused" && (
              <button onClick={handleResume} className="w-full rounded-2xl font-bold text-base text-white flex items-center justify-center transition-transform active:scale-95" style={{ padding: "10px 0", gap: "8px", background: "#6C63FF" }}>
                <Play size={18} /> Resume
              </button>
            )}
          </div>
        )}
        <div style={{ height: 24 }} />
      </div >

      {/* End-of-task Modal */}
      {
        showEndModal && (
          <div className="fixed inset-0 flex items-end justify-center z-50" style={{ background: "rgba(26,26,62,0.6)" }}>
            <div className="w-[375px] rounded-t-3xl" style={{ padding: "24px 24px 100px 24px", background: "white" }}>
              {!stillWorkingChoice ? (
                <>
                  <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "#E5E7EB" }} />
                  <p className="text-base font-bold text-center mb-1" style={{ color: "#1A1A3E" }}>⏰ Scheduled end time reached</p>
                  <p className="text-sm text-center mb-5" style={{ color: "#8B8FB5" }}>Are you finished with {TASK.name}?</p>
                  <div className="flex flex-col" style={{ gap: "12px" }}>
                    <button onClick={handleFinish} className="w-full rounded-2xl font-bold text-base text-white transition-transform active:scale-95" style={{ marginTop: "10px", padding: "16px 0", background: "#00C853" }}>✓ Finished</button>
                    <button onClick={() => setStillWorkingChoice("pick")} className="w-full rounded-2xl font-bold text-sm transition-transform active:scale-95" style={{ padding: "16px 0", background: "#F0F1FF", color: "#6C63FF" }}>⏱ Still Working</button>
                    <button onClick={() => { setShowEndModal(false); handlePause(); }} className="w-full rounded-2xl font-bold text-sm transition-transform active:scale-95" style={{ padding: "16px 0", background: "#FFF3F0", color: "#FF7043" }}>⏸ Pause</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "#E5E7EB" }} />
                  <p className="text-base font-bold text-center mb-1" style={{ color: "#1A1A3E" }}>How much longer?</p>
                  <p className="text-xs text-center mb-5" style={{ color: "#8B8FB5" }}>We will update your predicted end time and check for conflicts.</p>
                  <div className="grid grid-cols-2" style={{ gap: "12px" }}>
                    {["15 minutes", "30 minutes", "1 hour", "Not sure"].map((opt) => (
                      <button key={opt} onClick={() => { setShowEndModal(false); setStillWorkingChoice(null); }}
                        className="rounded-2xl font-bold text-sm transition-transform active:scale-95" style={{ padding: "16px 0", background: "#EEF0FF", color: "#6C63FF" }}>{opt}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }
      <BottomNav />
    </>
  );
}
