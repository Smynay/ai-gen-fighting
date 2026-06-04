import type { IActor } from "../actor";

export interface IAction {
  prepare(): void;
  execute(): void;

  info: ActionInfo;
}

export interface IActionConstructor {
  new (actor: IActor, target: IActor): IAction;
}

export interface IActionFactory {
  getActionBySelected(): IAction;
  getActionByExecuted(): IAction;
}

export interface ActionInfo {
  description: string;
  healthDamage?: number;
  staminaDamage?: number;
  healthDamageThrough?: number;
  staminaCost: number;
  staminaRegenerate?: number;
}
