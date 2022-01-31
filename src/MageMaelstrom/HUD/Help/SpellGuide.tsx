import React from "react";
import { ExtendedSpellStatus } from "../../Combatant";
import { Stack } from "../../Common";
import { Icon, mmCooldownTimer, mmManaCost, mmRange } from "../../Common/Icon";
import styles from "./AbilityGuide.module.css";

function toAccurateTarget(target: ExtendedSpellStatus["targetTypes"][number]) {
  switch (target) {
    case "coordinate":
      return "ReadonlyCoordinate";
    case "direction":
      return "MovementDirection";
    case "entrant":
      return "ReadonlyEntrantStatus.id";
    case "nothing":
      return "undefined";
  }
}

export interface SpellGuideProps {
  status: ExtendedSpellStatus;
}

export const SpellGuide: React.FC<SpellGuideProps> = ({ status }) => {
  if (!status.desc) {
    return null;
  }

  return (
    <Stack alignment="middle" gap={30}>
      <Stack.Item>
        <Stack alignment="middle" gap="apart">
          <Stack
            alignment="middle"
            gap={10}
            style={{ justifyContent: "start" }}
          >
            <Icon icon={status.desc?.icon} size={48} />{" "}
            <Stack direction="vertical" gap={5}>
              <span>{status.desc?.name}</span>
              <code className={styles.type}>{status.type}</code>
            </Stack>
          </Stack>
          <div>
            <span className={styles.targetLabel}>Target:</span>{" "}
            {status.targetTypes
              .map<React.ReactNode>((s) => (
                <code className={styles.target} key={s}>
                  {toAccurateTarget(s)}
                </code>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
          </div>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <div>{status.desc.description}</div>
        {status.desc.notes && status.desc.notes.length > 0 && (
          <ul className={styles.notes}>
            {status.desc.notes.map((n) => (
              <li>{n}</li>
            ))}
          </ul>
        )}
      </Stack.Item>
      <Stack.Item>
        <Stack gap="apart" alignment="middle">
          <Stack gap={20}>
            <Stack alignment="middle" gap={4} className={styles.spellNumber}>
              <Icon icon={mmCooldownTimer} size={20} />
              {status.cooldown < 9999999 ? status.cooldown / 100 + "s" : "∞"}
            </Stack>
            {status.manaCost > 0 && (
              <Stack alignment="middle" gap={4} className={styles.spellNumber}>
                <Icon icon={mmManaCost} size={20} />
                {status.manaCost}
              </Stack>
            )}

            {status.range && (
              <Stack alignment="middle" gap={4} className={styles.spellNumber}>
                <Icon icon={mmRange} size={20} />
                {status.range}
              </Stack>
            )}
          </Stack>
          <div className={styles.flavorText}>{status.desc.flavorText}</div>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
