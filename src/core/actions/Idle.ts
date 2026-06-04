import type { IAction } from "./interfaces";
import { Actor, ActorStatus, IActor } from "../actor";

export class IdleAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {}

  static ACTION_TYPE = ActorStatus.IDLE;
  static DAMAGE_TROUGH_HEALTH = 2;
  static DAMAGE_TROUGH_STAMINA = 0;
  static HEALTH_COST = 0;
  static STAMINA_COST = 0;
  static ENEMY_ACTIONS_FOR_SUCCESS = [
    ActorStatus.BLOCK,
    ActorStatus.REST,
    ActorStatus.IDLE,
    ActorStatus.DODGE,
  ];

  static get ENEMY_ACTIONS_FOR_FAIL(): ActorStatus[] {
    return Actor.POSSIBLE_ACTIONS.filter(
      (action) => !IdleAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(action),
    );
  }

  get info() {
    return {
      description: "Service action means DO NOTHING",
      staminaCost: 0,
    };
  }

  private checkSuccess(): boolean {
    return IdleAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(
      this.opponent.executedAction,
    );
  }

  prepare() {
    this.actor.prepareAction(
      IdleAction.HEALTH_COST,
      IdleAction.STAMINA_COST,
      IdleAction.ACTION_TYPE,
    );
  }

  private fail() {
    this.actor.reducePoints(
      IdleAction.DAMAGE_TROUGH_HEALTH,
      IdleAction.DAMAGE_TROUGH_STAMINA,
    );
  }

  execute() {
    if (!this.checkSuccess()) {
      this.fail();
    }
  }
}
