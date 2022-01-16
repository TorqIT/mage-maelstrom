import {
  AbilityStatus,
  buildPassive,
  buildSpell,
  passiveTypeArray,
  spellTypeArray,
} from ".";
import { CategorizedDescriptiveIcon } from "..";

const abilityDefs = passiveTypeArray
  .map((p) => buildPassive(p).toReadonly())
  .concat(spellTypeArray.map((s) => buildSpell(s).toExtendedReadonly()));

export const categorizedAbilityDefs = abilityDefs.reduce((groups, current) => {
  if (!current.desc) {
    return groups.slice();
  }

  const group = groups.find((g) => g.category === current.desc?.category);

  if (group) {
    group.abilities.push(current);
  } else {
    groups.push({ category: current.desc.category, abilities: [current] });
  }

  return groups.slice();
}, [] as { category: CategorizedDescriptiveIcon["category"]; abilities: AbilityStatus[] }[]);
