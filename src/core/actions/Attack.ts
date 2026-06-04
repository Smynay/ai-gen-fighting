import { Actor, ActorStatus, IActor } from "../actor";
import type { IAction } from "./interfaces";

export class AttackAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {}

  static ACTION_TYPE = ActorStatus.ATTACK;
  static HEALTH_DAMAGE = 2;
  static STAMINA_DAMAGE = 0;
  static HEALTH_COST = 0;
  static STAMINA_COST = 2;
  static ENEMY_ACTIONS_FOR_SUCCESS = [
    ActorStatus.BLOCK,
    ActorStatus.REST,
    ActorStatus.IDLE,
    ActorStatus.DODGE,
  ];
  static get ENEMY_ACTIONS_FOR_FAIL(): ActorStatus[] {
    return Actor.POSSIBLE_ACTIONS.filter(
      (action) => !AttackAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(action),
    );
  }

  get info() {
    return {
      description: "Deal damage to opponent",
      healthDamage: AttackAction.HEALTH_DAMAGE,
      staminaCost: AttackAction.STAMINA_COST,
    };
  }

  private checkSuccess(): boolean {
    return AttackAction.ENEMY_ACTIONS_FOR_SUCCESS.includes(
      this.opponent.executedAction,
    );
  }

  prepare() {
    this.actor.prepareAction(
      0,
      AttackAction.STAMINA_COST,
      AttackAction.ACTION_TYPE,
    );
  }

  private fail() {
    this.actor.reducePoints(
      AttackAction.HEALTH_DAMAGE,
      AttackAction.STAMINA_DAMAGE,
    );
  }

  execute() {
    if (!this.checkSuccess()) {
      this.fail();
    }
  }
}
