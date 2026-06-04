import { arrangeActorAndConsts } from "../../actor/__tests__/Actor.test";
import { AttackAction } from "../Attack";
const spyOn = jest.spyOn;

function arrangeAttackActionAndConsts({
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
    testAction: AttackAction.ACTION_TYPE,
    testStaminaCost: AttackAction.STAMINA_COST,
    testCostNoMatter: 0,
    testActorFirst,
    testActorSecond,
    action: new AttackAction(testActorFirst, testActorSecond),
  };
}

describe("Attack action", () => {
  describe("constructor", () => {
    test("Should not to throw when correct args passed", () => {
      const { testActorFirst, testActorSecond } = arrangeAttackActionAndConsts(
        {},
      );

      expect(
        () => new AttackAction(testActorFirst, testActorSecond),
      ).not.toThrow();
    });
  });

  describe("prepare", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeAttackActionAndConsts({});

      expect(() => action.prepare()).not.toThrow();
    });

    test("Should call actor prepare action method with action params when called", () => {
      const { testActorFirst, action } = arrangeAttackActionAndConsts({});
      const spy = spyOn(testActorFirst, "prepareAction");

      action.prepare();

      expect(spy).toBeCalledWith(
        AttackAction.HEALTH_COST,
        AttackAction.STAMINA_COST,
        AttackAction.ACTION_TYPE,
      );
    });
  });

  describe("execute", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeAttackActionAndConsts({});

      expect(() => action.execute()).not.toThrow();
    });

    test.each(AttackAction.ENEMY_ACTIONS_FOR_SUCCESS)(
      "Should not call actor reduce points when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeAttackActionAndConsts({});
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

    test.each(AttackAction.ENEMY_ACTIONS_FOR_FAIL || [])(
      "Should call actor reduce points with action params when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeAttackActionAndConsts({});
        const spy = spyOn(testActorFirst, "reducePoints");

        testActorSecond.prepareAction(
          testCostNoMatter,
          testCostNoMatter,
          actionType,
        );
        action.execute();

        expect(spy).toBeCalledWith(
          AttackAction.HEALTH_DAMAGE,
          AttackAction.STAMINA_DAMAGE,
        );
      },
    );
  });
});
