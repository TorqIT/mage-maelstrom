import React from "react";
import styles from "./HealthBar.module.css";

export interface HealthBarProps {
  max: number;
  health: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ max, health }) => {
  const displayHealth = Math.ceil(health);

  return (
    <div className={styles.healthBar}>
      <div
        style={{
          position: "absolute",
          top: -1,
          left: 10,
          color: "white",
        }}
      >
        {displayHealth}
        <span className={styles.tiny}>/{max}</span>
      </div>
      <div
        className={styles.filledHealthBar}
        style={{ width: (health / max) * 100 + "%" }}
      >
        <div
          style={{
            position: "absolute",
            top: -1,
            left: 10,
            color: "black",
          }}
        >
          {displayHealth}
          <span className={styles.tiny}>/{max}</span>
        </div>
      </div>
    </div>
  );
};
