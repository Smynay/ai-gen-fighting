import { AI } from "./AI";
import type { AIConfig } from "./config/types";
import {
  easyConfig,
  hardConfig,
  mediumConfig,
  randomConfig,
} from "./config";

type AllowedAiConfigs = "easy" | "medium" | "hard" | "random";

export class AIFactory {
  static ALLOWED_AI_CONFIGS: Record<AllowedAiConfigs, AIConfig> = {
    easy: easyConfig,
    medium: mediumConfig,
    hard: hardConfig,
    random: randomConfig,
  };

  get allowedAITypes(): AllowedAiConfigs[] {
    return Object.keys(AIFactory.ALLOWED_AI_CONFIGS) as AllowedAiConfigs[];
  }
  getAIByType(type?: AllowedAiConfigs): AI {
    if (!type) {
      return new AI(AIFactory.ALLOWED_AI_CONFIGS.easy);
    }

    return new AI(AIFactory.ALLOWED_AI_CONFIGS[type]);
  }
}
