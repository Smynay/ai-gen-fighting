import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { useGameContext } from "../context/GameContext";
import { WS_MSG_SERVER } from "../../server/types";
import type { IGameInfo } from "../../core/GameController";
import { CharacterSelect } from "../components/game/CharacterSelect";
import { BattleScene } from "../components/game/BattleScene";
import { LobbyPage } from "./LobbyPage";

const PRESETS = [
  { value: "light", details: { health: 2, stamina: 4 } },
  { value: "medium", details: { health: 3, stamina: 3 } },
  { value: "heavy", details: { health: 4, stamina: 2 } },
];

export function PvPGamePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameContext();
  const [hasOpponent, setHasOpponent] = useState(false);
  const [presetSent, setPresetSent] = useState(false);
  const prevGameInfoRef = useRef<IGameInfo | null>(null);
  const playerIdRef = useRef<string | null>(null);

  const handleMessage = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      switch (type) {
        case WS_MSG_SERVER.OPPONENT_JOINED: {
          setHasOpponent(true);
          dispatch({
            type: "ADD_LOG",
            entry: { text: "Opponent joined!", type: "system" },
          });
          break;
        }
        case WS_MSG_SERVER.GAME_STATE: {
          const info = payload as unknown as IGameInfo;
          const prev = prevGameInfoRef.current;

          const isFirstPlayer = playerIdRef.current !== "player_2";
          const localPlayer = isFirstPlayer ? info.player : info.opponent;
          const localOpponent = isFirstPlayer ? info.opponent : info.player;

          if (info.phase === "actionResult" && prev?.phase !== "actionResult") {
            if (localOpponent?.executedAction && localOpponent.executedAction !== "idle") {
              dispatch({
                type: "ADD_LOG",
                entry: { text: `Enemy used ${localOpponent.executedAction}!`, type: "info" },
              });
            }
            if (prev) {
              const pPrev = isFirstPlayer ? prev.player : prev.opponent;
              const pCurr = localPlayer;
              const oPrev = isFirstPlayer ? prev.opponent : prev.player;
              const oCurr = localOpponent;
              const hpLoss = pPrev.health - pCurr.health;
              if (hpLoss > 0) {
                dispatch({
                  type: "ADD_LOG",
                  entry: { text: `You took ${hpLoss} damage!`, type: "damage" },
                });
              }
              const staminaGain = pCurr.stamina - pPrev.stamina;
              if (staminaGain > 0) {
                dispatch({
                  type: "ADD_LOG",
                  entry: { text: `You restored ${staminaGain} stamina`, type: "heal" },
                });
              }
              const oHpLoss = oPrev.health - oCurr.health;
              if (oHpLoss > 0) {
                dispatch({
                  type: "ADD_LOG",
                  entry: { text: `Enemy took ${oHpLoss} damage!`, type: "damage" },
                });
              }
            }
          }

          if (info.phase === "roundResult" && prev?.phase !== "roundResult") {
            dispatch({
              type: "ADD_LOG",
              entry: { text: "Round break: +2 HP and +2 SP restored", type: "heal" },
            });
          }

          if (info.phase === "matchEnd" && prev?.phase !== "matchEnd") {
            const iWon = localPlayer && info.winnerId === localPlayer.id;
            dispatch({
              type: "ADD_LOG",
              entry: { text: info.winnerId ? iWon ? "You win!" : "Enemy wins!" : "Draw!", type: "system" },
            });
          }

          prevGameInfoRef.current = info;

          dispatch({
            type: "UPDATE_STATE",
            state: {
              phase: info.phase as any,
              round: info.round,
              action: info.action,
              player: localPlayer
                ? {
                    health: localPlayer.health,
                    stamina: localPlayer.stamina,
                    selectedAction: localPlayer.selectedAction,
                    executedAction: localPlayer.executedAction,
                  }
                : null,
              opponent: localOpponent
                ? {
                    health: localOpponent.health,
                    stamina: localOpponent.stamina,
                    selectedAction: localOpponent.selectedAction,
                    executedAction: localOpponent.executedAction,
                  }
                : null,
              winner: info.winnerId
                ? (localPlayer && info.winnerId === localPlayer.id ? "win" : "lose")
                : null,
            },
          });
          break;
        }
        case WS_MSG_SERVER.PRESET_REQUEST: {
          dispatch({ type: "SET_PHASE", phase: "characterSelect" });
          break;
        }
        case WS_MSG_SERVER.ACTION_REQUEST: {
          dispatch({ type: "SET_PHASE", phase: "waitingForAction" });
          break;
        }
        case WS_MSG_SERVER.OPPONENT_DISCONNECTED: {
          dispatch({
            type: "ADD_LOG",
            entry: { text: "Opponent disconnected!", type: "system" },
          });
          break;
        }
      }
    },
    [dispatch],
  );

  const ws = useWebSocket(handleMessage);

  useEffect(() => {
    playerIdRef.current = ws.playerId;
  }, [ws.playerId]);

  useEffect(() => {
    ws.connect();

    if (!ws.connected) {
      const check = setInterval(() => {
        if (ws.connected) {
          clearInterval(check);
        }
      }, 500);
      return () => clearInterval(check);
    }
  }, []);

  const handlePreset = (preset: string) => {
    ws.sendPreset(preset);
    setPresetSent(true);
    dispatch({
      type: "ADD_LOG",
      entry: { text: "Preset sent, waiting for opponent...", type: "info" },
    });
  };

  const handleAction = (action: string) => {
    ws.sendAction(action);
    dispatch({
      type: "ADD_LOG",
      entry: { text: `You used ${action}!`, type: "info" },
    });
  };

  const handlePlayAgain = () => {
    ws.sendRematch();
    setPresetSent(false);
    dispatch({ type: "SET_PHASE", phase: "characterSelect" });
  };

  const handleBackToMenu = () => {
    ws.disconnect();
    navigate("/");
  };

  if (!ws.roomId) {
    return (
      <LobbyPage
        onCreateRoom={ws.createRoom}
        onJoinRoom={ws.joinRoom}
        connected={ws.connected}
        roomId={ws.roomId}
        hasOpponent={hasOpponent}
      />
    );
  }

  if (!hasOpponent || state.phase === "characterSelect") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-6 text-center">
          {!hasOpponent && (
            <div className="space-y-4">
              <div className="animate-pulse text-indigo-400 text-lg">
                Waiting for opponent to connect...
              </div>
              <div className="text-gray-500 text-sm">
                Room: <span className="font-mono text-indigo-300">{ws.roomId}</span>
              </div>
            </div>
          )}
          {hasOpponent && state.phase === "characterSelect" && (
            <div className="space-y-4">
              <CharacterSelect presets={PRESETS} onSelect={handlePreset} />
              {presetSent && (
                <div className="animate-pulse text-yellow-400 text-sm">
                  Waiting for opponent to choose class...
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleBackToMenu}
            className="text-gray-500 hover:text-gray-300 text-sm underline"
          >
            Back to Menu
          </button>
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
