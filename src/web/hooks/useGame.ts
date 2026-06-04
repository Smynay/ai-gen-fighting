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

  const getController = useCallback(() => {
    if (!controllerRef.current) {
      const ctrl = new GameController({
        onStateChange: (info: IGameInfo) => {
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
