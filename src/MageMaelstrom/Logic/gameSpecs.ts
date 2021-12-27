export type GameSpecs = Readonly<{
  rules: Readonly<{
    maxCombatants: number;
    minStat: number;
    maxTotalStats: number;
  }>;
  arena: Readonly<{
    width: number;
    height: number;
  }>;
  stats: Readonly<{
    healthPerStrength: number;
    healthRegenPerStrength: number;
    agilityBonus: number;
    manaPerInt: number;
    manaRegenPerInt: number;
    vision: number;
  }>;
}>;
