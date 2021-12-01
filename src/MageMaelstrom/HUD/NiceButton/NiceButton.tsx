import classNames from "classnames";
import React from "react";
import styles from "./NiceButton.module.css";

interface IProps {
  large?: boolean;
  onClick?: () => void;
}

const NiceButton: React.FC<IProps> = ({ large, onClick, children }) => {
  return (
    <button
      className={classNames(styles.niceButton, { [styles.large]: large })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

NiceButton.displayName = "NiceButton";
export { NiceButton };
