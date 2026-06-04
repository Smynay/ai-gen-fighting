import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../hooks/useGame";
import { useGameContext } from "../context/GameContext";
import { CharacterSelect } from "../components/game/CharacterSelect";
import { BattleScene } from "../components/game/BattleScene";

const MAX_PRESETS = [
  { value: "light", details: { health: 2, stamina: 4 } },
  { value: "medium", details: { health: 3, stamina: 3 } },
  { value: "heavy", details: { health: 4, stamina: 2 } },
];

export function GamePage() {
  const navigate = useNavigate();
  const { state } = useGameContext();
  const { startGame, selectPreset, selectAction, reset } = useGame();
  const startedRef = useRef(false);

  useEffect(() => {
    if (state.phase === "home" || state.phase === "idle") {
      navigate("/");
      return;
    }

    if (state.phase === "characterSelect" && state.gameMode && !startedRef.current) {
      startedRef.current = true;
      startGame(state.gameMode, state.aiDifficulty);
    }
  }, [state.phase, state.gameMode, state.aiDifficulty, navigate, startGame]);

  const handlePresetSelect = (preset: string) => {
    selectPreset(preset);
  };

  const handleAction = (action: string) => {
    selectAction(action as any);
  };

  const handlePlayAgain = () => {
    const mode = state.gameMode;
    const difficulty = state.aiDifficulty;
    if (!mode) return;

    reset();
    startedRef.current = true;
    startGame(mode, difficulty);
  };

  const handleBackToMenu = () => {
    reset();
    navigate("/");
  };

  if (state.phase === "home") {
    return null;
  }

  if (state.phase === "characterSelect") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <CharacterSelect
            presets={MAX_PRESETS}
            onSelect={handlePresetSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <BattleScene
          state={state}
          onAction={handleAction}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      </div>
    </div>
  );
}
