import React, { useEffect } from "react";
import { Arena } from "./Arena";
import { Team } from "./Combatant";
import { Stack } from "./Common";
import { TeamDisplay } from "./HUD";
import { useGameManager } from "./Logic";
import styles from "./MageMaelstrom.module.css";

const left: Team = {
  name: "a",
  color: "#c00",
  combatants: [
    { name: "a", icon: "/burst.png" },
    { name: "a", icon: "/burst.png" },
  ],
};

const right: Team = {
  name: "a",
  color: "#00c",
  combatants: [
    { name: "a", icon: "/burst.png" },
    { name: "a", icon: "/burst.png" },
  ],
};

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  const { leftTeam, rightTeam, startGame } = useGameManager();

  useEffect(() => {
    startGame(left, right);
  }, [startGame]);

  return (
    <div id={styles.mageMaelstrom}>
      <div style={{ paddingTop: 70 }}>
        <Stack alignment="middle" stretch>
          <TeamDisplay team={leftTeam} />
          <Arena />
          <TeamDisplay team={rightTeam} />
        </Stack>
      </div>
    </div>
  );
};
