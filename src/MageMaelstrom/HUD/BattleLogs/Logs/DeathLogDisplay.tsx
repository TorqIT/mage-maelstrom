import React from "react";
import { CombatantIcon } from "../..";
import { Stack } from "../../../Common";
import { Icon, mmSkull } from "../../../Common/Icon";
import { DeathLog } from "../../../Logic";

export interface DeathLogDisplayProps {
  log: DeathLog;
}

export const DeathLogDisplay: React.FC<DeathLogDisplayProps> = ({ log }) => {
  return (
    <Stack gap={10} alignment="middle">
      <Icon icon={mmSkull} size={78} />
      <CombatantIcon {...log.entrant} size={78} />
    </Stack>
  );
};
