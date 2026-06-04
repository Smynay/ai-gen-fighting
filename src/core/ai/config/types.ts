import { ActorStatus, IActor } from "../../actor";

type ConfigAction = {
  action: ActorStatus;
  chance: number;
  test?: (actor: IActor, opponent?: IActor) => boolean;
};

export type ConfigActions = ConfigAction[];

export enum AIMode {
  CONVINCED = "convinced",
  DEFAULT = "default",
  SCARED = "scared",
}

type ModeConfig = {
  test?: (actor: IActor, opponent?: IActor) => boolean;
  actions: ConfigActions;
};

export type ConfigModes = {
  [AIMode.DEFAULT]: ModeConfig;
  [key: string]: ModeConfig;
};

export type AIConfig = {
  name: string;
  modes: ConfigModes;
};
