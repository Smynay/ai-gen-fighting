import { arrangeActorAndConsts } from "../../actor/__tests__/Actor.test";
import { RestAction } from "../Rest";
const spyOn = jest.spyOn;

function arrangeRestActionAndConsts({
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
    testAction: RestAction.ACTION_TYPE,
    testCostNoMatter: 0,
    testActorFirst,
    testActorSecond,
    action: new RestAction(testActorFirst, testActorSecond),
  };
}

describe("Rest action", () => {
  describe("constructor", () => {
    test("Should not to throw when correct args passed", () => {
      const { testActorFirst, testActorSecond } = arrangeRestActionAndConsts(
        {},
      );

      expect(
        () => new RestAction(testActorFirst, testActorSecond),
      ).not.toThrow();
    });
  });

  describe("prepare", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeRestActionAndConsts({});

      expect(() => action.prepare()).not.toThrow();
    });

    test("Should call actor prepare action method with action params when called", () => {
      const { testActorFirst, action } = arrangeRestActionAndConsts({});
      const spy = spyOn(testActorFirst, "prepareAction");

      action.prepare();

      expect(spy).toBeCalledWith(
        RestAction.HEALTH_COST,
        RestAction.STAMINA_COST,
        RestAction.ACTION_TYPE,
      );
    });
  });

  describe("execute", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeRestActionAndConsts({});

      expect(() => action.execute()).not.toThrow();
    });

    test.each(RestAction.ENEMY_ACTIONS_FOR_SUCCESS)(
      "Should call actor produce points with action params when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeRestActionAndConsts({});
        const spy = spyOn(testActorFirst, "producePoints");

        testActorSecond.prepareAction(
          testCostNoMatter,
          testCostNoMatter,
          actionType,
        );
        action.execute();

        expect(spy).toBeCalledWith(
          RestAction.HEALTH_TO_REGENERATE,
          RestAction.STAMINA_TO_REGENERATE,
        );
      },
    );

    test.each(RestAction.ENEMY_ACTIONS_FOR_FAIL)(
      "Should call actor reduce points with action params when opponent executed action is %s",
      (actionType) => {
        const { action, testCostNoMatter, testActorFirst, testActorSecond } =
          arrangeRestActionAndConsts({});
        const spy = spyOn(testActorFirst, "reducePoints");

        testActorSecond.prepareAction(
          testCostNoMatter,
          testCostNoMatter,
          actionType,
        );
        action.execute();

        expect(spy).toBeCalledWith(
          RestAction.DAMAGE_TROUGH_HEALTH,
          RestAction.DAMAGE_TROUGH_STAMINA,
        );
      },
    );
  });
});
