import React from "react";
import styles from "./Modal.module.css";

export interface ModalProps {
  visible?: boolean;
  width?: number | string;
  onCloseRequested?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  width,
  onCloseRequested,
  children,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className={styles.background} onClick={onCloseRequested}>
      <div className={styles.modal} style={{ width }}>
        <div className={styles.closer}>✕</div>
        {children}
      </div>
    </div>
  );
};
