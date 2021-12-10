import React from "react";
import { VictoryLog } from "../../Logic/logs";

export interface VictoryLogDisplayProps {
  log: VictoryLog;
}

export const VictoryLogDisplay: React.FC<VictoryLogDisplayProps> = ({
  log,
}) => {
  return <div>{log.team?.name} wins</div>;
};
