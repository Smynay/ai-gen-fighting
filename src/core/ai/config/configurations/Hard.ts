import { ActorStatus } from "../../../actor";
import { AttackAction, BlockAction, DodgeAction } from "../../../actions";
import type { AIConfig, ConfigActions } from "../types";
import { AIMode } from "../types";

const convincedActions: ConfigActions = [
  {
    action: ActorStatus.ATTACK,
    chance: 60,
    test: (actor) => actor.stamina >= AttackAction.STAMINA_COST,
  },
  {
    action: ActorStatus.DODGE,
    chance: 20,
    test: (actor) => actor.stamina >= DodgeAction.STAMINA_COST,
  },
  {
    action: ActorStatus.REST,
    chance: 20,
    test: (actor, opponent) =>
      Boolean(
        (opponent && opponent.stamina < AttackAction.STAMINA_COST) ||
          actor.stamina < AttackAction.STAMINA_COST,
      ),
  },
];

const scaredActions: ConfigActions = [
  {
    action: ActorStatus.REST,
    chance: 30,
    test: (actor, opponent) =>
      Boolean(
        (opponent && opponent.stamina < AttackAction.STAMINA_COST) ||
          actor.stamina < DodgeAction.STAMINA_COST,
      ),
  },
  {
    action: ActorStatus.DODGE,
    chance: 60,
    test: (actor, opponent) =>
      Boolean(
        actor.stamina >= DodgeAction.STAMINA_COST &&
          opponent &&
          opponent.stamina >= AttackAction.STAMINA_COST,
      ),
  },
  {
    action: ActorStatus.BLOCK,
    chance: 10,
    test: (actor, opponent) =>
      Boolean(
        actor.stamina >= BlockAction.STAMINA_COST &&
          opponent &&
          opponent.stamina >= AttackAction.STAMINA_COST &&
          actor.health > AttackAction.HEALTH_DAMAGE,
      ),
  },
];

const normalActions: ConfigActions = [
  {
    action: ActorStatus.ATTACK,
    chance: 30,
    test: (actor) => actor.stamina >= AttackAction.STAMINA_COST,
  },
  {
    action: ActorStatus.DODGE,
    chance: 30,
    test: (actor, opponent) =>
      Boolean(
        actor.stamina >= DodgeAction.STAMINA_COST &&
          opponent &&
          opponent.stamina >= AttackAction.STAMINA_COST,
      ),
  },
  {
    action: ActorStatus.BLOCK,
    chance: 20,
    test: (actor, opponent) =>
      Boolean(
        actor.stamina >= BlockAction.STAMINA_COST &&
          opponent &&
          opponent.stamina >= AttackAction.STAMINA_COST,
      ),
  },
  { action: ActorStatus.REST, chance: 20 },
];

export const hardConfig: AIConfig = {
  name: "hardConfig",
  modes: {
    [AIMode.CONVINCED]: {
      test: (actor, opponent) => {
        if (actor.health > 2 && actor.stamina > 2) {
          return true;
        }

        if (opponent && opponent.stamina <= 2) {
          return true;
        }

        return false;
      },
      actions: convincedActions,
    },
    [AIMode.SCARED]: {
      test: (actor, opponent) => {
        if (actor.health < 2 && actor.stamina <= 2) {
          return true;
        }

        if (opponent && (opponent.health > 3 || opponent.stamina > 4)) {
          return true;
        }

        return false;
      },
      actions: scaredActions,
    },
    [AIMode.DEFAULT]: {
      actions: normalActions,
    },
  },
};
