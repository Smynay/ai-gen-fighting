import type { IActor } from "../actor";

export class RoundBreakCalculator {
  static HEALTH_TO_REGENERATE = 2;
  static STAMINA_TO_REGENERATE = 2;

  execute(actor: IActor, opponent: IActor): void {
    this.makeBreakEffects(actor);
    this.makeBreakEffects(opponent);
  }

  private makeBreakEffects(actor: IActor) {
    actor.producePoints(
      RoundBreakCalculator.HEALTH_TO_REGENERATE,
      RoundBreakCalculator.STAMINA_TO_REGENERATE,
    );
  }
}
