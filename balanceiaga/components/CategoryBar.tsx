import { CategoryLoad } from "@/lib/mockData";

interface CategoryBarProps {
  load: CategoryLoad;
  maxHours: number;
}

export default function CategoryBar({ load, maxHours }: CategoryBarProps) {
  const pct = maxHours > 0 ? Math.round((load.hours / maxHours) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-xl"
        style={{ background: load.bgColor }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: load.color }} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>
            {load.category}
          </span>
          <span className="text-sm font-bold" style={{ color: load.color }}>
            {load.hours}h
          </span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#F0F1FF" }}>
          <div
            className="h-full rounded-full"
            style={
              {
                width: `${pct}%`,
                background: load.color,
                transition: "width 0.5s ease",
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
