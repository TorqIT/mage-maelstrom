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

    return moveAction;
  }

  private onslaught({ actions, helpers, visibleEnemies }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies);

    if (!closest) {
      return;
    }

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
      return actions.cast(burst);
    }
  }
}

class Bishop extends ChessCombatant {
  public define(): CombatantDefinition {
    return {
      name: "Bishop",
      icon: "/chess-bishop.svg",
      strength: 5,
      agility: 12,
      intelligence: 23,
      abilities: ["force", "barrier", "regen", "heal"],
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    return (
      this.getFirstValidAction([
        () => this.buffKnight(params),
        () => this.buffMe(params),
        () => this.followKnight(params),
      ]) ?? params.actions.dance()
    );
  }

  private followKnight({ actions, allies }: ActParams) {
    if (allies.length === 0) {
      return;
    }

    const knight = allies[0];
    return actions.moveTo(knight);
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
      return actions.cast(barrier, knight.id);
    }

    if (
      !knight.statusesEffects.includes("regen") &&
      knight.health.value < 300 &&
      helpers.canPerform(actions.cast(regen, knight.id))
    ) {
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
      return actions.cast(barrier, you.id);
    }

    if (
      !you.statusesEffects.includes("regen") &&
      you.health.value < 200 &&
      helpers.canPerform(actions.cast(regen, you.id))
    ) {
      return actions.cast(regen, you.id);
    }
  }
}

export const knightAndBishop: Team = {
  name: "Knight and Bishop",
  color: "#2AF",
  CombatantSubclasses: [Knight, Bishop],
};
