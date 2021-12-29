import classNames from "classnames";
import React from "react";
import styles from "./Icon.module.css";
import { IconDef } from "./Icons";

export interface IconProps {
  icon: IconDef;
  inline?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ icon, size, style, inline }) => {
  const sizeStyle: React.CSSProperties = size
    ? { width: size, height: size }
    : {};

  return (
    <img
      className={classNames(styles.colored, styles.icon, {
        [styles.inline]: inline,
      })}
      src={icon.file}
      alt="icon"
      style={{ ...sizeStyle, filter: icon.filter, ...style }}
    />
  );
};
