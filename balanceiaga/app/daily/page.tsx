"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTaskStore } from "@/lib/taskStore";
import TaskEditModal from "@/components/TaskEditModal";
import { Suspense } from "react";

const CAT_CFG: Record<string, { color: string; bg: string; border: string }> = {
  Academic: { color: "#6C63FF", bg: "#EEF0FF", border: "#C7C3FF" },
  Social:   { color: "#E91E8C", bg: "#FFE8F3", border: "#FFB3D9" },
  Errands:  { color: "#E64A19", bg: "#FBE9E7", border: "#FFCCBC" },
  Other:    { color: "#00897B", bg: "#E0F2F1", border: "#A7D7D4" },
};
const PRIORITY_COLOR: Record<string, string> = {
  High: "#FF4444",
  Medium: "#FF7043",
  Low: "#00C853",
};

function DailyViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateParam = searchParams.get("date");
  const dateStr = dateParam || new Date().toISOString().split("T")[0];

  const tasks = useTaskStore((state) => state.tasks);
  const moveSlot = useTaskStore((state) => state.moveSlot);
  const [editingTask, setEditingTask] = useState<{ task: any, slotIndex: number } | null>(null);

  // Find tasks for this day
  const dayTasks = tasks.map(t => {
    const slotIndex = t.scheduledSlots.findIndex(s => s.date === dateStr);
    return slotIndex !== -1 ? { task: t, slotIndex, slot: t.scheduledSlots[slotIndex] } : null;
  }).filter(Boolean) as { task: any, slotIndex: number, slot: any }[];

  const timeToMins = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const totalWorkloadMins = dayTasks.reduce((sum, { slot }) => {
    return sum + (timeToMins(slot.endTime) - timeToMins(slot.startTime));
  }, 0);
  const workloadScore = Math.round((totalWorkloadMins / (8 * 60)) * 100);

  // For timeline
  const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

  const handleDragStart = (e: React.DragEvent, taskId: string, slotIndex: number) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("slotIndex", slotIndex.toString());
  };

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const slotIndex = parseInt(e.dataTransfer.getData("slotIndex"), 10);

    if (taskId && !isNaN(slotIndex)) {
      const taskObj = tasks.find(t => t.id === taskId);
      if (!taskObj) return;
      const slot = taskObj.scheduledSlots[slotIndex];
      const durationMins = timeToMins(slot.endTime) - timeToMins(slot.startTime);

      const newStartHour = hour.toString().padStart(2, '0');
      const newStart = `${newStartHour}:00`;

      const endMins = timeToMins(newStart) + durationMins;
      const newEndHour = Math.floor(endMins / 60).toString().padStart(2, '0');
      const newEndMin = (endMins % 60).toString().padStart(2, '0');
      const newEnd = `${newEndHour}:${newEndMin}`;

      moveSlot(taskId, slotIndex, dateStr, newStart, newEnd);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="screen px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: "#EEF0FF" }}>
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div>
            <p className="text-xl font-bold text-[#1A1A3E]">Daily Schedule</p>
            <p className="text-xs text-[#8B8FB5] mt-1">{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Workload Indicator */}
        <div className="rounded-2xl m-4 my-8 p-4 border flex items-center justify-between" style={{ margin: "10px", background: workloadScore > 75 ? "#FFF0F0" : workloadScore > 40 ? "#FFF8E1" : "#F0FFF4", borderColor: workloadScore > 75 ? "#FFE0E0" : workloadScore > 40 ? "#FFE0B2" : "#C8E6C9" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-xl">{workloadScore > 75 ? "🔴" : workloadScore > 40 ? "🟡" : "🟢"}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A1A3E]">Daily Workload</p>
              <p className="text-xs text-[#8B8FB5]">{Math.floor(totalWorkloadMins / 60)}h {totalWorkloadMins % 60}m scheduled</p>
            </div>
          </div>
          <p className="text-xl font-bold" style={{ color: workloadScore > 75 ? "#FF4444" : workloadScore > 40 ? "#FFB74D" : "#00C853" }}>
            {workloadScore}%
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-[#1A1A3E] mb-2" style={{ paddingLeft: "5px" }} >Timeline</p>
          <p className="text-xs text-gray-500 flex items-center gap-1" style={{ marginBottom: "15px", paddingLeft: "5px" }} ><Clock size={12} /> Drag tasks up or down to reschedule.</p>
        </div>

        {/* Timeline Grid */}
        <div className="relative border-t border-gray-100 mt-4">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex border-b border-gray-100 relative"
              style={{ height: '60px' }}
              onDrop={(e) => handleDrop(e, hour)}
              onDragOver={handleDragOver}
            >
              <div className="w-14 text-xs text-gray-400 font-medium py-2 pr-3 text-right flex-shrink-0">
                {hour > 12 ? hour - 12 : hour}{hour >= 12 ? 'PM' : 'AM'}
              </div>
              <div className="flex-1 border-l border-gray-100 relative">
                {dayTasks.filter(t => parseInt(t.slot.startTime.split(':')[0], 10) === hour).map(({ task, slotIndex, slot }) => {
                  const startMins = timeToMins(slot.startTime) % 60;
                  const durationMins = timeToMins(slot.endTime) - timeToMins(slot.startTime);

                  const c = CAT_CFG[task.category] ?? CAT_CFG.Other;
                  const pColor = PRIORITY_COLOR[task.priority] ?? '#00C853';

                  const isDone = task.status === 'done';
                  const cardHeight = Math.max((durationMins / 60) * 60, 36);
                  const isShort = cardHeight < 55;

                  return (
                    <div
                      key={`${task.id}-${slotIndex}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, slotIndex)}
                      onClick={() => setEditingTask({ task, slotIndex })}
                      className="absolute left-1.5 right-1.5 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                      style={{
                        top: `${(startMins / 60) * 100}%`,
                        height: `${cardHeight}px`,
                        background: c.bg,
                        borderLeft: `3px solid ${c.color}`,
                        border: `1px solid ${c.border}`,
                        borderLeftWidth: '3px',
                        borderLeftColor: c.color,
                        boxShadow: `0 1px 6px ${c.color}18`,
                        zIndex: 10,
                        opacity: isDone ? 0.6 : 1,
                        overflow: 'hidden',
                        padding: '5px 8px',
                      }}
                    >
                      {/* Row 1: dot + category + title */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: c.color }}
                        />
                        <span
                          className="text-[10px] font-bold flex-shrink-0 uppercase tracking-wide"
                          style={{ color: c.color }}
                        >
                          {task.category}
                        </span>
                        <span className="text-[10px] text-gray-300 flex-shrink-0">·</span>
                        <p
                          className="text-xs font-bold truncate flex-1"
                          style={{
                            color: '#1A1A3E',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </p>
                        {isDone && <span className="text-[10px] font-bold flex-shrink-0" style={{ color: '#00C853' }}>✓</span>}
                      </div>

                      {/* Row 2: time + priority — only if tall enough */}
                      {!isShort && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-medium" style={{ color: '#8B8FB5' }}>
                            {slot.startTime}–{slot.endTime}
                          </span>
                          <span
                            className="text-[10px] font-bold rounded px-1.5 py-0"
                            style={{ color: pColor, background: `${pColor}18` }}
                          >
                            {task.priority}
                          </span>
                          {task.isProtected && (
                            <span className="text-[10px] font-bold" style={{ color: '#6C63FF' }}>🔒</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask.task}
          slotIndex={editingTask.slotIndex}
          onClose={() => setEditingTask(null)}
        />
      )}

      <BottomNav />
    </>
  );
}

export default function DailyView() {
  return (
    <Suspense fallback={<div className="p-8">Loading schedule...</div>}>
      <DailyViewContent />
    </Suspense>
  );
}
