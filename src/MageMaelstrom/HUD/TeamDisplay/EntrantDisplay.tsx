import React from "react";
import { CombatantIcon } from "..";
import { ReadonlyEntrant } from "../../Combatant";
import { Stack } from "../../Common";
import { HealthBar } from "../HealthBar";
import { DescribableDisplay } from "./DescribableDisplay";
import styles from "./EntrantDisplay.module.css";
import { SpellDisplay } from "./SpellDisplay";
import { StatusEffectDisplay } from "./StatusEffectDisplay";

export interface EntrantDisplayProps {
  entrant: ReadonlyEntrant;
  flip?: boolean;
}

export const EntrantDisplay: React.FC<EntrantDisplayProps> = ({
  entrant,
  flip,
}) => {
  return (
    <div className={styles.wrapper}>
      <Stack reverse={flip} fill gap={5} style={{ height: 56 }}>
        <CombatantIcon
          name={entrant.combatant.name}
          icon={entrant.combatant.icon}
          color={entrant.color}
          horizontalFlip={flip}
          size={56}
        />
        <Stack.Item style={{ height: "100%" }}>
          <Stack
            direction="vertical"
            gap="apart"
            style={{ height: "100%" }}
            stretch
            alignment="end"
          >
            <div
              className={styles.name}
              style={{ textAlign: flip ? "right" : "left" }}
            >
              {entrant.combatant.name}
            </div>
            <Stack.Item>
              <Stack gap="apart" fill alignment="middle" reverse={flip}>
                <Stack gap={12} alignment="middle" reverse={flip}>
                  <Stack
                    gap={8}
                    style={flip ? { marginLeft: 4 } : { marginRight: 4 }}
                  >
                    {entrant.spells.map((s) => (
                      <SpellDisplay key={s.id} spell={s} />
                    ))}
                  </Stack>
                  <div
                    style={{
                      borderLeft: "1px solid #9b9988",
                      height: 30,
                    }}
                  ></div>
                  <Stack gap={4}>
                    {entrant.passives
                      .filter((p) => p.desc != null)
                      .map((p) => (
                        <DescribableDisplay key={p.id} describable={p.desc!} />
                      ))}
                  </Stack>
                </Stack>
                <Stack gap={4}>
                  {entrant.statusEffects
                    .filter((s) => s.desc != null)
                    .map((s) => (
                      <StatusEffectDisplay key={s.id} statusEffect={s} />
                    ))}
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      <div style={{ marginTop: 10 }}>
        <Stack reverse={flip} style={{ marginBottom: 5 }}>
          <div
            className={styles.timerBar}
            style={{
              width: entrant.status.ticksUntilNextTurn,
            }}
          ></div>
        </Stack>
        <HealthBar {...entrant.status.health} roundTo="ceil" />
        <div style={{ marginTop: 5 }}>
          <HealthBar
            {...entrant.status.mana}
            color={"rgb(100, 79, 255)"}
            roundTo="floor"
          />
        </div>
      </div>
    </div>
  );
};
