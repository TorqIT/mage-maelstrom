import React from "react";
import styles from "./Modal.module.css";

export interface ModalProps {
  visible?: boolean;
  width?: number | string;
  hideClose?: boolean;
  onCloseRequested?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  width,
  hideClose,
  onCloseRequested,
  children,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className={styles.background} onClick={onCloseRequested}>
      <div
        className={styles.modal}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideClose && (
          <div className={styles.closer} onClick={onCloseRequested}>
            ✕
          </div>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
