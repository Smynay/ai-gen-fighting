import type { FighterState } from "../../context/GameContext";
import { ProgressBar } from "../ui/ProgressBar";

interface FighterCardProps {
  name: string;
  fighter: FighterState;
  isPlayer?: boolean;
  maxHp: number;
  maxSp: number;
  showAction?: boolean;
}

export function FighterCard({
  name,
  fighter,
  isPlayer,
  maxHp,
  maxSp,
  showAction,
}: FighterCardProps) {
  const hpColor =
    fighter.health <= 1 ? "red" : fighter.health <= 2 ? "yellow" : "green";

  return (
    <div
      className={`p-4 rounded-xl border-2 ${
        isPlayer
          ? "border-indigo-500 bg-indigo-900/20"
          : "border-red-500 bg-red-900/20"
      }`}
    >
      <div className="text-center mb-3">
        <h3 className={`text-lg font-bold ${isPlayer ? "text-indigo-300" : "text-red-300"}`}>
          {name}
        </h3>
      </div>

      <div className="space-y-2 mb-3">
        <ProgressBar
          value={fighter.health}
          maxValue={maxHp}
          color={hpColor}
          label="HP"
        />
        <ProgressBar
          value={fighter.stamina}
          maxValue={maxSp}
          color="blue"
          label="SP"
        />
      </div>

      {showAction && fighter.executedAction !== "idle" && (
        <div className="text-center mt-2">
          <span className="inline-block px-3 py-1 rounded-full bg-gray-700 text-xs font-mono text-gray-300 uppercase">
            {fighter.executedAction}
          </span>
        </div>
      )}
    </div>
  );
}
