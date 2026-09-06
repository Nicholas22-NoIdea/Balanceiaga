"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import OptionCard from "@/components/OptionCard";
import { mockCapacity, mockRebalanceOptions } from "@/lib/mockData";

export default function RebalancePage() {
  const router = useRouter();
  const cap = mockCapacity;

  const handleAccept = (id: string) => {
    console.log("Accepted:", id);
    router.push("/confirmation");
  };

  const handleReject = (id: string) => {
    console.log("Rejected:", id);
  };

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
        <div className="flex items-center gap-2 mb-4 px-1">
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
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
