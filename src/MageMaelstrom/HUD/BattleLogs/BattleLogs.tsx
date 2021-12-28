import React, { useEffect, useRef } from "react";
import { BattleLogEvent, LogType } from "../../Logging/logs";
import { AttackLogDisplay } from "./Logs/AttackLogDisplay";
import styles from "./BattleLogs.module.css";
import { VictoryLogDisplay } from "./Logs/VictoryLogDisplay";
import { useLogging } from "../../Logging/LoggingProvider";
import { SpellLogDisplay } from "./Logs/SpellLogDisplay";
import { DanceLogDisplay } from "./Logs/DanceLogDisplay";

export interface BattleLogsProps {}

export const BattleLogs: React.FC<BattleLogsProps> = ({}) => {
  const { logs } = useLogging();

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
      case LogType.Spell:
        return <SpellLogDisplay log={log} />;
      case LogType.Dance:
        return <DanceLogDisplay log={log} />;
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
