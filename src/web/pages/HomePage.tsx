import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useGameContext } from "../context/GameContext";

const difficulties = [
  { id: "easy", label: "Easy", desc: "Frequent mistakes" },
  { id: "medium", label: "Medium", desc: "Balanced" },
  { id: "hard", label: "Hard", desc: "Aggressive & tactical" },
  { id: "random", label: "Random", desc: "Pure chaos" },
];

const multiplayerDisabled = import.meta.env.VITE_DISABLE_MULTIPLAYER === "true";

export function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useGameContext();
  const [aiDifficulty, setAiDifficulty] = useState("easy");

  const handleStartPvE = () => {
    dispatch({
      type: "SET_GAME_MODE",
      mode: "pve",
      aiDifficulty,
    });
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-red-400">
            TASTE OF IRON
          </h1>
          <p className="text-gray-500 text-sm">
            A turn-based fighting game
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-bold text-white mb-1">PvE Mode</h2>
            <p className="text-gray-400 text-sm">Fight against AI</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-medium">AI Difficulty</p>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setAiDifficulty(d.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    aiDifficulty === d.id
                      ? "border-indigo-400 bg-indigo-900/30"
                      : "border-gray-600 bg-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="font-bold text-sm text-white">{d.label}</div>
                  <div className="text-xs text-gray-400">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleStartPvE}
          >
            Start Game
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/pvp")}
            disabled={multiplayerDisabled}
            title={multiplayerDisabled ? "Requires a running server — not available on this deployment" : undefined}
          >
            PvP Mode {multiplayerDisabled ? "(offline)" : "(Multiplayer)"}
          </Button>
        </div>
      </div>
    </div>
  );
}
