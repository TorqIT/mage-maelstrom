import React from "react";
import { Stack } from "../../Common";
import { useGameSpecs } from "../../Logic/GameSpecsProvider";
import styles from "./RulesGuide.module.css";

export interface RulesGuideProps {}

export const RulesGuide: React.FC<RulesGuideProps> = ({}) => {
  const { rules, stats, suddenDeath } = useGameSpecs();

  return (
    <div className={styles.rules}>
      <h1>Overview</h1>
      <p>
        Two teams of warriors, wizards and rogues battle it out, each with their
        own abilities and powers. Each team is composed of combatants, where
        each combatant has their own health and mana pool. If a combatant runs
        out of health, they are defeated. The last team with someone still
        standing wins!
      </p>
      <Stack>
        <Stack.Item size={0.85}>
          <h2>Team Composition</h2>
          <ol>
            <li>Each team may only have {rules.maxCombatants} combatants</li>
            <li>
              Each combatant must have:
              <ol type="a">
                <li>
                  A minimum strength, agility and intelligence of{" "}
                  {rules.minStat}
                </li>
                <li>
                  A max combined stat total (strength, agility and intillegence)
                  of {rules.maxTotalStats}
                </li>
                <li>A maximum of {rules.maxAbilities} abilities</li>
                <li>
                  A maximum of one of each <i>spell</i> (passives on the other
                  hand can be repeated, though several do not stack)
                </li>
              </ol>
            </li>
          </ol>
        </Stack.Item>
        <Stack.Item size={1.15}>
          <h2>Stats</h2>
          <ul>
            <li>
              Combatant base stats are:
              <ul>
                <li>
                  {stats.baseHealth} health and {stats.baseHealthRegen}/s health
                  regen
                </li>
                <li>An turn delay of {stats.baseAttackPeriod} (±10%) ticks</li>
                <li>
                  {stats.baseMana} mana and {stats.baseManaRegen}/s mana regen
                </li>
                <li>{stats.vision} vision</li>
                <li>{stats.baseDamage} damage</li>
              </ul>
            </li>
            <li>
              Each point of <b>Strength</b> provides +{stats.healthPerStrength}{" "}
              health and +{stats.healthRegenPerStrength}/s health regeneration
            </li>
            <li>
              Each point of <b>Agility</b> causes you to act{" "}
              {(stats.agilityBonus * 100).toFixed(0)}% faster (additively)
            </li>
            <li>
              Each point of <b>Intelligence</b> provides +{stats.manaPerInt}{" "}
              mana and +{stats.manaRegenPerInt}/s mana regen
            </li>
            <li>
              You're highest stat is added to your damage (having 20/10/10 stats
              gives you +20 damage)
            </li>
          </ul>
        </Stack.Item>
      </Stack>
      <h1>Mechanics</h1>
      <ul>
        <li>Mage Maelstrom runs at 100 ticks per second</li>
        <li>
          All distances (vision and spell range) are calculated as the
          pythagorean distance between two tiles. If a combatant is 3 tiles down
          and 4 tiles right of its target, the target is 5 units away because{" "}
          <div style={{ display: "inline-block", marginTop: -4 }}>
            3<sup>2</sup> + 4<sup>2</sup> = 5<sup>2</sup>
          </div>
        </li>
        <li>
          Vision is shared between all team members. If one combatant sees an
          enemy, all combatants on their team see that enemy
        </li>
        <li>
          <b>Status Effects</b> do not stack with themselves (ie, you cannot
          have 2 instances of Poison on a combatant at the same time, but you
          can have Poison AND Fire). Reapplying a status effect on a combatant
          merely refreshes the existing one.
        </li>
        <li>
          After {suddenDeath.start / 100} seconds, <b>Sudden Death</b> begins.
          Meteors start raining down on random locations throughout the arena at
          a rate of {100 / suddenDeath.delay} meteors per second. Each meteor
          deals damage equal to {suddenDeath.flatDamage} +{" "}
          {(100 * suddenDeath.percentDamage).toFixed(0)}% of the impacted's max
          health
        </li>
      </ul>
    </div>
  );
};
