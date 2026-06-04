import { Actor, ActorStatus, IActor } from "../actor";
import type { IAction } from "./interfaces";

export class RestAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {}

  static ACTION_TYPE = ActorStatus.REST;
  static HEALTH_COST = 0;
  static STAMINA_COST = 0;
  static DAMAGE_TROUGH_HEALTH = 2;
  static DAMAGE_TROUGH_STAMINA = 0;
  static HEALTH_TO_REGENERATE = 0;
  static STAMINA_TO_REGENERATE = 2;
  static ENEMY_ACTIONS_FOR_SUCCESS = [
    ActorStatus.BLOCK,
    ActorStatus.REST,
    ActorStatus.IDLE,
    ActorStatus.DODGE,
  ];
  static get ENEMY_ACTIONS_FOR_FAIL(): ActorStatus[] {
    return Actor.POSSIBLE_ACTIONS.filter(
      (action) => !RestAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(action),
    );
  }

  get info() {
    return {
      description: "Regenerate your health if no damage",
      staminaCost: RestAction.STAMINA_COST,
      staminaRegenerate: RestAction.STAMINA_TO_REGENERATE,
      healthDamageThrow: RestAction.DAMAGE_TROUGH_HEALTH,
    };
  }

  private checkSuccess(): boolean {
    return RestAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(
      this.opponent.executedAction,
    );
  }

  prepare() {
    this.actor.prepareAction(
      RestAction.HEALTH_COST,
      RestAction.STAMINA_COST,
      RestAction.ACTION_TYPE,
    );
  }

  private success() {
    this.actor.producePoints(
      RestAction.HEALTH_TO_REGENERATE,
      RestAction.STAMINA_TO_REGENERATE,
    );
  }

  private fail() {
    this.actor.reducePoints(
      RestAction.DAMAGE_TROUGH_HEALTH,
      RestAction.DAMAGE_TROUGH_STAMINA,
    );
  }

  execute() {
    if (this.checkSuccess()) {
      this.success();
      return;
    }

    this.fail();
  }
}
