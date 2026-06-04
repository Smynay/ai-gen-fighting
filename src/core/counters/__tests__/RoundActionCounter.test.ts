import { RoundActionCounter } from "../RoundActionCounter";

const arrangeRoundActionCounterAndConsts = ({
  maxRounds = 3,
  actionsPerRound = 3,
}) => {
  return {
    testMaxRounds: maxRounds,
    testActionsPerRound: actionsPerRound,
    counter: new RoundActionCounter(maxRounds, actionsPerRound),
  };
};

describe("RoundActionCounter", () => {
  describe("constructor", () => {
    test("Should not throw when called with correct args", () => {
      const { testMaxRounds, testActionsPerRound } =
        arrangeRoundActionCounterAndConsts({});

      expect(
        () => new RoundActionCounter(testMaxRounds, testActionsPerRound),
      ).not.toThrow();
    });
  });

  describe("action", () => {
    test.each([
      [0, 0],
      [1, 1],
      [5, 5],
    ])("Should return %i when next called %i times", (expects, runs) => {
      const { counter } = arrangeRoundActionCounterAndConsts({});

      for (let i = 0; i < runs; i++) {
        counter.next();
      }

      expect(counter.action).toBe(expects);
    });
  });

  describe("round", () => {
    test.each([
      [0, 0],
      [1, 3],
      [2, 6],
      [3, 9],
    ])("Should return %i when next called %i times", (expects, runs) => {
      const { counter } = arrangeRoundActionCounterAndConsts({});

      for (let i = 0; i < runs; i++) {
        counter.next();
      }

      expect(counter.round).toBe(expects);
    });
  });

  describe("isCounterEnd", () => {
    test("Should return false when next executed less than maxRounds * actionsPerRound times", () => {
      const { testMaxRounds, testActionsPerRound, counter } =
        arrangeRoundActionCounterAndConsts({});

      for (let i = 0; i < testMaxRounds * testActionsPerRound - 3; i++) {
        counter.next();
      }

      expect(counter.isCounterEnd).toBe(false);
    });

    test("Should return true when next executed maxRounds * actionsPerRound times", () => {
      const { testMaxRounds, testActionsPerRound, counter } =
        arrangeRoundActionCounterAndConsts({});

      for (let i = 0; i < testMaxRounds * testActionsPerRound; i++) {
        counter.next();
      }

      expect(counter.isCounterEnd).toBe(true);
    });

    test("Should return true when next executed more than maxRounds * actionsPerRound times", () => {
      const { testMaxRounds, testActionsPerRound, counter } =
        arrangeRoundActionCounterAndConsts({});

      for (let i = 0; i < testMaxRounds * testActionsPerRound + 3; i++) {
        counter.next();
      }

      expect(counter.isCounterEnd).toBe(true);
    });
  });

  describe("isRoundBreak", () => {
    test.each([1, 2, 3])(
      "Should return true when next executed %i * actionsPerRound times",
      (multiplier) => {
        const { testActionsPerRound, counter } =
          arrangeRoundActionCounterAndConsts({});

        for (let i = 0; i < multiplier * testActionsPerRound; i++) {
          counter.next();
        }

        expect(counter.isRoundBreak).toBe(true);
      },
    );

    test.each([1, 2, 4, 5])(
      "Should return false when next executed %i times",
      (multiplier) => {
        const { counter } = arrangeRoundActionCounterAndConsts({});

        for (let i = 0; i < multiplier; i++) {
          counter.next();
        }

        expect(counter.isRoundBreak).toBe(false);
      },
    );
  });

  describe("next", () => {
    test.each([
      [1, 1],
      [9, 9],
    ])(
      "Should increase action by %i when next called %i times",
      (expects, runs) => {
        const { counter } = arrangeRoundActionCounterAndConsts({});

        for (let i = 0; i < runs; i++) {
          counter.next();
        }

        expect(counter.action).toBe(expects);
      },
    );

    test("Should not change action when next called more than maxRound * actionsPerRound times", () => {
      const { testMaxRounds, testActionsPerRound, counter } =
        arrangeRoundActionCounterAndConsts({});

      for (let i = 0; i < testMaxRounds * testActionsPerRound + 1; i++) {
        counter.next();
      }

      expect(counter.action).toBe(testMaxRounds * testActionsPerRound);
    });

    test.each([
      [0, 0],
      [1, 3],
      [2, 6],
      [3, 9],
    ])(
      "Should increase round by %i when next called %i times",
      (expects, runs) => {
        const { counter } = arrangeRoundActionCounterAndConsts({});

        for (let i = 0; i < runs; i++) {
          counter.next();
        }

        expect(counter.round).toBe(expects);
      },
    );
  });

  describe("reset", () => {
    test("Should set action to 0 when called", () => {
      const { counter } = arrangeRoundActionCounterAndConsts({});

      counter.next();
      counter.reset();

      expect(counter.action).toBe(0);
    });

    test("Should set round to 0 when called", () => {
      const { counter } = arrangeRoundActionCounterAndConsts({});

      counter.next();
      counter.reset();

      expect(counter.round).toBe(0);
    });
  });
});
