import { useCallback, useEffect, useRef } from "react";
import {
  GameController,
  GameMode,
  type IGameInfo,
} from "../../core/GameController";
import type { ActorId, ActorStatus } from "../../core/actor";
import { useGameContext, type LogEntry } from "../context/GameContext";

export function useGame() {
  const { state, dispatch } = useGameContext();
  const controllerRef = useRef<GameController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevGameInfoRef = useRef<IGameInfo | null>(null);

  const getController = useCallback(() => {
    if (!controllerRef.current) {
      const ctrl = new GameController({
        onStateChange: (info: IGameInfo) => {
          const prev = prevGameInfoRef.current;

          if (info.phase === "actionResult" && prev?.phase !== "actionResult") {
            if (info.opponent?.executedAction && info.opponent.executedAction !== "idle") {
              dispatch({
                type: "ADD_LOG",
                entry: { text: `Enemy used ${info.opponent.executedAction}!`, type: "info" },
              });
            }
            if (prev) {
              const hpLoss = prev.player.health - info.player.health;
              if (hpLoss > 0) {
                dispatch({
                  type: "ADD_LOG",
                  entry: { text: `You took ${hpLoss} damage!`, type: "damage" },
                });
              }
              const staminaGain = info.player.stamina - prev.player.stamina;
              if (staminaGain > 0) {
                dispatch({
                  type: "ADD_LOG",
                  entry: { text: `You restored ${staminaGain} stamina`, type: "heal" },
                });
              }
              const oHpLoss = prev.opponent.health - info.opponent.health;
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
            dispatch({
              type: "ADD_LOG",
              entry: {
                text: info.winnerId
                  ? (info.winnerId === info.player?.id ? "You win!" : "Enemy wins!")
                  : "Draw!",
                type: "system",
              },
            });
          }

          prevGameInfoRef.current = info;

          dispatch({
            type: "UPDATE_STATE",
            state: {
              phase: info.phase as any,
              round: info.round,
              action: info.action,
              player: info.player
                ? {
                    health: info.player.health,
                    stamina: info.player.stamina,
                    selectedAction: info.player.selectedAction,
                    executedAction: info.player.executedAction,
                  }
                : null,
              opponent: info.opponent
                ? {
                    health: info.opponent.health,
                    stamina: info.opponent.stamina,
                    selectedAction: info.opponent.selectedAction,
                    executedAction: info.opponent.executedAction,
                  }
                : null,
              winner: info.winnerId
                ? (info.winnerId === info.player?.id ? "win" : "lose")
                : null,
            },
          });
        },
      });
      controllerRef.current = ctrl;
    }
    return controllerRef.current;
  }, [dispatch]);

  const startGame = useCallback(
    (mode: "pve" | "pvp", aiDifficulty?: string) => {
      const controller = getController();
      const gm = mode === "pvp" ? GameMode.PvP : GameMode.PvE;
      controller.start(gm, aiDifficulty);
      dispatch({
        type: "SET_GAME_MODE",
        mode,
        aiDifficulty,
      });
      dispatch({
        type: "ADD_LOG",
        entry: {
          text: mode === "pve" ? "Game started: PvE mode" : "Game started: PvP mode",
          type: "system",
        },
      });
    },
    [getController, dispatch],
  );

  const selectPreset = useCallback(
    (preset: string) => {
      const controller = getController();
      controller.selectPreset("0" as ActorId, preset as any);
      dispatch({
        type: "ADD_LOG",
        entry: { text: `Player selected ${preset} class`, type: "info" },
      });
    },
    [getController, dispatch],
  );

  const selectAction = useCallback(
    (action: ActorStatus) => {
      const controller = getController();
      controller.selectAction("0" as ActorId, action);

      dispatch({
        type: "ADD_LOG",
        entry: { text: `Player uses ${action}!`, type: "info" },
      });
    },
    [getController, dispatch],
  );

  const proceed = useCallback(() => {
    const controller = getController();
    controller.proceedAfterResult();
  }, [getController]);

  const reset = useCallback(() => {
    const controller = getController();
    controller.reset();
    dispatch({ type: "RESET" });
  }, [getController, dispatch]);

  useEffect(() => {
    if (state.phase === "actionResult" || state.phase === "roundResult") {
      timerRef.current = setTimeout(() => {
        proceed();
      }, 1500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, proceed]);

  useEffect(() => {
    return () => {
      controllerRef.current = null;
    };
  }, []);

  return {
    state,
    startGame,
    selectPreset,
    selectAction,
    reset,
  };
}
