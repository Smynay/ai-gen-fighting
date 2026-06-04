interface ProgressBarProps {
  value: number;
  maxValue: number;
  color?: "red" | "green" | "blue" | "yellow";
  label: string;
}

const colorMap = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};

export function ProgressBar({
  value,
  maxValue,
  color = "green",
  label,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / maxValue) * 100));

  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-xs font-bold text-white">{label}</span>
      <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-right text-white font-mono">
        {value}/{maxValue}
      </span>
    </div>
  );
}
