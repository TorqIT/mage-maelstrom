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

abstract class ChessCombatant extends Combatant {
  protected getFirstValidAction(actions: (() => Action | undefined)[]) {
    for (const act of actions) {
      const result = act();

      if (result) {
        return result;
      }
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

class Knight extends ChessCombatant {
  private rotation: ReadonlyCoordinate[] = [];
  private rotationIndex = 0;

  public define(): CombatantDefinition {
    return {
      name: "Knight",
      icon: "/chess-knight.svg",
      strength: 25,
      agility: 10,
      intelligence: 5,
      abilities: ["burst", "thorns", "critical", "critical"],
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

    this.rotationIndex = you.coords.getClosestIndex(this.rotation)!;
  }

  public act(params: ActParams): Action {
    return (
      this.getFirstValidAction([
        () => this.getOffMe(params),
        () => this.onslaught(params),
        () => this.searchPerimeter(params),
      ]) ?? params.actions.dance()
    );
  }

  private searchPerimeter({ actions }: ActParams) {
    let moveAction = actions.moveTo(this.rotation[this.rotationIndex]);

    if (!moveAction) {
      this.rotationIndex = (this.rotationIndex + 1) % 4;
      moveAction = actions.moveTo(this.rotation[this.rotationIndex]);
    }

    this.shout("Moving forward!");
    return moveAction;
  }

  private onslaught({ actions, helpers, visibleEnemies }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies);

    if (!closest) {
      return;
    }

    this.shout("Eat steel!");
    return actions.attackMove(closest);
  }

  private getOffMe({
    visibleEnemies,
    actions,
    you,
    helpers,
    spells: [burst],
  }: ActParams) {
    let enemiesNextToMe = 0;

    visibleEnemies.forEach((e) => {
      if (e.coords.isNextTo(you.coords)) {
        enemiesNextToMe++;
      }
    });

    if (
      enemiesNextToMe >= 2 &&
      you.health.value < 200 &&
      helpers.canPerform(actions.cast(burst))
    ) {
      this.shout("BEGONE");
      return actions.cast(burst);
    }
  }
}

class Bishop extends ChessCombatant {
  public define(): CombatantDefinition {
    return {
      name: "Bishop",
      icon: "/chess-bishop.svg",
      strength: 8,
      agility: 8,
      intelligence: 24,
      abilities: ["force", "barrier", "regen", "heal"],
      handicap: true,
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    return (
      this.getFirstValidAction([
        () => this.getOffMe(params),
        () => this.keepKnightHealthy(params),
        () => this.buffKnight(params),
        () => this.buffMe(params),
        () => this.followKnight(params),
        () => this.whackWithCrosier(params),
      ]) ?? params.actions.dance()
    );
  }

  private followKnight({ actions, allies, you }: ActParams) {
    if (allies.length === 0) {
      return;
    }

    const knight = allies[0];

    if (knight.coords.getDistance(you.coords) > 3.5) {
      this.shout("My knight! Where are thee?");
      return actions.moveTo(knight);
    }
  }

  private buffKnight({
    actions,
    allies,
    helpers,
    visibleEnemies,
    spells: [, barrier, regen],
  }: ActParams) {
    if (visibleEnemies.length === 0 || allies.length === 0) {
      return;
    }

    const knight = allies[0];

    if (
      !knight.statusesEffects.includes("barrier") &&
      helpers.canPerform(actions.cast(barrier, knight.id))
    ) {
      this.shout("You are protected!");
      return actions.cast(barrier, knight.id);
    }

    if (
      !knight.statusesEffects.includes("regen") &&
      knight.health.value < 300 &&
      helpers.canPerform(actions.cast(regen, knight.id))
    ) {
      this.shout("You must persist!");
      return actions.cast(regen, knight.id);
    }
  }

  private buffMe({
    actions,
    you,
    helpers,
    visibleEnemies,
    spells: [, barrier, regen],
  }: ActParams) {
    if (visibleEnemies.length === 0) {
      return;
    }

    if (
      !you.statusesEffects.includes("barrier") &&
      helpers.canPerform(actions.cast(barrier, you.id))
    ) {
      this.shout("I am protected!");
      return actions.cast(barrier, you.id);
    }

    if (
      !you.statusesEffects.includes("regen") &&
      you.health.value < 200 &&
      helpers.canPerform(actions.cast(regen, you.id))
    ) {
      this.shout("I shall recover");
      return actions.cast(regen, you.id);
    }
  }

  private keepKnightHealthy({
    allies,
    actions,
    helpers,
    spells: [, , , heal],
  }: ActParams) {
    if (allies.length === 0) {
      return;
    }

    const knight = allies[0];

    if (
      knight.health.value < 350 &&
      helpers.canPerform(actions.cast(heal, knight.id))
    ) {
      this.shout("You are healed!");
      return actions.cast(heal, knight.id);
    }
  }

  private getOffMe({
    actions,
    helpers,
    spells: [force],
    visibleEnemies,
    you,
  }: ActParams) {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (
      closestEnemy &&
      closestEnemy.coords.isNextTo(you.coords) &&
      helpers.canPerform(actions.cast(force, closestEnemy.id))
    ) {
      this.shout("I repel thee!");
      return actions.cast(force, closestEnemy.id);
    }
  }

  private whackWithCrosier({ visibleEnemies, actions, helpers }: ActParams) {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (closestEnemy) {
      this.shout("OH GOD");
      return actions.attackMove(closestEnemy);
    }
  }
}

export const knightAndBishop: Team = {
  name: "Knight and Bishop",
  color: "#2AF",
  CombatantSubclasses: [Knight, Bishop],
};
