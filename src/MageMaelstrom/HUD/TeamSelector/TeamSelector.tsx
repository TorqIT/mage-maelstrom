import classNames from "classnames";
import React from "react";
import { Team } from "../..";
import { Stack } from "../../Common";
import { SelectableTeam } from "./SelectableTeam";
import styles from "./TeamSelector.module.css";

export interface TeamSelectorProps {
  teams: Team[];
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ teams }) => {
  return (
    <div>
      <Stack alignment="middle" gap={20}>
        <div className={classNames(styles.openSlot, styles.openTeamSlot)}></div>
        <div className={styles.versus}>VS</div>
        <div className={classNames(styles.openSlot, styles.openTeamSlot)}></div>
      </Stack>
      <div className={classNames(styles.openSlot, styles.pool)}>
        <Stack style={{ flexWrap: "wrap" }}>
          {teams.map((t) => (
            <SelectableTeam key={t.name} team={t} />
          ))}
        </Stack>
      </div>
    </div>
  );
};
