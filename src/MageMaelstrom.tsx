import React from "react";
import { Arena } from "./Arena";
import { Entrant } from "./Combatant";
import styles from "./MageMaelstrom.module.css";

const entrants: Entrant[] = [
  {
    combatant: { name: "a", icon: "/burst.png" },
    status: { coord: { x: 10, y: 9 } },
  },
  {
    combatant: { name: "a", icon: "/burst.png" },
    status: { coord: { x: 5, y: 15 } },
  },
  {
    combatant: { name: "a", icon: "/burst.png" },
    status: { coord: { x: 2, y: 2 } },
  },
  {
    combatant: { name: "a", icon: "/burst.png" },
    status: { coord: { x: 1, y: 0 } },
  },
];

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  return (
    <div id={styles.mageMaelstrom}>
      <Arena width={20} height={20} entrants={entrants} />
    </div>
  );
};
