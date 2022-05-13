import { Combatant as e } from "../MageMaelstrom";
class Brute extends e {
  define() {
    return {
      name: "Brute",
      icon: "/ogre.svg",
      strength: 35,
      agility: 5,
      intelligence: 5,
      abilities: ["stun", "darkness", "talented", "thorns"],
    };
  }
  init(e) {}
  act(e) {
    return this.enemyIsVisible(e)
      ? this.canBashHead(e)
        ? this.bashHead(e)
        : this.canClonk(e)
        ? this.clonk(e)
        : this.comeRunning(e)
      : this.wanderAimlessly(e) ?? e.actions.dance();
  }
  wanderAimlessly({ actions: e, helpers: s }) {
    const t = ["up", "down", "left", "right"];
    for (let n = 0; n < 10; n++) {
      const n = e.move(t[Math.floor(4 * Math.random())]);
      if (s.canPerform(n)) return this.shout("..."), n;
    }
  }
  enemyIsVisible({ visibleEnemies: e }) {
    return e.length > 0;
  }
  comeRunning({ visibleEnemies: e, actions: s, helpers: t }) {
    const n = t.getClosest(e);
    return this.shout("A CHALLENGER IS NEAR"), s.moveTo(n) ?? s.dance();
  }
  canBashHead({ actions: e, visibleEnemies: s, helpers: t, spells: [n] }) {
    const i = t.getClosest(s);
    if (!i.statusesEffects.includes("stun") && t.canPerform(e.cast(n, i.id)))
      return !0;
  }
  bashHead({ actions: e, visibleEnemies: s, helpers: t, spells: [n] }) {
    const i = t.getClosest(s);
    return this.shout("BONK"), e.cast(n, i.id);
  }
  canClonk({ actions: e, helpers: s, visibleEnemies: t }) {
    const n = s.getClosest(t);
    return s.canPerform(e.attack(n.id));
  }
  clonk({ visibleEnemies: e, helpers: s, actions: t }) {
    const n = s.getClosest(e);
    return this.shout("WHAM"), t.attack(n.id);
  }
  onTakeDamage(e) {}
  onStatusEffectApplied(e) {}
}
export const brutishBarbarians = {
  name: "The Brutish Barbarians",
  color: "#B60",
  author: "Nick",
  CombatantSubclasses: [Brute, Brute],
};
