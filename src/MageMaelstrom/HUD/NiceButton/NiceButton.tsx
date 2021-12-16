import classNames from "classnames";
import React from "react";
import styles from "./NiceButton.module.css";

interface IProps {
  large?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const NiceButton: React.FC<IProps> = ({
  large,
  pressed,
  onClick,
  disabled,
  style,
  children,
}) => {
  return (
    <button
      className={classNames(styles.niceButton, {
        [styles.large]: large,
        [styles.pressedIn]: pressed,
      })}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

NiceButton.displayName = "NiceButton";
export { NiceButton };
