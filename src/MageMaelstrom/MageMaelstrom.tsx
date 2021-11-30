import React, { useEffect } from "react";
import { Arena } from "./Arena";
import { Team } from "./Combatant";
import { Stack } from "./Common";
import { TeamDisplay, TeamSelector } from "./HUD";
import { useGameManager } from "./Logic";
import styles from "./MageMaelstrom.module.css";

export interface MageMaelstromProps {
  teams: Team[];
}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({ teams }) => {
  const { leftTeam, rightTeam, startGame } = useGameManager();

  return (
    <div id={styles.mageMaelstrom}>
      <div style={{ paddingTop: 70 }}>
        {(!leftTeam || !rightTeam) && <TeamSelector teams={teams} />}
        {leftTeam && rightTeam && (
          <Stack alignment="middle" stretch>
            <>
              <TeamDisplay team={leftTeam} />
              <Arena />
              <TeamDisplay team={rightTeam} />
            </>
          </Stack>
        )}
      </div>
    </div>
  );
};
