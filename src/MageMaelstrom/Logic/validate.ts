import { Coordinate } from "../Arena";
import { Entrant, Team } from "../Combatant";
import { GameSpecs } from "./gameSpecs";

export function validate(
  team: Team,
  specs: GameSpecs
): { good: boolean; errors: string[] } {
  const errors: string[] = [];

  if (team.CombatantSubclasses.length > specs.rules.maxCombatants) {
    errors.push(
      `Teams cannot have more than ${specs.rules.maxCombatants} combatants`
    );
  }

  team.CombatantSubclasses.forEach((SubCombatant) => {
    const entrant = new Entrant(
      new SubCombatant(specs),
      { color: team.color, flip: false, id: -1 },
      new Coordinate(0, 0)
    );
    const combatant = entrant.getCombatant().getDef();

    if (combatant.strength < specs.rules.minStat) {
      errors.push(
        `${combatant.name}'s strength (${combatant.strength}) is too low (min: ${specs.rules.minStat})`
      );
    }

    if (combatant.agility < specs.rules.minStat) {
      errors.push(
        `${combatant.name}'s agility (${combatant.agility}) is too low (min: ${specs.rules.minStat})`
      );
    }

    if (combatant.intelligence < specs.rules.minStat) {
      errors.push(
        `${combatant.name}'s intelligence (${combatant.intelligence}) is too low (min: ${specs.rules.minStat})`
      );
    }

    const total =
      combatant.strength + combatant.agility + combatant.intelligence;
    const max = entrant.getMaxStatBonus() + specs.rules.maxTotalStats;

    if (total > max) {
      errors.push(
        `${combatant.name}'s stats (total: ${total}) are too high (max total: ${max})`
      );
    }
  });

  return {
    good: errors.length === 0,
    errors,
  };
}
