import React from "react";
import { Arena } from "./Arena";
import styles from "./MageMaelstrom.module.css";

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  return (
    <div id={styles.mageMaelstrom}>
      <Arena width={20} height={20} />
    </div>
  );
};
