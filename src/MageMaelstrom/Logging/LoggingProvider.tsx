import { createContext, useContext, useEffect, useState } from "react";
import { loggingManager } from "./loggingManager";
import { BattleLogEvent } from "./logs";

export interface LoggingData {
  logs: BattleLogEvent[];
}

const LoggingContext = createContext<LoggingData | null>(null);

export interface LoggingProviderProps {}

export const LoggingProvider: React.FC<LoggingProviderProps> = ({
  children,
}) => {
  const [logs, setLogs] = useState<BattleLogEvent[]>([]);

  useEffect(() => {
    loggingManager.setOnChange((l) => setLogs(l));

    return () => loggingManager.clearOnChange();
  }, []);

  return (
    <LoggingContext.Provider value={{ logs }}>
      {children}
    </LoggingContext.Provider>
  );
};

export function useLogging() {
  const result = useContext(LoggingContext);

  if (result === null) {
    throw new Error(
      "useLogging() cannot be used without being wrapped by a LoggingProvider"
    );
  }

  return result;
}
