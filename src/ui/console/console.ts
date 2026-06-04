import type { IUIOption, IUserInterface } from "../interfaces";
import { IO } from "./IO";
import type { IGameInfo, IPresetAndDetails } from "../../core/GameController";

export class ConsoleUI implements IUserInterface {
  async choseAction<T extends string>(options: T[], _id: string): Promise<T> {
    return await IO.select<T>(
      "Chose your action:",
      this.prepareStringOptions(options),
    );
  }

  async createActor<T extends string>(
    options: IPresetAndDetails<T>[],
    id: string,
  ): Promise<T> {
    const prepared = options.reduce(
      (arr, { value, details }) => [
        ...arr,
        {
          name: value,
          message: value.toUpperCase(),
          hint: `(HP:${details.health} SP:${details.stamina})`,
        },
      ],
      [] as IUIOption<T>[],
    );

    return await IO.select<T>("Chose your type:", prepared);
  }

  async chooseGameMode(availableModes: string[]): Promise<string | undefined> {
    return;
  }

  async chooseAi<T extends string>(availableAis: T[]): Promise<T | undefined> {
    return await IO.select<T>(
      "Chose ai difficulty:",
      this.prepareStringOptions(availableAis),
    );
  }

  init(): void {
    IO.writeDivider();
    IO.write("Taste of IRON");
    IO.writeEmpty();
    IO.write("Its a game about");
    IO.write("crushing faces!");
    IO.writeDivider();
  }

  private showResult(title: string, info: IGameInfo, statsOnly = false): void {
    IO.writeDivider();
    IO.write(title);
    IO.writeDivider(true);
    IO.write(
      [
        "YOU",
        `HP: ${info.player.health} SP: ${info.player.stamina} ${
          statsOnly ? "" : info.player.executedAction.toUpperCase()
        }`,
      ],
      false,
    );
    IO.writeDivider(true);
    IO.write(
      [
        "EMY",
        `HP: ${info.opponent.health} SP: ${info.opponent.stamina} ${
          statsOnly ? "" : info.opponent.executedAction.toUpperCase()
        }`,
      ],
      false,
    );
    IO.writeDivider();
  }

  showStats(info: IGameInfo): void {
    this.showResult("FIGHTERS STATS", info, true);
  }

  showActionResults(info: IGameInfo): void {
    this.showResult("ACTION RESULTS", info);
  }

  showMatchResults(info: IGameInfo): void {
    this.printGameStatus(info.winnerId);
    this.showResult("MATCH RESULTS", info);
  }

  showRoundResults(info: IGameInfo): void {
    this.showBox("BREAK");
    this.showResult("ROUND RESULTS", info, true);
  }

  private showBox(title: string): void {
    IO.writeDivider();
    IO.write(title);
    IO.writeDivider();
  }

  private printGameStatus(winnerId?: string | null): void {
    if (winnerId === "0") {
      this.showBox("CONGRATULATIONS !!!");
      return;
    }

    if (winnerId === "1" || winnerId === "2") {
      this.showBox("GAME OVER");
      return;
    }

    this.showBox("DRAW");
  }

  private prepareStringOptions<T extends string>(
    options: T[],
  ): IUIOption<T>[] {
    return options.reduce(
      (arr, value) => [
        ...arr,
        {
          name: value,
          message: value.toUpperCase(),
        },
      ],
      [] as IUIOption<T>[],
    );
  }

  async confirmRetry(): Promise<boolean> {
    return IO.confirm("Ready for retry?");
  }

  destroy() {}
}
