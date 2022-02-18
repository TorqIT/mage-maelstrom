import { nextId } from "../Common";
import {
  AttackLog,
  BattleLogEvent,
  DanceLog,
  DeathLog,
  LogType,
  SpellLog,
  VictoryLog,
} from "./logs";

type OnChangeListener = (logs: BattleLogEvent[]) => void;

class LoggingManager {
  private logs: BattleLogEvent[] = [];
  private onChange?: OnChangeListener;

  private enabled = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setOnChange(onChange: OnChangeListener) {
    this.onChange = onChange;
  }

  public clearOnChange() {
    this.onChange = undefined;
  }

  public clear() {
    this.logs = [];
    this.changed();
  }

  public logAttack(log: Omit<AttackLog, "id" | "type">) {
    this.logs.push({
      ...log,
      id: nextId(),
      type: LogType.Attack,
    });

    this.changed();
  }

  public logSpell(log: Omit<SpellLog, "id" | "type">) {
    this.logs.push({
      ...log,
      id: nextId(),
      type: LogType.Spell,
    });

    this.changed();
  }

  public logVictory(log: Omit<VictoryLog, "id" | "type">) {
    this.logs.push({
      ...log,
      id: nextId(),
      type: LogType.Victory,
    });

    this.changed();
  }

  public logDance(log: Omit<DanceLog, "id" | "type">) {
    this.logs.push({
      ...log,
      id: nextId(),
      type: LogType.Dance,
    });

    this.changed();
  }

  public logDeath(log: Omit<DeathLog, "id" | "type">) {
    this.logs.push({
      ...log,
      id: nextId(),
      type: LogType.Death,
    });

    this.changed();
  }

  private changed() {
    this.enabled && this.onChange && this.onChange(this.logs.slice());
  }
}

const loggingManager = new LoggingManager();

export { loggingManager };
