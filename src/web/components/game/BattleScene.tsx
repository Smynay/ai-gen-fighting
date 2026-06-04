import { useEffect, useRef, useState } from "react";
import type { GameState } from "../../context/GameContext";
import { FighterCard } from "./FighterCard";
import { ActionPanel } from "./ActionPanel";
import { ActionLog } from "./ActionLog";
import { ResultScreen } from "./ResultScreen";
import { CombatEffect } from "./CombatEffect";

interface BattleSceneProps {
  state: GameState;
  onAction: (action: string) => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

interface FloatText {
  id: number;
  text: string;
  type: "damage" | "heal" | "block";
  side: "left" | "right";
}

const MAX_HP = 4;
const MAX_SP = 4;

let floatId = 0;

export function BattleScene({
  state,
  onAction,
  onPlayAgain,
  onBackToMenu,
}: BattleSceneProps) {
  const [showResult, setShowResult] = useState(false);
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const prevHealthRef = useRef({ player: 0, opponent: 0 });
  const prevStaminaRef = useRef({ player: 0, opponent: 0 });
  const prevPhaseRef = useRef(state.phase);

  useEffect(() => {
    if (state.phase === "actionResult" && prevPhaseRef.current !== "actionResult") {
      const newFloats: FloatText[] = [];

      const pHpDiff = state.player!.health - prevHealthRef.current.player;
      const oHpDiff = state.opponent!.health - prevHealthRef.current.opponent;
      const pSpDiff = state.player!.stamina - prevStaminaRef.current.player;
      const oSpDiff = state.opponent!.stamina - prevStaminaRef.current.opponent;

      if (oHpDiff < 0) {
        newFloats.push({
          id: ++floatId,
          text: `${Math.abs(oHpDiff)} HP`,
          type: "damage",
          side: "right",
        });
        setEnemyShake(true);
      }
      if (pHpDiff < 0) {
        newFloats.push({
          id: ++floatId,
          text: `${Math.abs(pHpDiff)} HP`,
          type: "damage",
          side: "left",
        });
        setPlayerShake(true);
      }
      if (oSpDiff < 0) {
        newFloats.push({
          id: ++floatId,
          text: `${Math.abs(oSpDiff)} SP`,
          type: "block",
          side: "right",
        });
      }
      if (oSpDiff > 0) {
        newFloats.push({
          id: ++floatId,
          text: `${oSpDiff} SP`,
          type: "heal",
          side: "right",
        });
      }
      if (pSpDiff > 0) {
        newFloats.push({
          id: ++floatId,
          text: `${pSpDiff} SP`,
          type: "heal",
          side: "left",
        });
      }

      if (newFloats.length > 0) {
        setFloatTexts((prev) => [...prev, ...newFloats]);
      }
    }

    prevHealthRef.current = {
      player: state.player?.health ?? 0,
      opponent: state.opponent?.health ?? 0,
    };
    prevStaminaRef.current = {
      player: state.player?.stamina ?? 0,
      opponent: state.opponent?.stamina ?? 0,
    };
    prevPhaseRef.current = state.phase;
  }, [state.player, state.opponent, state.phase]);

  useEffect(() => {
    const cleanup = setTimeout(() => {
      setFloatTexts([]);
      setPlayerShake(false);
      setEnemyShake(false);
    }, 1500);
    return () => clearTimeout(cleanup);
  }, [floatTexts]);

  useEffect(() => {
    if (state.phase === "matchEnd") {
      setShowResult(true);
    }
  }, [state.phase]);

  if (!state.player || !state.opponent) {
    return (
      <div className="text-center text-gray-400 py-8">Loading battle...</div>
    );
  }

  if (showResult) {
    return (
      <ResultScreen
        winner={state.winner}
        playerName="Player"
        onPlayAgain={onPlayAgain}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  const isWaiting = state.phase === "waitingForAction";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="inline-block px-4 py-1 bg-gray-700 rounded-full text-sm text-gray-300 font-mono">
          Round {state.round}/3 &middot; Action {state.action}/3
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className={`flex-1 relative ${playerShake ? "animate-shake" : ""}`}>
          <FighterCard
            name="YOU"
            fighter={state.player}
            isPlayer
            maxHp={MAX_HP}
            maxSp={MAX_SP}
            showAction={state.phase === "actionResult"}
          />
          {floatTexts
            .filter((f) => f.side === "left")
            .map((ft) => (
              <CombatEffect key={ft.id} {...ft} />
            ))}
        </div>
        <div className="flex items-center justify-center pt-8">
          <span className="text-3xl font-bold text-gray-500">VS</span>
        </div>
        <div className={`flex-1 relative ${enemyShake ? "animate-shake" : ""}`}>
          <FighterCard
            name="ENEMY"
            fighter={state.opponent}
            maxHp={MAX_HP}
            maxSp={MAX_SP}
            showAction={state.phase === "actionResult"}
          />
          {floatTexts
            .filter((f) => f.side === "right")
            .map((ft) => (
              <CombatEffect key={ft.id} {...ft} />
            ))}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="px-3 py-2 border-b border-gray-700 text-xs text-gray-500 font-bold uppercase">
          Battle Log
        </div>
        <ActionLog entries={state.log} />
      </div>

      {isWaiting && (
        <div className="animate-pulse text-center text-indigo-400 text-sm">
          Choose your action!
        </div>
      )}

      {state.phase === "actionResult" && (
        <div className="text-center text-gray-400 text-sm animate-pulse">
          Resolving...
        </div>
      )}

      <ActionPanel
        stamina={state.player.stamina}
        onAction={onAction}
        disabled={!isWaiting}
        selectedAction={state.player.selectedAction}
      />
    </div>
  );
}
