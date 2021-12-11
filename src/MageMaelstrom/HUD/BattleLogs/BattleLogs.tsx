import React, { useEffect, useRef } from "react";
import { useGameManager } from "../../Logic";
import { BattleLogEvent, LogType } from "../../Logic/logs";
import { AttackLogDisplay } from "./AttackLogDisplay";
import styles from "./BattleLogs.module.css";
import { VictoryLogDisplay } from "./VictoryLogDisplay";

export interface BattleLogsProps {}

export const BattleLogs: React.FC<BattleLogsProps> = ({}) => {
  const { logs } = useGameManager();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [logs]);

  const renderLog = (log: BattleLogEvent) => {
    switch (log.type) {
      case LogType.Victory:
        return <VictoryLogDisplay log={log} />;
      case LogType.Attack:
        return <AttackLogDisplay log={log} />;
    }
  };

  return (
    <div className={styles.wrapper}>
      {logs.map((l) => (
        <div key={l.id} className={styles.log}>
          {renderLog(l)}
        </div>
      ))}
      <div ref={scrollRef}></div>
    </div>
  );
};
