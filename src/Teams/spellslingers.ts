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
      abilities: ["zap", "fireball", "ice", "ranged"],
      handicap: true,
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

    this.shout("Ready for battle!");
  }

  public act(params: ActParams): Action {
    return (
      this.getFirstValidAction([
        () => this.panicRun(params),
        () => this.slappyHands(params),
        () => this.slingSpell(params),
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
        this.shout("We search...");
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
      this.shout("TOO CLOSE! Repositioning!");
      return actions.runFrom(closestEnemy);
    }

    if (distance > 3) {
      this.shout("Too far! Repositioning!");
      return actions.moveTo(closestEnemy);
    }
  }

  private slingSpell({
    spells: [zap, fireball, ice],
    visibleEnemies,
    helpers,
    actions,
  }: ActParams) {
    for (const enemy of visibleEnemies) {
      const iceCast = actions.cast(ice, enemy.id);
      const fireballCast = actions.cast(fireball, enemy.id);
      const zapCast = actions.cast(zap, enemy.id);

      if (
        !enemy.statusesEffects.includes("ice") &&
        helpers.canPerform(iceCast)
      ) {
        this.shout("I cast... ice!");
        return iceCast;
      }

      if (helpers.canPerform(fireballCast)) {
        this.shout("I cast... fire!");
        return fireballCast;
      }

      if (helpers.canPerform(zapCast)) {
        this.shout("I cast... lightning!");
        return zapCast;
      }
    }
  }

  private slappyHands({ visibleEnemies, you, actions, helpers }: ActParams) {
    if (you.mana.value < 20 && visibleEnemies.length > 0) {
      this.shout("I cast... uh... fist?");
      return actions.attackMove(helpers.getClosest(visibleEnemies)!);
    }
  }

  private panicRun({ helpers, visibleEnemies, actions, you }: ActParams) {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (
      closestEnemy &&
      you.coords.isNextTo(closestEnemy.coords) &&
      Math.random() > 0.5
    ) {
      this.shout("OH GOD WAAAY TOO CLOSE");
      return actions.runFrom(closestEnemy);
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const spellslingers: Team = {
  name: "Spellslingers",
  color: "#38F",
  author: "Nick",
  CombatantSubclasses: [Spellslinger, Spellslinger],
};
