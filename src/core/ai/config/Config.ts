import { ActorStatus, IActor } from "../../actor";
import type { AIConfig, ConfigActions } from "./types";
import { getRandomInt } from "../../utils";

export class AILogic {
  private readonly config: AIConfig;
  private activeMode: string | undefined = undefined;

  constructor(config: AIConfig) {
    this.config = config;
  }

  getAction(actor: IActor, opponent?: IActor): ActorStatus {
    const preparedConfigActions = this.prepareConfigActions(actor, opponent);
    const preparedActions = this.prepareActions(
      actor,
      preparedConfigActions,
      opponent,
    );

    return this.getActionByChance(preparedActions);
  }
  private prepareConfigActions(
    actor: IActor,
    opponent?: IActor,
  ): ConfigActions {
    const aiMode = Object.keys(this.config.modes).find((key) => {
      const mode = this.config.modes[key];

      if (!mode) {
        return false;
      }

      return mode.test ? mode.test(actor, opponent) : true;
    });

    this.activeMode = aiMode;

    if (!aiMode) {
      throw new Error(
        `Check test functions in your configuration of ${this.config.name} file`,
      );
    }

    return this.config.modes[aiMode].actions;
  }

  private prepareActions = (
    actor: IActor,
    configActions: ConfigActions,
    opponent?: IActor,
  ): ConfigActions => {
    return configActions.filter((action) =>
      action.test ? action.test(actor, opponent) : true,
    );
  };

  private getActionByChance(actions: ConfigActions): ActorStatus {
    let booked = 0;

    const actionsWithChancesPeriods = actions.map((value) => {
      const start = booked;
      const end = booked + value.chance;
      booked = end;

      return {
        ...value,
        start: start,
        end: end,
      };
    });

    const random = getRandomInt(booked - 1);

    const result = actionsWithChancesPeriods.find(
      (action) => action.start <= random && random <= action.end,
    );

    if (!result) {
      throw new Error(
        `Check actions chances in your ${this.activeMode} mode configuration of ${this.config.name} file`,
      );
    }

    return result.action as ActorStatus;
  }
}
