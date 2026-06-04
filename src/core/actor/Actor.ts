import { ActorId, ActorStatus, IActor } from "./interfaces";

export class Actor implements IActor {
  get id(): ActorId {
    return this._id;
  }
  get health(): number {
    return this._health;
  }

  get stamina(): number {
    return this._stamina;
  }

  get selectedAction(): ActorStatus {
    return this._selectedAction;
  }

  get executedAction(): ActorStatus {
    return this._executedAction;
  }
  get info() {
    return {
      id: this.id,
      health: this.health,
      stamina: this.stamina,
      executedAction: this.executedAction,
      selectedAction: this.selectedAction,
    };
  }

  private _id: ActorId;
  private _health: number;
  private _stamina: number;
  private _selectedAction: ActorStatus = ActorStatus.IDLE;
  private _executedAction: ActorStatus = ActorStatus.IDLE;
  static POSSIBLE_ACTIONS = [
    ActorStatus.ATTACK,
    ActorStatus.REST,
    ActorStatus.BLOCK,
    ActorStatus.DODGE,
    ActorStatus.IDLE,
  ];

  static FORBIDDEN_ACTIONS = [ActorStatus.IDLE];

  static get ALLOWED_ACTIONS(): ActorStatus[] {
    return Actor.POSSIBLE_ACTIONS.filter(
      (action) => !Actor.FORBIDDEN_ACTIONS.includes(action),
    );
  }

  setAction(action: ActorStatus = ActorStatus.IDLE): void {
    this._selectedAction = action;
  }

  constructor(health: number, stamina: number, id: ActorId = ActorId.AI) {
    if (isNaN(health) || isNaN(stamina)) {
      throw new Error("Only valid number allowed");
    }

    if (health < 0 || stamina < 0) {
      throw new Error("Only positive values allowed");
    }

    this._id = id;
    this._health = health;
    this._stamina = stamina;
  }

  private checkPossibilityToPrepareAction(
    health: number,
    stamina: number,
  ): boolean {
    return !this.checkPointsGreaterThanCurrent(health, stamina);
  }

  private payForAction(
    health: number,
    stamina: number,
    action: ActorStatus,
  ): void {
    this.changePoints(health, stamina, "pay");
    this._executedAction = action;
  }

  private changePoints(
    health: number,
    stamina: number,
    type: "reduce" | "produce" | "pay",
  ): void {
    if (isNaN(health) || isNaN(stamina)) {
      throw new Error("Only valid number allowed");
    }

    if (health < 0 || stamina < 0) {
      throw new Error("Only positive values allowed");
    }

    if (type === "pay" && this.checkPointsGreaterThanCurrent(health, stamina)) {
      throw new Error("Passed action cost cant be payed");
    }

    if (type === "reduce" || type === "pay") {
      this._health -= health;
      this._stamina -= stamina;
    }

    if (type === "produce") {
      this._health += health;
      this._stamina += stamina;
    }
  }

  private checkPointsGreaterThanCurrent(
    health: number,
    stamina: number,
  ): boolean {
    return health > this.health || stamina > this.stamina;
  }

  prepareAction(health: number, stamina: number, action: ActorStatus): void {
    if (this.checkPossibilityToPrepareAction(health, stamina)) {
      this.payForAction(health, stamina, action);
      return;
    }

    this.setFallbackAction();
  }

  private setFallbackAction(): void {
    this._executedAction = ActorStatus.IDLE;
  }

  producePoints(health: number, stamina: number): void {
    this.changePoints(health, stamina, "produce");
  }

  reducePoints(health: number, stamina: number): void {
    this.changePoints(health, stamina, "reduce");
  }
}
