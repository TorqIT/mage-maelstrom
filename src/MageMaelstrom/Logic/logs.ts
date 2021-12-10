import { ReadonlyActiveTeam } from "../Combatant";

export enum LogType {
  Victory,
}

export interface VictoryLog {
  type: LogType.Victory;
  team: ReadonlyActiveTeam | null;
}

export type BattleLogEvent = VictoryLog;
