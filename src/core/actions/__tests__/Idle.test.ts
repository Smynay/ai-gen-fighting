import { arrangeActorAndConsts } from "../../actor/__tests__/Actor.test";
import { IdleAction } from "../Idle";
const spyOn = jest.spyOn;

function arrangeIdleActionAndConsts({
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
    testAction: IdleAction.ACTION_TYPE,
    testStaminaCost: IdleAction.STAMINA_COST,
    testCostNoMatter: 0,
    testActorFirst,
    testActorSecond,
    action: new IdleAction(testActorFirst, testActorSecond),
  };
}

describe("Idle action", () => {
  describe("constructor", () => {
    test("Should not to throw when correct args passed", () => {
      const { testActorFirst, testActorSecond } = arrangeIdleActionAndConsts(
        {},
      );

      expect(
        () => new IdleAction(testActorFirst, testActorSecond),
      ).not.toThrow();
    });
  });

  describe("prepare", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeIdleActionAndConsts({});

      expect(() => action.prepare()).not.toThrow();
    });

    test("Should call actor prepare action method with action params when called", () => {
      const { testActorFirst, action } = arrangeIdleActionAndConsts({});
      const spy = spyOn(testActorFirst, "prepareAction");

      action.prepare();

      expect(spy).toBeCalledWith(
        IdleAction.HEALTH_COST,
        IdleAction.STAMINA_COST,
        IdleAction.ACTION_TYPE,
      );
    });
  });

  describe("execute", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeIdleActionAndConsts({});

      expect(() => action.execute()).not.toThrow();
    });

    test.each(IdleAction.ENEMY_ACTIONS_FOR_SUCCESS)(
      "Should not call actor reduce points when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeIdleActionAndConsts({});
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

    test.each(IdleAction.ENEMY_ACTIONS_FOR_FAIL)(
      "Should call actor reduce points with action params when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeIdleActionAndConsts({ health: 3 });
        const spy = spyOn(testActorFirst, "reducePoints");

        testActorSecond.prepareAction(
          testCostNoMatter,
          testCostNoMatter,
          actionType,
        );
        action.execute();

        expect(spy).toBeCalledWith(
          IdleAction.DAMAGE_TROUGH_HEALTH,
          IdleAction.DAMAGE_TROUGH_STAMINA,
        );
      },
    );
  });
});
