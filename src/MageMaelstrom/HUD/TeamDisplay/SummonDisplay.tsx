import React from "react";
import { CombatantIcon } from "..";
import { ReadonlyEntrant } from "../../Combatant";
import { Stack } from "../../Common";
import { HealthBar } from "../HealthBar";
import styles from "./EntrantDisplay.module.css";
import { StatusEffectDisplay } from "./StatusEffectDisplay";

export interface SummonDisplayProps {
  entrant: ReadonlyEntrant;
  flip?: boolean;
}

export const SummonDisplay: React.FC<SummonDisplayProps> = ({
  entrant,
  flip,
}) => {
  return (
    <div className={styles.wrapper}>
      <Stack
        reverse={flip}
        fill
        gap={5}
        alignment="middle"
        style={{ height: 42 }}
      >
        <CombatantIcon
          name={entrant.combatant.name}
          icon={entrant.combatant.icon}
          color={entrant.color}
          horizontalFlip={flip}
          size={42}
        />
        <Stack.Item>
          <div>
            <HealthBar {...entrant.status.health} roundTo="ceil" />
            <div style={{ marginTop: 5 }}>
              <HealthBar
                {...entrant.status.mana}
                color={"rgb(100, 79, 255)"}
                roundTo="floor"
              />
            </div>
          </div>
        </Stack.Item>
        <Stack
          gap={4}
          style={
            entrant.statusEffects.length > 0
              ? flip
                ? { marginRight: 4 }
                : { marginLeft: 4 }
              : undefined
          }
        >
          {entrant.statusEffects
            .filter((s) => s.desc != null)
            .map((s) => (
              <StatusEffectDisplay key={s.id} statusEffect={s} />
            ))}
        </Stack>
      </Stack>
    </div>
  );
};
