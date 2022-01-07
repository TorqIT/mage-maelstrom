export type GameSpecs = Readonly<{
  rules: Readonly<{
    maxCombatants: number;
    minStat: number;
    maxTotalStats: number;
    maxAbilities: number;
  }>;
  suddenDeath: Readonly<{
    start: number;
    delay: number;
    radius: number;
    flatDamage: number;
    percentDamage: number;
  }>;
  arena: Readonly<{
    width: number;
    height: number;
  }>;
  stats: Readonly<{
    baseHealth: number;
    baseHealthRegen: number;
    healthPerStrength: number;
    healthRegenPerStrength: number;
    agilityBonus: number;
    baseMana: number;
    baseManaRegen: number;
    manaPerInt: number;
    manaRegenPerInt: number;
    baseDamage: number;
    vision: number;
  }>;
}>;
