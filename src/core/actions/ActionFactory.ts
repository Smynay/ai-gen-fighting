import { ActorStatus, IActor } from "../actor";
import { AttackAction } from "./Attack";
import { BlockAction } from "./Block";
import { RestAction } from "./Rest";
import type { IAction, IActionConstructor, IActionFactory } from "./interfaces";
import { IdleAction } from "./Idle";
import { DodgeAction } from "./Dodge";

export class ActionFactory implements IActionFactory {
  static actionsByStatus: Record<`${ActorStatus}`, IActionConstructor> = {
    [ActorStatus.ATTACK]: AttackAction,
    [ActorStatus.BLOCK]: BlockAction,
    [ActorStatus.REST]: RestAction,
    [ActorStatus.IDLE]: IdleAction,
    [ActorStatus.DODGE]: DodgeAction,
  };

  constructor(
    private actor: IActor,
    private opponent: IActor,
  ) {}

  getActionBySelected(): IAction {
    return new ActionFactory.actionsByStatus[this.actor.selectedAction](
      this.actor,
      this.opponent,
    );
  }

  getActionByExecuted(): IAction {
    return new ActionFactory.actionsByStatus[this.actor.executedAction](
      this.actor,
      this.opponent,
    );
  }
}
