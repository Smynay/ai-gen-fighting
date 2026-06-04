import { useEffect, useRef } from "react";
import type { LogEntry } from "../../context/GameContext";

interface ActionLogProps {
  entries: LogEntry[];
}

const typeStyles: Record<LogEntry["type"], string> = {
  damage: "text-red-400",
  heal: "text-green-400",
  block: "text-blue-400",
  info: "text-gray-300",
  system: "text-yellow-400 italic",
};

export function ActionLog({ entries }: ActionLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        Battle log will appear here...
      </div>
    );
  }

  return (
    <div className="h-40 overflow-y-auto space-y-1 px-2 py-1">
      {entries.map((entry, i) => (
        <div
          key={i}
          className={`text-sm ${typeStyles[entry.type]} animate-fadeIn`}
        >
          <span className="text-gray-600 mr-1">{">"}</span>
          {entry.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
