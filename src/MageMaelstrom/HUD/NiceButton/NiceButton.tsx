import classNames from "classnames";
import React from "react";
import styles from "./NiceButton.module.css";

interface IProps {
  large?: boolean;
  pressed?: boolean;
  onClick?: () => void;
}

const NiceButton: React.FC<IProps> = ({
  large,
  pressed,
  onClick,
  children,
}) => {
  return (
    <button
      className={classNames(styles.niceButton, {
        [styles.large]: large,
        [styles.pressedIn]: pressed,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

NiceButton.displayName = "NiceButton";
export { NiceButton };
