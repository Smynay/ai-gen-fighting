import { Actor, ActorStatus, IActor } from "../actor";
import { AILogic } from "./config/Config";
import { getRandomInt } from "../utils";
import type { AIConfig } from "./config/types";

export class AI {
  private actor: IActor = new Actor(0, 0);
  private opponent?: IActor;
  private readonly logic: AILogic;

  constructor(config: AIConfig) {
    this.logic = new AILogic(config);
  }

  getAction(): ActorStatus {
    return this.logic.getAction(this.actor, this.opponent);
  }

  getActor(): IActor {
    this.actor = new Actor(getRandomInt(5, 1), getRandomInt(5, 1));

    return this.actor;
  }

  setOpponent(actor: IActor) {
    this.opponent = actor;
  }
}
