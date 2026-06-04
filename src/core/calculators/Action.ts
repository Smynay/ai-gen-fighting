import type { IActor } from "../actor";
import { ActionFactory, IAction } from "../actions";

export class ActionCalculator {
  execute(first: IActor, second: IActor): void {
    const actionsForPrepare = [
      this.getSelectedActionForActor(first, second),
      this.getSelectedActionForActor(second, first),
    ];

    this.prepareFight(actionsForPrepare);

    const actionsForExecute = [
      this.getActionToExecuteForActor(first, second),
      this.getActionToExecuteForActor(second, first),
    ];

    this.executeFight(actionsForExecute);
  }

  private getSelectedActionForActor(actor: IActor, opponent: IActor): IAction {
    return new ActionFactory(actor, opponent).getActionBySelected();
  }

  private getActionToExecuteForActor(
    actor: IActor,
    opponent: IActor,
  ): IAction {
    return new ActionFactory(actor, opponent).getActionByExecuted();
  }
  private prepareFight(actions: IAction[]): void {
    actions.forEach((action) => action.prepare());
  }

  private executeFight(actions: IAction[]): void {
    actions.forEach((action) => action.execute());
  }
}
