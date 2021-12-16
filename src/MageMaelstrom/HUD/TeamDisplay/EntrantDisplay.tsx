import React from "react";
import { CombatantIcon } from "..";
import { ReadonlyEntrant } from "../../Combatant";
import { Stack } from "../../Common";
import { Icon } from "../../Common/Icon";
import { HealthBar } from "../HealthBar";
import styles from "./EntrantDisplay.module.css";

export interface EntrantDisplayProps {
  entrant: ReadonlyEntrant;
  color: string;
  flip?: boolean;
}

export const EntrantDisplay: React.FC<EntrantDisplayProps> = ({
  entrant,
  color,
  flip,
}) => {
  return (
    <div className={styles.wrapper}>
      <Stack reverse={flip} fill gap={5} style={{ height: 64 }}>
        <CombatantIcon
          combatant={entrant.combatant}
          teamColor={color}
          horizontalFlip={flip}
          size={64}
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
                <Stack gap={4}>
                  {entrant.spells.map((s) => (
                    <Icon icon={s.icon} size={28} />
                  ))}
                </Stack>
                <Stack gap={4}>
                  {entrant.passives.map((p) => (
                    <Icon icon={p.icon} size={28} />
                  ))}
                </Stack>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      <div style={{ marginTop: 10 }}>
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
