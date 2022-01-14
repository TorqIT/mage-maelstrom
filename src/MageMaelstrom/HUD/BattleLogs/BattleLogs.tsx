import React, { useCallback, useEffect, useRef } from "react";
import { BattleLogEvent, LogType } from "../../Logging/logs";
import { AttackLogDisplay } from "./Logs/AttackLogDisplay";
import styles from "./BattleLogs.module.css";
import { VictoryLogDisplay } from "./Logs/VictoryLogDisplay";
import { useLogging } from "../../Logging/LoggingProvider";
import { SpellLogDisplay } from "./Logs/SpellLogDisplay";
import { DanceLogDisplay } from "./Logs/DanceLogDisplay";
import { useVirtual } from "react-virtual";
import { DeathLogDisplay } from "./Logs/DeathLogDisplay";

export interface BattleLogsProps {}

export const BattleLogs: React.FC<BattleLogsProps> = ({}) => {
  const { logs } = useLogging();

  const parentRef = useRef<HTMLDivElement>(null);

  const estimateSize = useCallback(
    (index: number) => {
      switch (logs[index].type) {
        case LogType.Attack:
        case LogType.Spell:
          return 58;
        case LogType.Dance:
          return 54;
        case LogType.Victory:
          return 201;
        case LogType.Death:
          return 104;
      }
    },
    [logs]
  );

  const logVirtualizer = useVirtual({
    parentRef,
    size: logs.length,
    keyExtractor: (index) => logs[index].id,
    estimateSize,
  });

  useEffect(() => {
    logVirtualizer.scrollToIndex(logs.length - 1);
  }, [logs.length]);

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
      case LogType.Death:
        return <DeathLogDisplay log={log} />;
    }
  };

  return (
    <div ref={parentRef} className={styles.wrapper}>
      <div
        style={{
          height: logVirtualizer.totalSize,
          width: "100%",
          position: "relative",
        }}
      >
        {logVirtualizer.virtualItems.map((l) => (
          <div
            key={l.key}
            style={{
              position: "absolute",
              top: l.start,
              left: 0,
              width: "100%",
            }}
          >
            <div className={styles.log}>{renderLog(logs[l.index])}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
