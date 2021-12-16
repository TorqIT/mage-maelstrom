import { IconDef } from "../Common/Icon/Icons";

export enum LogType {
  Attack,
  Spell,
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

export interface SpellLog extends BaseLog {
  type: LogType.Spell;
  attacker: number;
  target?: number;
  damage: number;
  remainingHealth: number;
  spellIcon: IconDef;
}

export type BattleLogEvent = VictoryLog | AttackLog | SpellLog;
