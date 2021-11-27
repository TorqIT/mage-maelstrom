import React from "react";
import { Arena } from "./Arena";
import { ActiveTeam, Entrant } from "./Combatant";
import styles from "./MageMaelstrom.module.css";

const teams: ActiveTeam[] = [
  {
    name: "a",
    color: "#c00",
    entrants: [
      {
        combatant: { name: "a", icon: "/burst.png" },
        status: { coord: { x: 10, y: 9 } },
      },
      {
        combatant: { name: "a", icon: "/burst.png" },
        status: { coord: { x: 5, y: 15 } },
      },
    ],
  },
  {
    name: "a",
    color: "#00c",
    entrants: [
      {
        combatant: { name: "a", icon: "/burst.png" },
        status: { coord: { x: 2, y: 2 } },
      },
      {
        combatant: { name: "a", icon: "/burst.png" },
        status: { coord: { x: 1, y: 0 } },
      },
    ],
  },
];

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  return (
    <div id={styles.mageMaelstrom}>
      <Arena width={20} height={20} teams={teams} />
    </div>
  );
};
