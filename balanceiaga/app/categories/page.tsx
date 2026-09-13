"use client";

import Link from "next/link";
import { ArrowLeft, Clock, LayoutList } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTaskStore } from "@/lib/taskStore";
import { Suspense } from "react";

const CAT_CFG: Record<string, { color: string; bg: string; border: string }> = {
  Academic: { color: "#6C63FF", bg: "#EEF0FF", border: "#C7C3FF" },
  Social:   { color: "#E91E8C", bg: "#FFE8F3", border: "#FFB3D9" },
  Errands:  { color: "#E64A19", bg: "#FBE9E7", border: "#FFCCBC" },
  Other:    { color: "#00897B", bg: "#E0F2F1", border: "#A7D7D4" },
};

function CategoriesContent() {
  const tasks = useTaskStore((state) => state.tasks);

  const categoriesMap: Record<string, typeof tasks> = {
    Academic: [],
    Social: [],
    Errands: [],
    Other: [],
  };

  let totalScheduledMins = 0;

  tasks.forEach((task) => {
    const cat = categoriesMap[task.category] ? task.category : "Other";
    categoriesMap[cat].push(task);

    task.scheduledSlots.forEach((slot) => {
      const [sh, sm] = slot.startTime.split(":").map(Number);
      const [eh, em] = slot.endTime.split(":").map(Number);
      totalScheduledMins += (eh * 60 + em) - (sh * 60 + sm);
    });
  });

  return (
    <>
      <div className="screen px-4 pt-8 pb-24">
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
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Category Breakdown</p>
            <p className="text-xs" style={{ color: "#8B8FB5", marginBottom: "10px" }}>Week of 7–13 Sep 2026</p>
          </div>
        </div>

        {/* Total Time Summary Card */}
        <div className="card mb-6 flex items-center justify-between" style={{ background: "#F8F9FF", border: "1px solid #E8E9FF" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Clock size={18} color="#6C63FF" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Total Scheduled</p>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>Across all categories</p>
            </div>
          </div>
          <span className="text-lg font-black" style={{ color: "#6C63FF" }}>
            {Math.floor(totalScheduledMins / 60)}h {totalScheduledMins % 60}m
          </span>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-6">
          {Object.entries(categoriesMap).map(([catName, catTasks]) => {
            if (catTasks.length === 0) return null;
            const cfg = CAT_CFG[catName] || CAT_CFG.Other;

            let catMins = 0;
            catTasks.forEach((task) => {
              task.scheduledSlots.forEach((slot) => {
                const [sh, sm] = slot.startTime.split(":").map(Number);
                const [eh, em] = slot.endTime.split(":").map(Number);
                catMins += (eh * 60 + em) - (sh * 60 + sm);
              });
            });

            return (
              <div key={catName} className="card p-0 overflow-hidden" style={{ background: "white", border: "1px solid #F0F1FF" }}>
                {/* Category Header */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: cfg.bg }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm">
                      <LayoutList size={16} color={cfg.color} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: cfg.color }}>{catName}</p>
                      <p className="text-[11px]" style={{ color: cfg.color, opacity: 0.8 }}>
                        {catTasks.length} task{catTasks.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black" style={{ color: cfg.color }}>
                    {Math.floor(catMins / 60)}h {catMins % 60}m
                  </span>
                </div>

                {/* Task List */}
                <div className="flex flex-col p-2">
                  {catTasks.map((task, index) => (
                    <div key={task.id}>
                      <div className="p-3 flex items-center justify-between rounded-xl hover:bg-[#F8F9FF] transition-colors">
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-bold text-[#1A1A3E] mb-0.5">{task.title}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium" style={{ color: "#8B8FB5" }}>
                              {task.scheduledSlots.length} session{task.scheduledSlots.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-gray-300 text-[10px]">·</span>
                            <span className="text-[11px] font-medium" style={{ color: "#8B8FB5" }}>
                              {task.estimatedHours}h est.
                            </span>
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-bold rounded-full px-2 py-0.5"
                          style={{
                            background: task.priority === "High" ? "#FFF0F0" : task.priority === "Medium" ? "#FFF4ED" : "#E8F9F0",
                            color: task.priority === "High" ? "#FF4444" : task.priority === "Medium" ? "#FF7043" : "#00C853",
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      {index < catTasks.length - 1 && (
                        <div className="mx-4 border-b" style={{ borderColor: "#F0F1FF" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default function CategoriesView() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
