import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { ActorStatus } from "../../core/actor";

export interface FighterState {
  health: number;
  stamina: number;
  selectedAction: ActorStatus;
  executedAction: ActorStatus;
}

export type GamePhase =
  | "idle"
  | "home"
  | "characterSelect"
  | "waitingForAction"
  | "actionResult"
  | "roundResult"
  | "matchEnd";

export interface LogEntry {
  text: string;
  type: "damage" | "heal" | "block" | "info" | "system";
}

export interface GameState {
  phase: GamePhase;
  gameMode: "pve" | "pvp" | null;
  aiDifficulty: string;
  player: FighterState | null;
  opponent: FighterState | null;
  round: number;
  action: number;
  winner: string | null;
  log: LogEntry[];
}

type GameAction =
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_GAME_MODE"; mode: "pve" | "pvp"; aiDifficulty?: string }
  | { type: "SET_PLAYER"; player: FighterState }
  | { type: "SET_OPPONENT"; opponent: FighterState }
  | { type: "SET_ROUND_ACTION"; round: number; action: number }
  | { type: "SET_WINNER"; winner: string | null }
  | { type: "ADD_LOG"; entry: LogEntry }
  | { type: "CLEAR_LOG" }
  | { type: "UPDATE_STATE"; state: Partial<GameState> }
  | { type: "RESET" };

const initialState: GameState = {
  phase: "home",
  gameMode: null,
  aiDifficulty: "easy",
  player: null,
  opponent: null,
  round: 0,
  action: 0,
  winner: null,
  log: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "SET_GAME_MODE":
      return {
        ...state,
        gameMode: action.mode,
        aiDifficulty: action.aiDifficulty ?? state.aiDifficulty,
        phase: "characterSelect",
        log: [],
      };
    case "SET_PLAYER":
      return { ...state, player: action.player };
    case "SET_OPPONENT":
      return { ...state, opponent: action.opponent };
    case "SET_ROUND_ACTION":
      return { ...state, round: action.round, action: action.action };
    case "SET_WINNER":
      return { ...state, winner: action.winner };
    case "ADD_LOG":
      return { ...state, log: [...state.log, action.entry] };
    case "CLEAR_LOG":
      return { ...state, log: [] };
    case "UPDATE_STATE":
      return { ...state, ...action.state };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}
