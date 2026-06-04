import { Actor } from "../Actor";
import { getRandomInt } from "../../utils";
import { ActorStatus } from "../interfaces";

export const arrangeActorAndConsts = ({
  health = 1,
  stamina = 1,
  action = ActorStatus.DODGE,
  cost = 1,
}) => {
  return {
    testHP: health,
    testSP: stamina,
    testAction: action,
    testCost: cost,
    testCostNoMatter: 0,
    actor: new Actor(health, stamina),
  };
};

describe("Actor", () => {
  describe("constructor", () => {
    test("Should not to throw when correct args passed", () => {
      expect(() => new Actor(getRandomInt(), getRandomInt())).not.toThrow();
    });

    test("Should throw when NaN passed as health", () => {
      expect(() => new Actor(NaN, 0)).toThrow();
    });

    test("Should throw when NaN passed as stamina", () => {
      expect(() => new Actor(0, NaN)).toThrow();
    });

    test("Should throw when negative number passed as health", () => {
      expect(() => new Actor(getRandomInt(-1, -10), 0)).toThrow();
    });

    test("Should throw when negative number passed as stamina", () => {
      expect(() => new Actor(0, getRandomInt(-1, -10))).toThrow();
    });
  });

  describe("info", () => {
    test.each([1, 2, 3])(
      "Should return valid info object when health is %i",
      (health) => {
        const { actor } = arrangeActorAndConsts({ health });

        expect(actor.info.health).toBe(health);
      },
    );

    test.each([1, 2, 3])(
      "Should return valid info object when stamina is %i",
      (stamina) => {
        const { actor } = arrangeActorAndConsts({ stamina });

        expect(actor.info.stamina).toBe(stamina);
      },
    );

    test.each(Actor.POSSIBLE_ACTIONS)(
      "Should return valid info object when executed action is %s",
      (action) => {
        const { actor, testCostNoMatter } = arrangeActorAndConsts({
          action,
        });

        actor.prepareAction(testCostNoMatter, testCostNoMatter, action);

        expect(actor.info.executedAction).toBe(action);
      },
    );

    test("Should return valid object when read", () => {
      const { actor, testHP, testSP, testCostNoMatter, testAction } =
        arrangeActorAndConsts({});

      actor.setAction(testAction);
      actor.prepareAction(testCostNoMatter, testCostNoMatter, testAction);

      expect(actor.info).toMatchObject({
        health: testHP,
        stamina: testSP,
        executedAction: testAction,
        selectedAction: testAction,
      });
    });
  });

  describe("producePoints", () => {
    test("Should not to throw when correct args passed", () => {
      const { actor, testCostNoMatter } = arrangeActorAndConsts({});

      expect(() =>
        actor.producePoints(testCostNoMatter, testCostNoMatter),
      ).not.toThrow();
    });

    test("Should increase health to passed when passed health cost is positive number", () => {
      const { actor, testHP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          health: 1,
          cost: 1,
        });

      actor.producePoints(testCost, testCostNoMatter);

      expect(actor.health).toBe(testHP + testCost);
    });

    test("Should increase stamina to passed when passed stamina cost is positive number", () => {
      const { actor, testSP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          stamina: 3,
          cost: 1,
        });

      actor.producePoints(testCostNoMatter, testCost);

      expect(actor.stamina).toBe(testSP + testCost);
    });

    test("Should not change health when passed health cost is zero", () => {
      const { actor, testHP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          health: 1,
          cost: 0,
        });

      actor.producePoints(testCost, testCostNoMatter);

      expect(actor.health).toBe(testHP);
    });

    test("Should not change stamina when passed stamina cost is zero", () => {
      const { actor, testSP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          stamina: 3,
          cost: 0,
        });

      actor.producePoints(testCostNoMatter, testCost);

      expect(actor.stamina).toBe(testSP);
    });

    test("Should throw when negative number as health arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: -1,
      });

      expect(() => actor.producePoints(testCost, testCostNoMatter)).toThrow();
    });

    test("Should throw when negative number as stamina arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: -1,
      });

      expect(() => actor.producePoints(testCostNoMatter, testCost)).toThrow();
    });

    test("Should throw when NaN as health arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: NaN,
      });

      expect(() => actor.producePoints(testCost, testCostNoMatter)).toThrow();
    });

    test("Should throw when NaN as stamina arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: NaN,
      });

      expect(() => actor.producePoints(testCostNoMatter, testCost)).toThrow();
    });
  });

  describe("reducePoints", () => {
    test("Should not to throw when correct args passed", () => {
      const { actor, testCostNoMatter } = arrangeActorAndConsts({});

      expect(() =>
        actor.reducePoints(testCostNoMatter, testCostNoMatter),
      ).not.toThrow();
    });

    test("Should decrease health to passed when passed health cost is positive number", () => {
      const { actor, testHP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          health: 1,
          cost: 1,
        });

      actor.reducePoints(testCost, testCostNoMatter);

      expect(actor.health).toBe(testHP - testCost);
    });

    test("Should decrease stamina to passed when passed stamina cost is positive number", () => {
      const { actor, testSP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          stamina: 3,
          cost: 1,
        });

      actor.reducePoints(testCostNoMatter, testCost);

      expect(actor.stamina).toBe(testSP - testCost);
    });

    test("Should not change health when passed health cost is zero", () => {
      const { actor, testHP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          health: 1,
          cost: 0,
        });

      actor.reducePoints(testCost, testCostNoMatter);

      expect(actor.health).toBe(testHP);
    });

    test("Should not change stamina when passed stamina cost is zero", () => {
      const { actor, testSP, testCost, testCostNoMatter } =
        arrangeActorAndConsts({
          stamina: 3,
          cost: 0,
        });

      actor.reducePoints(testCostNoMatter, testCost);

      expect(actor.stamina).toBe(testSP);
    });

    test("Should throw when negative number as health arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: -1,
      });

      expect(() => actor.reducePoints(testCost, testCostNoMatter)).toThrow();
    });

    test("Should throw when negative number as stamina arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: -1,
      });

      expect(() => actor.reducePoints(testCostNoMatter, testCost)).toThrow();
    });

    test("Should throw when NaN as health arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: NaN,
      });

      expect(() => actor.reducePoints(testCost, testCostNoMatter)).toThrow();
    });

    test("Should throw when NaN as stamina arg passed", () => {
      const { actor, testCost, testCostNoMatter } = arrangeActorAndConsts({
        cost: NaN,
      });

      expect(() => actor.reducePoints(testCostNoMatter, testCost)).toThrow();
    });
  });

  describe("prepareAction", () => {
    test("Should not to throw when correct args passed", () => {
      const actor = new Actor(3, 3);

      expect(() => actor.prepareAction(1, 1, ActorStatus.DODGE)).not.toThrow();
    });

    test("Should change executedAction to passed when passed health cost less than actor have", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          health: 2,
          action: ActorStatus.BLOCK,
        });

      actor.prepareAction(testCost, testCostNoMatter, testAction);

      expect(actor.executedAction).toBe(testAction);
    });

    test("Should change executedAction to passed when passed health cost equals that actor have", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          health: 2,
          action: ActorStatus.BLOCK,
          cost: 2,
        });

      actor.prepareAction(testCost, testCostNoMatter, testAction);

      expect(actor.executedAction).toBe(testAction);
    });

    test("Should change executedAction to passed when passed stamina cost less than actor have", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          stamina: 3,
          action: ActorStatus.BLOCK,
          cost: 1,
        });

      actor.prepareAction(testCostNoMatter, testCost, testAction);

      expect(actor.executedAction).toBe(testAction);
    });

    test("Should change executedAction to passed when passed stamina cost equals that actor have", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          stamina: 1,
          action: ActorStatus.BLOCK,
          cost: 1,
        });

      actor.prepareAction(testCostNoMatter, testCost, testAction);

      expect(actor.executedAction).toBe(testAction);
    });

    test("Should not change executedAction to passed when passed health cost greater than actor have", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          health: 1,
          cost: 2,
        });
      const defaultAction = actor.executedAction;

      actor.prepareAction(testCost, testCostNoMatter, testAction);

      expect(actor.executedAction).toBe(defaultAction);
    });

    test("Should not change executedAction to passed when passed stamina cost greater than actor have", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          stamina: 1,
          cost: 2,
        });
      const defaultAction = actor.executedAction;

      actor.prepareAction(testCostNoMatter, testCost, testAction);

      expect(actor.executedAction).toBe(defaultAction);
    });

    test("Should throw when negative number as health arg passed", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          cost: -1,
        });

      expect(() =>
        actor.prepareAction(testCost, testCostNoMatter, testAction),
      ).toThrow();
    });

    test("Should throw when negative number as stamina arg passed", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          cost: -1,
        });

      expect(() =>
        actor.prepareAction(testCostNoMatter, testCost, testAction),
      ).toThrow();
    });

    test("Should throw when NaN as health arg passed", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          cost: NaN,
        });

      expect(() =>
        actor.prepareAction(testCost, testCostNoMatter, testAction),
      ).toThrow();
    });

    test("Should throw when NaN as stamina arg passed", () => {
      const { actor, testCost, testCostNoMatter, testAction } =
        arrangeActorAndConsts({
          cost: NaN,
        });

      expect(() =>
        actor.prepareAction(testCostNoMatter, testCost, testAction),
      ).toThrow();
    });
  });
});
