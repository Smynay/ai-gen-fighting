import { arrangeActorAndConsts } from "../../actor/__tests__/Actor.test";
import { DodgeAction } from "../Dodge";
const spyOn = jest.spyOn;

function arrangeDodgeActionAndConsts({
  health,
  stamina,
}: {
  health?: number;
  stamina?: number;
}) {
  const { actor: testActorFirst } = arrangeActorAndConsts({ health, stamina });
  const { actor: testActorSecond } = arrangeActorAndConsts({ health, stamina });

  return {
    testHP: testActorFirst.health,
    testSP: testActorFirst.stamina,
    testAction: DodgeAction.ACTION_TYPE,
    testStaminaCost: DodgeAction.STAMINA_COST,
    testActorFirst,
    testActorSecond,
    action: new DodgeAction(testActorFirst, testActorSecond),
  };
}
describe("Dodge action", () => {
  describe("constructor", () => {
    test("Should not to throw when correct args passed", () => {
      const { testActorFirst, testActorSecond } = arrangeDodgeActionAndConsts(
        {},
      );

      expect(
        () => new DodgeAction(testActorFirst, testActorSecond),
      ).not.toThrow();
    });
  });

  describe("prepare", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeDodgeActionAndConsts({});

      expect(() => action.prepare()).not.toThrow();
    });

    test("Should call actor prepare action method with action params when called", () => {
      const { testActorFirst, action } = arrangeDodgeActionAndConsts({});
      const spy = spyOn(testActorFirst, "prepareAction");

      action.prepare();

      expect(spy).toBeCalledWith(
        DodgeAction.HEALTH_COST,
        DodgeAction.STAMINA_COST,
        DodgeAction.ACTION_TYPE,
      );
    });
  });

  describe("execute", () => {
    test("Should not to throw when calling", () => {
      const { action } = arrangeDodgeActionAndConsts({});

      expect(() => action.execute()).not.toThrow();
    });

    test("Should not change actor when calling", () => {
      const { action, testActorFirst } = arrangeDodgeActionAndConsts({});
      const before = JSON.parse(JSON.stringify(testActorFirst));

      action.execute();

      expect(before).toMatchObject(testActorFirst);
    });
  });
});
