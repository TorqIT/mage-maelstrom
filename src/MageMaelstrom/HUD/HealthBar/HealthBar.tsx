import React from "react";
import styles from "./HealthBar.module.css";

export interface HealthBarProps {
  max: number;
  value: number;
  regen: number;
  color?: string;
  roundTo: "floor" | "ceil";
}

export const HealthBar: React.FC<HealthBarProps> = ({
  max,
  value,
  color,
  regen,
  roundTo,
}) => {
  const clampedValue = Math.max(0, value);
  const displayValue =
    roundTo === "ceil" ? Math.ceil(clampedValue) : Math.floor(clampedValue);

  const renderNumbers = () => {
    return (
      <span>
        {displayValue}
        <span className={styles.tiny}>
          /{max} (+{parseFloat(regen.toFixed(2))})
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
