"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, X, Scissors, ArrowRight, Shuffle, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import OptionCard from "@/components/OptionCard";
import { mockCapacity, mockRebalanceOptions } from "@/lib/mockData";

export default function RebalancePage() {
  const router = useRouter();
  const cap = mockCapacity;
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [actionOverrides, setActionOverrides] = useState<Record<string, string>>({});

  const handleEditOpen = (id: string) => {
    setEditingOptionId(id);
    setActionOverrides({});
  };

  const handleEditClose = () => {
    setEditingOptionId(null);
    setActionOverrides({});
  };

  const handleAccept = (id: string) => {
    console.log("Accepted:", id);
    router.push("/confirmation");
  };

  const handleReject = (id: string) => {
    console.log("Rejected:", id);
  };

  const editingOption = mockRebalanceOptions.find(o => o.id === editingOptionId);

  return (
    <>
      <div className="screen px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "#EEF0FF" }}
          >
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Rebalance</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>We found 3 ways to fix your week</p>
          </div>
        </div>

        {/* Current overload pill */}
        <div className="flex items-center gap-2 px-1" style={{ marginTop: 5, marginBottom: 5 }}>
          <Zap size={14} color="#FF4444" />
          <span className="text-sm" style={{ color: "#FF4444", fontWeight: 600 }}>
            Currently {cap.overloadHours}h over capacity ({cap.overloadPercent}%)
          </span>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mb-4">
          {mockRebalanceOptions.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              onAccept={handleAccept}
              onReject={handleReject}
              onEdit={handleEditOpen}
            />
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingOption && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white w-full max-w-[375px] rounded-t-3xl flex flex-col animate-slide-up" style={{ maxHeight: "85vh", padding: "24px 20px" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Edit Rebalance</h3>
                <p className="text-xs font-medium" style={{ color: "#8B8FB5" }}>{editingOption.label}</p>
              </div>
              <button onClick={handleEditClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F5F5F7" }}>
                <X size={16} color="#1A1A3E" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col" style={{ gap: "16px", marginBottom: "24px" }}>
              {editingOption.changes.map((change, i) => {
                const currentAction = actionOverrides[change.taskId] || change.action;
                return (
                  <div key={i} className="rounded-2xl" style={{ padding: "16px", border: "1px solid #EBEBFF" }}>
                    <p className="font-bold text-sm mb-1" style={{ color: "#1A1A3E" }}>{change.taskTitle}</p>
                    <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>{change.detail}</p>
                    <div className="flex" style={{ gap: "8px" }}>
                      {["KEEP", "MOVE", "SPLIT", "REDISTRIBUTE"].map((act) => {
                        const active = currentAction === act;
                        return (
                          <button 
                            key={act}
                            onClick={() => setActionOverrides({ ...actionOverrides, [change.taskId]: act })}
                            className="flex-1 rounded-lg text-[10px] font-bold transition-colors" 
                            style={{ padding: "6px 0", background: active ? "#6C63FF" : "#F5F5F7", color: active ? "white" : "#8B8FB5" }}
                          >
                            {act}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={handleEditClose} className="w-full py-4 rounded-2xl font-bold text-white transition-transform active:scale-95" style={{ background: "#1A1A3E" }}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
