export class RoundActionCounter {
  constructor(
    private maxRound: number,
    private actionsPerRound: number,
  ) {}

  private _round: number = 0;

  private _action: number = 0;

  get round(): number {
    return this._round;
  }

  get action(): number {
    return this._action;
  }

  get isCounterEnd(): boolean {
    return this._action === this.actionsPerRound * this.maxRound;
  }

  get isRoundBreak(): boolean {
    return !Boolean(this._action % this.actionsPerRound);
  }

  private get maxAction(): number {
    return this.actionsPerRound * this.maxRound;
  }

  next(): void {
    this.changeActionIfPossible();
    this.changeRoundIfNeed();
  }

  private changeActionIfPossible(): void {
    const isPossibleAction = this._action < this.maxAction;

    if (isPossibleAction) {
      this._action += 1;
    }
  }

  private changeRoundIfNeed(): void {
    const isFirstInRoundAction = this._action % this.actionsPerRound === 1;

    if (isFirstInRoundAction) {
      this._round += 1;
    }
  }

  reset(): void {
    this._action = 0;
    this._round = 0;
  }
}
