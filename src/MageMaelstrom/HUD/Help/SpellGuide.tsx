import React from "react";
import { ExtendedSpellStatus } from "../../Combatant";
import { Stack } from "../../Common";
import { Icon, mmCooldownTimer, mmManaCost, mmRange } from "../../Common/Icon";

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
        <Stack alignment="middle" gap={10} style={{ justifyContent: "start" }}>
          <Icon icon={status.desc?.icon} size={48} /> {status.desc?.name}
        </Stack>
      </Stack.Item>
      <Stack.Item>{status.desc.description}</Stack.Item>
      <Stack.Item>
        <Stack gap={20}>
          <Stack alignment="middle" gap={4}>
            <Icon icon={mmCooldownTimer} size={20} />
            {status.cooldown < 9999999 ? status.cooldown / 100 + "s" : "∞"}
          </Stack>
          {status.manaCost > 0 && (
            <Stack alignment="middle" gap={4}>
              <Icon icon={mmManaCost} size={20} />
              {status.manaCost}
            </Stack>
          )}

          {status.range && (
            <Stack alignment="middle" gap={4}>
              <Icon icon={mmRange} size={20} />
              {status.range}
            </Stack>
          )}
        </Stack>
      </Stack.Item>
    </Stack>
  );
};
