"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, Sparkles, RefreshCw, Bot, Sliders } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import OptionCard from "@/components/OptionCard";
import { mockCapacity, mockRebalanceOptions, RebalanceOption } from "@/lib/mockData";

export default function RebalancePage() {
  const router = useRouter();
  const [options, setOptions] = useState<RebalanceOption[]>(mockRebalanceOptions);
  const [loading, setLoading] = useState(false);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [cap, setCap] = useState(mockCapacity);

  const fetchRebalanceData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rebalance");
      if (res.ok) {
        const data = await res.json();
        if (data.options && data.options.length > 0) {
          setOptions(data.options);
        }
        if (typeof data.isAIPowered === "boolean") {
          setIsAIPowered(data.isAIPowered);
        }
        if (data.capacity) {
          setCap(data.capacity);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch rebalance options, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRebalanceData();
  }, []);

  const handleAccept = (id: string) => {
    const chosen = options.find((o) => o.id === id) || options[0];
    try {
      localStorage.setItem("balanceiaga_accepted_rebalance", JSON.stringify(chosen));
    } catch (err) {
      console.error("Failed to save accepted rebalance option:", err);
    }
    router.push("/confirmation");
  };

  const handleReject = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <>
      <div className="screen px-4 pt-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-transform active:scale-95"
              style={{ background: "#EEF0FF" }}
              aria-label="Back"
            >
              <ArrowLeft size={18} color="#6C63FF" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Rebalance</p>
                <span
                  className="pill flex items-center gap-1 text-xs"
                  style={{
                    background: isAIPowered ? "#F5F3FF" : "#EEF0FF",
                    color: isAIPowered ? "#7C3AED" : "#6C63FF",
                    border: isAIPowered ? "1px solid #DDD6FE" : "none",
                  }}
                >
                  {isAIPowered ? <Sparkles size={11} /> : <Sliders size={11} />}
                  {isAIPowered ? "AI Rebalance" : "Smart Solver"}
                </span>
              </div>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>
                {loading ? "Calculating optimal slots..." : `We found ${options.length} ways to fix your week`}
              </p>
            </div>
          </div>

          <button
            onClick={fetchRebalanceData}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-transform active:scale-95"
            style={{ background: "#F5F6FF" }}
            title="Recalculate options"
          >
            <RefreshCw
              size={16}
              color="#6C63FF"
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* Current overload pill */}
        <div
          className="flex items-center justify-between rounded-xl px-3 py-2 mb-4"
          style={{ background: "#FFF0F0" }}
        >
          <div className="flex items-center gap-2">
            <Zap size={15} color="#FF4444" />
            <span className="text-xs font-semibold" style={{ color: "#FF4444" }}>
              Currently {cap.overloadHours}h over capacity ({cap.overloadPercent}%)
            </span>
          </div>
          <span className="text-xs" style={{ color: "#FF8888" }}>
            Target: ≤ 100%
          </span>
        </div>

        {/* AI status banner */}
        <div
          className="rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2.5 text-xs"
          style={{
            background: isAIPowered
              ? "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)"
              : "#F8F8FF",
            border: isAIPowered ? "1px solid #C4B5FD" : "1px solid #EBEBFF",
          }}
        >
          {isAIPowered ? (
            <Bot size={16} color="#7C3AED" className="flex-shrink-0" />
          ) : (
            <Sparkles size={16} color="#6C63FF" className="flex-shrink-0" />
          )}
          <p style={{ color: isAIPowered ? "#5B21B6" : "#555887" }}>
            {isAIPowered
              ? "Options generated by Gemini AI tailored to your workload & deadlines."
              : "Algorithm prioritized academic commitments and bottleneck relief."}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mb-6">
          {loading ? (
            <div className="card text-center py-12">
              <RefreshCw size={24} color="#6C63FF" className="animate-spin mx-auto mb-2" />
              <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>
                Analyzing schedule bottlenecks...
              </p>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>
                Finding optimal redistribution slots
              </p>
            </div>
          ) : options.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>
                No active overload detected
              </p>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>
                Your schedule is currently within safe limits!
              </p>
            </div>
          ) : (
            options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
