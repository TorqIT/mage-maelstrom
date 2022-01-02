import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
} from "../Combatant";

export class ServerCombatant extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "ALL HAIL KING SERVER",
      icon: "/mal.png",

      strength: 999,
      agility: 999,
      intelligence: 999,

      abilities: ["meteor"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    you,
    visibleEnemies,
    spells: [potion, barrier, stun],
  }: ActParams): Action {
    return actions.dance();
  }
}
