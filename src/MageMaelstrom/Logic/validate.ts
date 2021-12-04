import { Team } from "../Combatant";
import { GameSpecs } from "./gameSpecs";

export function validate(
  team: Team,
  specs: GameSpecs
): { good: boolean; errors: string[] } {
  const errors: string[] = [];

  if (team.combatants.length > specs.rules.maxCombatants) {
    errors.push(
      `Teams cannot have more than ${specs.rules.maxCombatants} combatants`
    );
  }

  team.combatants.forEach((combatant) => {
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

    if (total > specs.rules.maxTotalStats) {
      errors.push(
        `${combatant.name}'s stats (total: ${total}) are too high (max total: ${specs.rules.maxTotalStats})`
      );
    }
  });

  return {
    good: errors.length === 0,
    errors,
  };
}
