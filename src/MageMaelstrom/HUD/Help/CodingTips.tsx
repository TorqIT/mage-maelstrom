import React from "react";
import { Stack } from "../../Common";
import styles from "./CodingTips.module.css";

export interface CodingTipsProps {}

export const CodingTips: React.FC<CodingTipsProps> = ({}) => {
  return (
    <div className={styles.codingTips}>
      <Stack gap={20}>
        <Stack.Item size={0.9}>
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
            includes damage over time effects, meaning if an enemy poisons you,
            this method will get called 16 times over the next in-game 8
            seconds.
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
        <Stack.Item size={1.1}>
          <h1>Coding your Combatant</h1>
        </Stack.Item>
      </Stack>
    </div>
  );
};
