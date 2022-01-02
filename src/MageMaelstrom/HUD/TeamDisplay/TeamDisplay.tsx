import React from "react";
import { ReadonlyActiveTeam } from "../../Combatant";
import { Icon, mmHidden, mmVisible } from "../../Common/Icon";
import { EntrantDisplay } from "./EntrantDisplay";
import { SummonDisplay } from "./SummonDisplay";
import styles from "./TeamDisplay.module.css";

export interface TeamDisplayProps {
  team: ReadonlyActiveTeam;
  visible: boolean;
  onToggle?: () => void;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  visible,
  onToggle,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.visibilityToggle} onClick={onToggle}>
        <Icon icon={visible ? mmVisible : mmHidden} size={24} />
      </div>
      <div className={styles.name}>{team.name}</div>
      <div className={styles.list}>
        {team.entrants.map((e) =>
          e.essential ? (
            <EntrantDisplay key={e.status.id} entrant={e} flip={team.flip} />
          ) : (
            <SummonDisplay key={e.status.id} entrant={e} flip={team.flip} />
          )
        )}
      </div>
    </div>
  );
};
