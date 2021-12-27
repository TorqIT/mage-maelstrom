import React from "react";
import { StatusEffectStatus } from "../../Combatant";
import { Stack } from "../../Common";
import { DescribableDisplay } from "./DescribableDisplay";
import styles from "./StatusEffectDisplay.module.css";

export interface StatusEffectDisplayProps {
  statusEffect: StatusEffectStatus;
}

export const StatusEffectDisplay: React.FC<StatusEffectDisplayProps> = ({
  statusEffect,
}) => {
  return (
    <Stack alignment="end">
      <DescribableDisplay describable={statusEffect.desc!} />
      <div
        className={styles.timer}
        style={{
          height: (statusEffect.ticksLeft / statusEffect.duration) * 28,
        }}
      ></div>
    </Stack>
  );
};
