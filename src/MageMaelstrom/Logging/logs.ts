import { IconDef } from "../Common/Icon/Icons";

export enum LogType {
  Attack,
  Spell,
  Victory,
  Dance,
  Death,
}

export interface CombatantInfo {
  name: string;
  icon: string;
  color: string;
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
  attacker: CombatantInfo;
  target: CombatantInfo;
  damage: number;
  remainingHealth: number;
  isCrit: boolean;
}

export interface SpellLog extends BaseLog {
  type: LogType.Spell;
  caster: CombatantInfo;
  target?: CombatantInfo;
  damage?: number;
  remainingHealth?: number;
  spellIcon: IconDef;
}

export interface DanceLog extends BaseLog {
  type: LogType.Dance;
  dancer: CombatantInfo;
  error?: string;
}

export interface DeathLog extends BaseLog {
  type: LogType.Death;
  entrant: CombatantInfo;
}

export type BattleLogEvent =
  | VictoryLog
  | AttackLog
  | SpellLog
  | DanceLog
  | DeathLog;
