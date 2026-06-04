import { Actor, ActorStatus, IActor } from "../actor";
import type { IAction } from "./interfaces";

export class BlockAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {}

  static ACTION_TYPE = ActorStatus.BLOCK;
  static DAMAGE_TROUGH_HEALTH = 1;
  static DAMAGE_TROUGH_STAMINA = 0;
  static HEALTH_COST = 0;
  static STAMINA_COST = 1;
  static ENEMY_ACTIONS_FOR_SUCCESS = [ActorStatus.ATTACK];

  static get ENEMY_ACTIONS_FOR_FAIL(): ActorStatus[] {
    return Actor.POSSIBLE_ACTIONS.filter(
      (action) => !BlockAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(action),
    );
  }

  get info() {
    return {
      description: "Blocks incoming damage",
      healthDamageThrow: BlockAction.DAMAGE_TROUGH_HEALTH,
      staminaCost: BlockAction.STAMINA_COST,
    };
  }

  private checkSuccess(): boolean {
    return BlockAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(
      this.opponent.executedAction,
    );
  }

  prepare() {
    this.actor.prepareAction(
      BlockAction.HEALTH_COST,
      BlockAction.STAMINA_COST,
      BlockAction.ACTION_TYPE,
    );
  }

  private success() {
    this.actor.reducePoints(
      BlockAction.DAMAGE_TROUGH_HEALTH,
      BlockAction.DAMAGE_TROUGH_STAMINA,
    );
  }

  execute() {
    if (this.checkSuccess()) {
      this.success();
    }
  }
}
