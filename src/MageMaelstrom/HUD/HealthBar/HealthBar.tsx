import React from "react";
import { useResizeDetector } from "react-resize-detector";
import { Stack } from "../../Common";
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

  const { ref, width: barWidth } = useResizeDetector({ handleWidth: true });

  const renderNumbers = () => {
    return (
      <div
        style={{
          width: (barWidth ?? 20) - 20,
          height: "100%",
          padding: "0px 10px",
        }}
      >
        <Stack gap="apart" alignment="middle">
          <div>
            {displayValue} <span className={styles.tiny}>/{max}</span>
          </div>
          <div className={styles.tiny} style={{ marginLeft: 5 }}>
            (+{parseFloat(regen.toFixed(2))})
          </div>
        </Stack>
      </div>
    );
  };

  return (
    <div className={styles.healthBar}>
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
          color: "black",
        }}
      >
        {renderNumbers()}
      </div>
    </div>
  );
};
