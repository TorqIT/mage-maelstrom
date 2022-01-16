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
          <Icon icon={status.desc?.icon} size={48} /> {status.desc?.name}
        </Stack>
      </Stack.Item>
      <Stack.Item>{status.desc.description}</Stack.Item>
      <Stack.Item className={styles.flavorText}>
        {status.desc.flavorText}
      </Stack.Item>
    </Stack>
  );
};
