import React from "react";
import { Arena } from "./Arena";
import { ActiveTeam, Entrant } from "./Combatant";
import { Stack } from "./Common";
import { TeamDisplay } from "./HUD";
import styles from "./MageMaelstrom.module.css";

const leftTeam: ActiveTeam = {
  name: "a",
  color: "#c00",
  entrants: [
    {
      combatant: { name: "a", icon: "/burst.png" },
      status: { id: 0, coord: { x: 10, y: 9 } },
    },
    {
      combatant: { name: "a", icon: "/burst.png" },
      status: { id: 1, coord: { x: 5, y: 15 } },
    },
  ],
};

const rightTeam: ActiveTeam = {
  name: "a",
  color: "#00c",
  entrants: [
    {
      combatant: { name: "a", icon: "/burst.png" },
      status: { id: 2, coord: { x: 2, y: 2 } },
    },
    {
      combatant: { name: "a", icon: "/burst.png" },
      status: { id: 3, coord: { x: 1, y: 0 } },
    },
  ],
};

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  return (
    <div id={styles.mageMaelstrom}>
      <div style={{ paddingTop: 70 }}>
        <Stack alignment="middle" stretch>
          <TeamDisplay team={leftTeam} />
          <Arena width={20} height={20} teams={[leftTeam, rightTeam]} />
          <TeamDisplay team={rightTeam} />
        </Stack>
      </div>
    </div>
  );
};
