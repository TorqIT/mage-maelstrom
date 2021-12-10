import React from "react";
import { useGameManager } from "../../Logic";
import { BattleLogEvent, LogType } from "../../Logic/logs";
import styles from "./BattleLogs.module.css";
import { VictoryLogDisplay } from "./VictoryLogDisplay";

export interface BattleLogsProps {}

export const BattleLogs: React.FC<BattleLogsProps> = ({}) => {
  const { logs } = useGameManager();

  const getLogRenderer = (log: BattleLogEvent) => {
    switch (log.type) {
      case LogType.Victory:
        return VictoryLogDisplay;
    }
  };

  return (
    <div className={styles.wrapper}>
      {logs.map((l) => {
        const LogDisplay = getLogRenderer(l);

        return <LogDisplay log={l} />;
      })}
    </div>
  );
};
