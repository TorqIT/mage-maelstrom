import React from "react";
import styles from "./HealthBar.module.css";

export interface HealthBarProps {
  max: number;
  value: number;
  regen: number;
  color?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  max,
  value,
  color,
  regen,
}) => {
  const clampedValue = Math.max(0, value);
  const displayValue = Math.ceil(clampedValue);

  const renderNumbers = () => {
    return (
      <span>
        {displayValue}
        <span className={styles.tiny}>
          /{max} (+{regen})
        </span>
      </span>
    );
  };

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
        {renderNumbers()}
      </div>
      <div
        className={styles.filledHealthBar}
        style={{
          width: (clampedValue / max) * 100 + "%",
          backgroundColor: color,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -1,
            left: 10,
            color: "black",
          }}
        >
          {renderNumbers()}
        </div>
      </div>
    </div>
  );
};
