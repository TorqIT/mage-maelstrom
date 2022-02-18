import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { ReadonlyCoordinate } from "../MageMaelstrom/Arena";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
} from "../MageMaelstrom/Combatant";
import { mmZap } from "../MageMaelstrom/Common/Icon";

class Spellslinger extends Combatant {
  private rotation: ReadonlyCoordinate[] = [];
  private target = new ReadonlyCoordinate();

  public define(): CombatantDefinition {
    return {
      name: "Spellslinger",
      icon: mmZap.file,
      strength: 10,
      agility: 10,
      intelligence: 20,
      abilities: ["zap", "fireball", "poison", "evasion"],
    };
  }

  public init({ arena, you }: InitParams): void {
    this.rotation = [
      new ReadonlyCoordinate({ x: 3, y: 3 }),
      new ReadonlyCoordinate({ x: arena.width - 3, y: 3 }),
      new ReadonlyCoordinate({ x: arena.width - 3, y: arena.height - 3 }),
      new ReadonlyCoordinate({ x: 3, y: arena.height - 3 }),
    ];

    this.target = you.coords.getClosest(this.rotation)!;
  }

  public act(params: ActParams): Action {
    return (
      this.getFirstValidAction([
        () => this.getIntoSweetSpot(params),
        () => this.search(params),
      ]) ?? params.actions.dance()
    );
  }

  private getFirstValidAction(actions: (() => Action | undefined)[]) {
    for (const act of actions) {
      const result = act();

      if (result) {
        return result;
      }
    }
  }

  private search({ actions }: ActParams) {
    for (let j = 0; j < 10; j++) {
      const result = actions.moveTo(this.target);

      if (result) {
        return result;
      }

      this.target =
        this.rotation[Math.floor(Math.random() * this.rotation.length)];
    }
  }

  private getIntoSweetSpot({
    actions,
    helpers,
    visibleEnemies,
    you,
  }: ActParams) {
    if (visibleEnemies.length === 0) {
      return;
    }

    const closestEnemy = helpers.getClosest(visibleEnemies)!;
    const distance = you.coords.getDistance(closestEnemy.coords);

    if (distance <= 1.5) {
      return actions.runFrom(closestEnemy);
    }

    if (distance > 3) {
      return actions.moveTo(closestEnemy);
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const spellslingers: Team = {
  name: "Spellslingers",
  color: "#38F",
  CombatantSubclasses: [Spellslinger, Spellslinger],
};
