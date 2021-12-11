export enum LogType {
  Attack,
  Victory,
}

export interface BaseLog {
  id: number;
}

export interface VictoryLog extends BaseLog {
  type: LogType.Victory;
  teamId: number | null;
}

export interface AttackLog extends BaseLog {
  type: LogType.Attack;
  attacker: number;
  target: number;
  damage: number;
  remainingHealth: number;
}

export type BattleLogEvent = VictoryLog | AttackLog;
