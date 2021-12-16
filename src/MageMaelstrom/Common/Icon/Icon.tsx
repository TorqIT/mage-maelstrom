import classNames from "classnames";
import React from "react";
import styles from "./Icon.module.css";
import { IconDef } from "./Icons";

export interface IconProps {
  icon: IconDef;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ icon, size }) => {
  const sizeStyle: React.CSSProperties = size
    ? { width: size, height: size }
    : {};

  return (
    <img
      className={classNames(styles.colored, styles.icon)}
      src={icon.file}
      alt="icon"
      style={{ ...sizeStyle, filter: icon.filter }}
    />
  );
};
