import React, { useEffect, useState } from "react";
import { Modal } from "../../Common";
import { useSimulation } from "../../Logic/SimulationProvider";

export interface SimulationModalProps {}

export const SimulationModal: React.FC<SimulationModalProps> = ({}) => {
  const { isSimulating, leftWins, rightWins, draws } = useSimulation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isSimulating) {
      setVisible(true);
    }
  }, [isSimulating]);

  const tryToClose = () => {
    if (!isSimulating) {
      setVisible(false);
    }
  };

  return (
    <Modal visible={visible} onCloseRequested={tryToClose}>
      <div>left: {leftWins}</div>
      <div>right: {rightWins}</div>
      <div>draws: {draws}</div>
    </Modal>
  );
};
