import { GameController, GameMode, IGameInfo } from "../core/GameController";
import { ConsoleUI } from "../ui/console/console";

async function main() {
  const ui = new ConsoleUI();
  const controller = new GameController({
    onStateChange: (info: IGameInfo) => {
      switch (info.phase) {
        case "characterSelect":
          ui.init();
          break;
        case "waitingForAction":
          ui.showStats(info);
          break;
        case "actionResult":
          ui.showActionResults(info);
          break;
        case "roundResult":
          ui.showRoundResults(info);
          break;
        case "matchEnd":
          ui.showMatchResults(info);
          break;
      }
    },
  });

  await runGame(controller, ui);
}

async function runGame(
  controller: GameController,
  ui: ConsoleUI,
): Promise<void> {
  const aiType = await ui.chooseAi(controller.aiTypes as any);
  controller.start(GameMode.PvE, aiType);

  const preset = await ui.createActor(
    controller.availableActorPresetsAndDetails as any,
    "0",
  );
  controller.selectPreset("0" as any, preset as any);

  let running = true;
  while (running) {
    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (controller.info.phase === "waitingForAction" || controller.info.phase === "matchEnd") {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

    if (controller.info.phase === "matchEnd") break;

    const action = await ui.choseAction(
      ["attack", "block", "dodge", "rest"] as any,
      "0",
    );
    controller.selectAction("0" as any, action as any);

    // proceedAfterResult is called here, not in onStateChange,
    // to avoid recursive emit -> onStateChange -> proceedAfterResult loops
    controller.proceedAfterResult();
  }

  if (await ui.confirmRetry()) {
    controller.reset();
    await runGame(controller, ui);
  }
}

main();
