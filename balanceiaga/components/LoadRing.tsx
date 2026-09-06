interface LoadRingProps {
  percent: number;
  workloadHours: number;
  capacityHours: number;
  size?: number;
}

export default function LoadRing({ percent, workloadHours, capacityHours, size = 140 }: LoadRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(percent, 150);
  const strokeDashoffset = circumference - (clampedPercent / 150) * circumference;
  const isOverloaded = percent > 100;

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size, position: "relative" }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Background track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#EBEBFF" strokeWidth="10" />
          {/* Progress arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={isOverloaded ? "#FF4444" : "#6C63FF"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-bold"
            style={{ fontSize: 22, color: isOverloaded ? "#FF4444" : "#1A1A3E" }}
          >
            {percent}%
          </span>
          <span className="text-xs" style={{ color: "#8B8FB5" }}>
            Capacity
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>
          {workloadHours}h workload / {capacityHours}h capacity
        </p>
      </div>
    </div>
  );
}
