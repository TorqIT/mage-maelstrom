import React, { useEffect, useState } from "react";
import { ReadonlyActiveTeam } from "../../Combatant";
import { Modal, Stack } from "../../Common";
import { useGameManager } from "../../Logic";
import { useSimulation } from "../../Logic/SimulationProvider";
import styles from "./SimulationModal.module.css";

export interface SimulationModalProps {}

interface WinCounterProps {
  team?: ReadonlyActiveTeam;
  wins: number;
}

const WinCounter: React.FC<WinCounterProps> = ({ team, wins }) => {
  return (
    <Stack direction="vertical" alignment="middle" gap={20}>
      <Stack
        className={styles.barWrapper}
        style={{ justifyContent: "center", alignItems: "end" }}
        gap={20}
      >
        <div className={styles.bar} style={{ height: wins * 2 }}></div>
        <div className={styles.winCounter}>{wins}</div>
      </Stack>
      <div className={styles.teamTitle}>{team ? team.name : "DRAWS"}</div>
    </Stack>
  );
};

export const SimulationModal: React.FC<SimulationModalProps> = ({}) => {
  const { isSimulating, leftWins, rightWins, draws } = useSimulation();
  const { leftTeam, rightTeam } = useGameManager();
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

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onCloseRequested={tryToClose}
      hideClose={isSimulating}
    >
      <Stack>
        <WinCounter team={leftTeam} wins={leftWins} />
        <WinCounter team={rightTeam} wins={rightWins} />
        {draws > 0 && <WinCounter wins={draws} />}
      </Stack>
    </Modal>
  );
};
