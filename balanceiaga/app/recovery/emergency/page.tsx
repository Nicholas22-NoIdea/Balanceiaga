"use client";
import Link from "next/link";
import { LifeBuoy, Moon, Zap, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmergencyRecoveryMode() {
  const router = useRouter();

  return (
    <div className="fixed inset-y-0 z-50 flex flex-col items-center justify-center" style={{ width: "375px", left: "50%", transform: "translateX(-50%)", background: "#1A1A3E" }}>
      <button onClick={() => router.back()} className="absolute top-8 right-6 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
        <X size={20} color="white" />
      </button>

      <div className="text-center w-full" style={{ padding: "0 32px", marginBottom: "40px" }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "rgba(255,68,68,0.2)", border: "2px solid rgba(255,68,68,0.5)", margin: "0 auto 24px auto" }}>
          <LifeBuoy size={48} color="#FF4444" />
        </div>
        <h1 className="text-3xl font-black text-white" style={{ marginBottom: "16px" }}>Overload Detected</h1>
        <p className="text-sm" style={{ color: "#B8B5FF", lineHeight: 1.6 }}>
          Your schedule is extremely demanding today. Instead of trying to fit in more work, let&apos;s create some breathing room.
        </p>
      </div>

      <div className="w-full flex flex-col" style={{ padding: "0 24px", gap: "16px" }}>
        {/* Option 1: Rebalance */}
        <Link href="/rebalance" className="w-full rounded-2xl flex items-center justify-between transition-transform active:scale-95" style={{ padding: "16px", background: "white" }}>
          <div className="flex items-center" style={{ gap: "16px" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#EEF0FF" }}>
              <Zap size={24} color="#6C63FF" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Rebalance</p>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>Move flexible tasks</p>
            </div>
          </div>
          <ArrowRight size={20} color="#8B8FB5" />
        </Link>

        {/* Option 2: Recover */}
        <Link href="/recovery" className="w-full rounded-2xl flex items-center justify-between transition-transform active:scale-95" style={{ padding: "16px", background: "white" }}>
          <div className="flex items-center" style={{ gap: "16px" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#E0F7FA" }}>
              <span className="text-2xl">🌱</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Recover Now</p>
              <p className="text-xs" style={{ color: "#8B8FB5" }}>Take a short break</p>
            </div>
          </div>
          <ArrowRight size={20} color="#8B8FB5" />
        </Link>

        {/* Option 3: Protect Sleep */}
        <button className="w-full rounded-2xl flex items-center justify-between transition-transform active:scale-95" style={{ padding: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center" style={{ gap: "16px" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Moon size={24} color="white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Protect Sleep</p>
              <p className="text-xs" style={{ color: "#B8B5FF" }}>Clear evening schedule</p>
            </div>
          </div>
          <ArrowRight size={20} color="#8B8FB5" />
        </button>
      </div>
    </div>
  );
}
