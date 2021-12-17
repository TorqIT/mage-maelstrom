import { Poisoned } from "./Effects/poisoned";
import { StatusEffect, StatusEffectType } from "./statusEffect";

export function buildStatusEffect(type: StatusEffectType): StatusEffect {
  switch (type) {
    case "poison":
      return new Poisoned();
  }
}
