import classNames from "classnames";
import React from "react";
import { ExtendedSpellStatus } from "../../Combatant";
import { Icon } from "../../Common/Icon";
import styles from "./SpellDisplay.module.css";

export interface SpellDisplayProps {
  spell: ExtendedSpellStatus;
}

const ICON_SIZE = 28;

export const SpellDisplay: React.FC<SpellDisplayProps> = ({ spell }) => {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.onCooldown]: spell.cooldownTimer > 0,
      })}
    >
      <div className={styles.icon}>
        <Icon icon={spell.icon} size={ICON_SIZE} />
      </div>
      <div
        className={styles.cooldownIndicator}
        style={{
          height:
            ((spell.cooldown - spell.cooldownTimer) / spell.cooldown) *
            ICON_SIZE,
        }}
      ></div>
    </div>
  );
};
