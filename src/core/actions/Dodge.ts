import type { IAction } from "./interfaces";
import { ActorStatus, IActor } from "../actor";

export class DodgeAction implements IAction {
  constructor(
    protected actor: IActor,
    protected opponent: IActor,
  ) {}

  static ACTION_TYPE = ActorStatus.DODGE;
  static HEALTH_COST = 0;
  static STAMINA_COST = 2;

  get info() {
    return {
      description: "Dodge incoming damage",
      staminaCost: DodgeAction.STAMINA_COST,
    };
  }

  prepare() {
    this.actor.prepareAction(
      DodgeAction.HEALTH_COST,
      DodgeAction.STAMINA_COST,
      DodgeAction.ACTION_TYPE,
    );
  }

  execute() {}
}
