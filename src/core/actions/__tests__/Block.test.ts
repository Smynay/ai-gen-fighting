import { arrangeActorAndConsts } from "../../actor/__tests__/Actor.test";
import { BlockAction } from "../Block";
const spyOn = jest.spyOn;

function arrangeBlockActionAndConsts({
  health,
  stamina,
}: {
  health?: number;
  stamina?: number;
}) {
  const { actor: testActorFirst } = arrangeActorAndConsts({
    health,
    stamina,
  });
  const { actor: testActorSecond } = arrangeActorAndConsts({
    health,
    stamina,
  });

  return {
    testHP: testActorFirst.health,
    testSP: testActorFirst.stamina,
    testAction: BlockAction.ACTION_TYPE,
    testStaminaCost: BlockAction.STAMINA_COST,
    testCostNoMatter: 0,
    testActorFirst,
    testActorSecond,
    action: new BlockAction(testActorFirst, testActorSecond),
  };
}

describe("Block action", () => {
  describe("constructor", () => {
    test("Should not to throw when correct args passed", () => {
      const { testActorFirst, testActorSecond } = arrangeBlockActionAndConsts(
        {},
      );

      expect(
        () => new BlockAction(testActorFirst, testActorSecond),
      ).not.toThrow();
    });
  });

  describe("prepare", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeBlockActionAndConsts({});

      expect(() => action.prepare()).not.toThrow();
    });

    test("Should call actor prepare action method with action params when called", () => {
      const { testActorFirst, action } = arrangeBlockActionAndConsts({});
      const spy = spyOn(testActorFirst, "prepareAction");

      action.prepare();

      expect(spy).toBeCalledWith(
        BlockAction.HEALTH_COST,
        BlockAction.STAMINA_COST,
        BlockAction.ACTION_TYPE,
      );
    });
  });

  describe("execute", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeBlockActionAndConsts({});

      expect(() => action.execute()).not.toThrow();
    });

    test.each(BlockAction.ENEMY_ACTIONS_FOR_FAIL)(
      "Should not call actor reduce points when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeBlockActionAndConsts({});
        const spy = spyOn(testActorFirst, "reducePoints");

        testActorSecond.prepareAction(
          testCostNoMatter,
          testCostNoMatter,
          actionType,
        );
        action.execute();

        expect(spy).not.toHaveBeenCalled();
      },
    );

    test.each(BlockAction.ENEMY_ACTIONS_FOR_SUCCESS)(
      "Should call actor reduce points with action params when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeBlockActionAndConsts({ health: 3 });
        const spy = spyOn(testActorFirst, "reducePoints");

        testActorSecond.prepareAction(
          testCostNoMatter,
          testCostNoMatter,
          actionType,
        );
        action.execute();

        expect(spy).toBeCalledWith(
          BlockAction.DAMAGE_TROUGH_HEALTH,
          BlockAction.DAMAGE_TROUGH_STAMINA,
        );
      },
    );
  });
});
