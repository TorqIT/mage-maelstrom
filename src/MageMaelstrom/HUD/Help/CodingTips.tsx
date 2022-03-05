import React from "react";
import { Stack } from "../../Common";
import styles from "./CodingTips.module.css";

export interface CodingTipsProps {}

export const CodingTips: React.FC<CodingTipsProps> = ({}) => {
  return (
    <div className={styles.codingTips}>
      <Stack gap={20}>
        <Stack.Item size={1.1}>
          <h1>The Combatant</h1>
          <p>
            You combatant should extend the <code>Combatant</code> class, an
            abstract class which requires five methods, two of which are central
            to playing the game, while the other three are still required but
            can be left blank
          </p>
          <p>The two most important methods are:</p>
          <h2>
            <code>define(): CombatantDefinition</code>
          </h2>
          <p>
            The method in which you define your characters stats and abilities.
            This method should be <b>deterministic</b>, meaning it must return
            the same values every time. You should not create a character who's
            stats and abilities are randomized or change every time the
            combatant is initialized. Ideally, this method would just
            immediately return a <code>CombatantDefinition</code>
          </p>
          <h2>
            <code>act(params: ActParams): Action</code>
          </h2>
          <p>
            The method which returns your combatants action whenever its their
            turn based on the given parameters. Should return an action created
            by the <code>actions</code> object provided in the{" "}
            <code>ActParams</code>
          </p>
          <div style={{ backgroundColor: "#5c5c5b", height: 1 }}></div>
          <p>
            Additionally, the following three methods are required, but can be
            left blank:
          </p>
          <h3>
            <code>init(params: InitParams): void</code>
          </h3>
          <p>
            Called before the battle begins. Lets you initialize anything you
            need on your combatant before the game begins
          </p>
          <h3>
            <code>onTakeDamage(params:OnTakeDamageParams): void</code>
          </h3>
          <p>
            Called every time your character takes damage. <b>Note:</b> this
            includes damage over time effects. Bleed ticks 20 times an in-game
            second, therefore <code>onTakeDamage()</code> will get called a
            total of 60 times over its 3 second duration.
          </p>
          <h3>
            <code>
              onStatusEffectApplied(params: OnStatusEffectAppliedParams): void
            </code>
          </h3>
          <p>
            Called every time a status effect is applied to you, good or bad.
            Useful to identify state changes to your combatant, even if the
            status effect doesn't do any damage.
          </p>
          <h1>Interfaces</h1>
          <p>
            Currently, all interfaces (<code>ActParams</code>,{" "}
            <code>ReadonlyEntrantStatus</code>, <code>SpellStatus</code>, etc)
            are documented via JSDocs. Eventually, I'd like to have all their
            documentation listed here too but for the time being, you'll have to
            just directly browse the interfaces. Sorry ¯\_(ツ)_/¯
          </p>
        </Stack.Item>
        <Stack.Item size={0.9}>
          <h1>
            The basics of <code>act()</code>ing
          </h1>
          <p>
            Every time it's your turn to <code>act()</code>, you're expected to
            return an <code>Action</code>. While you can technically build these
            objects yourself, it's <i>highly</i> recommended to use the{" "}
            <code>actions</code> object provided in the <code>ActParams</code>.
            The <code>actions</code> object provides an easy way to generate{" "}
            <code>Action</code> objects, and it even provides some really useful
            helpers:
          </p>
          <ul>
            <li>
              <code>moveTo()</code> which handles pathfinding for you
            </li>
            <li>
              <code>attackMove()</code> which lets you automatically attack
              enemies if they're close enough
            </li>
          </ul>
          <p>
            Of course you can declare your action, but there's no guarantee that
            it'll succeed. You can try to walk out the arena, or attack an enemy
            that's out of range, or cast a spell that's on cooldown, but if you
            do, your action will simply be ignored and converted to a{" "}
            <code>dance</code> action. In order to actually guarantee your
            action, you're going to need to verify it's even possible in the
            first place. This is where the <code>helpers</code> object comes in.
          </p>
          <p>
            <code>helpers</code> (also provided in the <code>ActParams</code>)
            provides two methods: <code>canPerform()</code> which returns true
            or false depending on whether or not an action will succeed, and{" "}
            <code>getActionResult()</code>, which provides more detail as to why
            an action would fail. Both of these methods check everything, any
            obstructions when moving, your distance from the enemy when
            attacking and casting, your cooldown, your mana, everything. Don't
            worry about what you're doing. Worry about how you're doing it.
          </p>
          <p>
            <small>
              <i>
                Note: An action may still fail in cases where two combatants act
                on the same turn. For example, if two combatants try to move to
                the same tile, one will succeed, while the other will fail even
                though at the start of the turn, it appeared as though the move
                was possible. The same goes for a combatant moving out of range
                of an attack or spell cast.
              </i>
            </small>
          </p>
          <h1>
            <code>this.shout()</code>
          </h1>
          <p>
            Curious what's on your character's mind? Combatant provides a{" "}
            <code>shout()</code> method which outputs a given string directly
            your combatant's HUD. While you could very much just use{" "}
            <code>console.log()</code> instead, <code>this.shout()</code> has
            the advantage of seeing what's going through your combatant's head
            without needing to take your eyes off the battle, while giving a
            very clear indication of who's thinking what.
          </p>
          <p>
            Debugging uses aside, don't be afraid to use it to give your
            character some personality! All shouts will remain visible
            throughout the final tournament, so keep that in mind when thinking
            about what you should yell out to the world.
          </p>
        </Stack.Item>
      </Stack>
    </div>
  );
};
