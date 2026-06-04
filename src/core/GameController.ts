import {
  Actor,
  ActorId,
  ActorStatus,
  IActor,
  IActorInfo,
  IActorParams,
} from "./actor";
import { RoundActionCounter } from "./counters";
import { ActionCalculator, RoundBreakCalculator } from "./calculators";
import { AIFactory, AI } from "./ai";

export enum GameMode {
  PvP,
  PvE,
}

export enum GamePhase {
  CHARACTER_SELECT = "characterSelect",
  WAITING_FOR_ACTION = "waitingForAction",
  ACTION_RESULT = "actionResult",
  ROUND_RESULT = "roundResult",
  MATCH_END = "matchEnd",
}

export interface IGameInfo {
  phase: GamePhase;
  round: number;
  action: number;
  player: { id: ActorId; health: number; stamina: number; selectedAction: ActorStatus; executedAction: ActorStatus };
  opponent: { id: ActorId; health: number; stamina: number; selectedAction: ActorStatus; executedAction: ActorStatus };
  winnerId?: ActorId | null;
}

export interface IPresetAndDetails<T extends string> {
  value: T;
  details: IActorParams;
}

export interface IGameEvents {
  onStateChange: (info: IGameInfo) => void;
}

export class GameController {
  static MAX_ROUNDS = 3;
  static ACTIONS_PER_ROUND = 3;
  static AVAILABLE_ACTOR_PRESETS = {
    light: { health: 2, stamina: 4 },
    medium: { health: 3, stamina: 3 },
    heavy: { health: 4, stamina: 2 },
  } as const;

  private actor: IActor = new Actor(0, 0);
  private opponent: IActor = new Actor(0, 0);
  private counter = new RoundActionCounter(
    GameController.MAX_ROUNDS,
    GameController.ACTIONS_PER_ROUND,
  );
  private aiFactory = new AIFactory();
  private ai: AI = this.aiFactory.getAIByType();
  private isAIChosen = false;
  private gameMode = GameMode.PvE;
  private actors: [ActorId, ActorId] = [ActorId.FIRST, ActorId.AI];
  private playerPresetSet = false;
  private opponentPresetSet = false;
  private phase: GamePhase = GamePhase.CHARACTER_SELECT;
  private actionsResolved = false;

  constructor(private events: IGameEvents) {}

  get info(): IGameInfo {
    return {
      phase: this.phase,
      round: this.counter.round,
      action: this.counter.action,
      player: this.actor.info,
      opponent: this.opponent.info,
      winnerId: this.isGameEnd ? this.gameWinnerId : undefined,
    };
  }

  private get isGameEnd(): boolean {
    return this.counter.isCounterEnd || this.isGameEndByHealth;
  }

  private get isGameEndByHealth(): boolean {
    return this.opponent.health <= 0 || this.actor.health <= 0;
  }

  private get gameWinnerId(): ActorId | null {
    if (this.actor.health > this.opponent.health) return this.actor.id;
    if (this.actor.health === this.opponent.health) return null;
    return this.opponent.id;
  }

  get availableActorPresetsAndDetails(): IPresetAndDetails<
    keyof typeof GameController.AVAILABLE_ACTOR_PRESETS
  >[] {
    const presetNames = Object.keys(GameController.AVAILABLE_ACTOR_PRESETS) as (keyof typeof GameController.AVAILABLE_ACTOR_PRESETS)[];
    return presetNames.map((name) => ({
      value: name,
      details: GameController.AVAILABLE_ACTOR_PRESETS[name],
    }));
  }

  get aiTypes(): string[] {
    return this.aiFactory.allowedAITypes;
  }

  start(gameMode: GameMode, aiType?: string): void {
    this.gameMode = gameMode;

    if (aiType) {
      this.ai = this.aiFactory.getAIByType(aiType as any);
      this.isAIChosen = true;
    }

    if (gameMode === GameMode.PvP) {
      this.actors = [ActorId.FIRST, ActorId.SECOND];
    }

    this.phase = GamePhase.CHARACTER_SELECT;
    this.emitState();
  }

  selectPreset(id: ActorId, preset: keyof typeof GameController.AVAILABLE_ACTOR_PRESETS): void {
    const { health, stamina } = GameController.AVAILABLE_ACTOR_PRESETS[preset];

    if (id === ActorId.FIRST) {
      this.actor = new Actor(health, stamina, id);
      this.playerPresetSet = true;
    } else {
      this.opponent = new Actor(health, stamina, id);
      this.opponentPresetSet = true;
    }

    if (this.gameMode === GameMode.PvE && !this.opponentPresetSet) {
      this.opponent = this.ai.getActor();
      this.opponentPresetSet = true;
      this.ai.setOpponent(this.actor);
    }

    if (this.playerPresetSet && this.opponentPresetSet) {
      this.counter.reset();
      this.counter.next();
      this.phase = GamePhase.WAITING_FOR_ACTION;
      this.actionsResolved = false;
    }

    this.emitState();
  }

  selectAction(id: ActorId, action: ActorStatus): void {
    if (id === ActorId.FIRST) {
      this.actor.setAction(action);
    } else {
      this.opponent.setAction(action);
    }

    if (this.gameMode === GameMode.PvE) {
      const aiAction = this.ai.getAction();
      this.opponent.setAction(aiAction);
    }

    if (this.gameMode === GameMode.PvP) {
      if (this.actor.selectedAction === ActorStatus.IDLE || this.opponent.selectedAction === ActorStatus.IDLE) {
        this.emitState();
        return;
      }
    }

    this.resolveActions();
  }

  private resolveActions(): void {
    new ActionCalculator().execute(this.actor, this.opponent);

    this.phase = GamePhase.ACTION_RESULT;
    this.actionsResolved = true;
    this.emitState();
  }

  proceedAfterResult(): void {
    if (this.isGameEndByHealth) {
      this.phase = GamePhase.MATCH_END;
      this.emitState();
      return;
    }

    if (this.counter.isRoundBreak) {
      new RoundBreakCalculator().execute(this.actor, this.opponent);
      this.phase = GamePhase.ROUND_RESULT;
      this.emitState();

      if (this.counter.isCounterEnd) {
        this.phase = GamePhase.MATCH_END;
        this.emitState();
        return;
      }

      this.actor.setAction(ActorStatus.IDLE);
      this.opponent.setAction(ActorStatus.IDLE);
      this.counter.next();
      this.phase = GamePhase.WAITING_FOR_ACTION;
      this.actionsResolved = false;
      this.emitState();
      return;
    }

    this.actor.setAction(ActorStatus.IDLE);
    this.opponent.setAction(ActorStatus.IDLE);
    this.counter.next();
    this.phase = GamePhase.WAITING_FOR_ACTION;
    this.actionsResolved = false;
    this.emitState();
  }

  reset(): void {
    this.counter.reset();
    this.actor = new Actor(0, 0);
    this.opponent = new Actor(0, 0);
    this.actors = [ActorId.FIRST, ActorId.AI];
    this.gameMode = GameMode.PvE;
    this.playerPresetSet = false;
    this.opponentPresetSet = false;
    this.isAIChosen = false;
    this.phase = GamePhase.CHARACTER_SELECT;
    this.actionsResolved = false;
    this.emitState();
  }

  private emitState(): void {
    this.events.onStateChange(this.info);
  }
}
