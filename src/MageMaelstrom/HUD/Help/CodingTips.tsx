import React from "react";
import styles from "./CodingTips.module.css";

export interface CodingTipsProps {}

export const CodingTips: React.FC<CodingTipsProps> = ({}) => {
  return (
    <div className={styles.codingTips}>
      <h1>Combatant Overview</h1>
      <p>TO DO: write this after you playtest</p>
    </div>
  );
};
