import React from "react";
import { AbilityStatus } from "../../Combatant";
import { Stack } from "../../Common";
import { Icon } from "../../Common/Icon";
import styles from "./AbilityGuide.module.css";

export interface PassiveGuideProps {
  status: AbilityStatus;
}

export const PassiveGuide: React.FC<PassiveGuideProps> = ({ status }) => {
  if (!status.desc) {
    return null;
  }

  return (
    <Stack alignment="middle" gap={30}>
      <Stack.Item>
        <Stack
          alignment="middle"
          gap={10}
          style={{ justifyContent: "start", fontStyle: "italic" }}
        >
          <Icon icon={status.desc?.icon} size={48} />{" "}
          <Stack direction="vertical" gap={5}>
            <span>{status.desc?.name}</span>
            <code className={styles.type}>{status.type}</code>
          </Stack>
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
      <Stack.Item className={styles.flavorText}>
        {status.desc.flavorText}
      </Stack.Item>
    </Stack>
  );
};
