import classNames from "classnames";
import React from "react";
import { Stack, Tooltip } from "../../../Common";
import { Icon, mmMusic } from "../../../Common/Icon";
import { DanceLog } from "../../../Logic";
import { CombatantIcon } from "../../CombatantIcon";
import styles from "./LogDisplay.module.css";

export interface DanceLogDisplayProps {
  log: DanceLog;
}

export const DanceLogDisplay = React.memo<DanceLogDisplayProps>(({ log }) => {
  return (
    <Tooltip
      disabled={log.error == null}
      content={log.error}
      className={classNames({ [styles.error]: log.error })}
    >
      <Stack gap="evenly">
        <Icon icon={mmMusic} size={28} />
        <CombatantIcon {...log.dancer} size={28} />
        <Icon icon={mmMusic} size={28} />
      </Stack>
    </Tooltip>
  );
});
