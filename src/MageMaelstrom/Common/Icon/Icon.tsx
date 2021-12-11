import React from "react";
import styles from "./Icon.module.css";

export interface IconProps {
  icon: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ icon, size }) => {
  return (
    <img
      className={styles.colored}
      src={icon}
      alt="icon"
      style={size ? { width: size, height: size } : {}}
    />
  );
};
