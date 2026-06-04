import { AIConfig, AIMode, ConfigActions } from "../types";
import { ActorStatus } from "../../../actor";

const normalActions: ConfigActions = [
  {
    action: ActorStatus.ATTACK,
    chance: 25,
  },
  {
    action: ActorStatus.DODGE,
    chance: 25,
  },
  {
    action: ActorStatus.BLOCK,
    chance: 25,
  },
  { action: ActorStatus.REST, chance: 25 },
];

export const randomConfig: AIConfig = {
  name: "randomConfig",
  modes: {
    [AIMode.DEFAULT]: {
      actions: normalActions,
    },
  },
};
