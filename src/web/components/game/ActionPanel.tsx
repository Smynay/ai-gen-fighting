import { Button } from "../ui/Button";

interface ActionConfig {
  id: string;
  label: string;
  icon: string;
  cost: number;
  description: string;
  color: string;
}

const actions: ActionConfig[] = [
  {
    id: "attack",
    label: "ATTACK",
    icon: "\u2694\uFE0F",
    cost: 2,
    description: "Deal 2 damage",
    color: "from-red-600 to-red-800 hover:from-red-500 hover:to-red-700",
  },
  {
    id: "block",
    label: "BLOCK",
    icon: "\uD83D\uDEE1\uFE0F",
    cost: 1,
    description: "Block 1 incoming damage",
    color: "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700",
  },
  {
    id: "dodge",
    label: "DODGE",
    icon: "\uD83D\uDCA8",
    cost: 2,
    description: "Evade incoming attack",
    color: "from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700",
  },
  {
    id: "rest",
    label: "REST",
    icon: "\uD83D\uDCA4",
    cost: 0,
    description: "Regenerate 2 stamina",
    color: "from-green-600 to-green-800 hover:from-green-500 hover:to-green-700",
  },
];

interface ActionPanelProps {
  stamina: number;
  onAction: (action: string) => void;
  disabled?: boolean;
  selectedAction?: string;
}

export function ActionPanel({
  stamina,
  onAction,
  disabled = false,
  selectedAction,
}: ActionPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const canAfford = action.cost <= stamina;
        const isSelected = action.id === selectedAction && selectedAction !== "idle";
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={disabled || !canAfford}
            className={`
              relative p-4 rounded-xl border transition-all duration-200
              bg-gradient-to-br ${action.color}
              ${
                isSelected
                  ? "ring-2 ring-white/80 scale-105 shadow-lg shadow-indigo-500/50 opacity-100"
                  : disabled || !canAfford
                    ? "opacity-40 cursor-not-allowed border-gray-600"
                    : "border-gray-600 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-lg"
              }
            `}
            title={`${action.label}: ${action.description}${
              action.cost > 0 ? ` (cost: ${action.cost} SP)` : ""
            }`}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            <div className="font-bold text-sm text-white">{action.label}</div>
            <div className="text-xs text-gray-300 mt-1">
              {action.cost > 0 ? `${action.cost} SP` : "Free"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
