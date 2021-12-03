export interface GameSpecs {
  arena: {
    width: number;
    height: number;
  };
  stats: {
    healthPerStrength: number;
    healthRegenPerStrength: number;
    agilityBonus: number;
    manaPerInt: number;
    manaRegenPerInt: number;
  };
}
