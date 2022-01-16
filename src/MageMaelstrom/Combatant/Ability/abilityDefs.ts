import {
  AbilityStatus,
  buildPassive,
  buildSpell,
  ExtendedSpellStatus,
  isPassive,
  passiveTypeArray,
  spellTypeArray,
} from ".";
import { CategorizedDescriptiveIcon } from "..";

const abilityDefs = passiveTypeArray
  .map((p) => buildPassive(p).toReadonly())
  .concat(spellTypeArray.map((s) => buildSpell(s).toExtendedReadonly()));

interface AbilityGroup {
  category: CategorizedDescriptiveIcon["category"];
  passives: AbilityStatus[];
  spells: ExtendedSpellStatus[];
}

const categorizedAbilityDefs = abilityDefs.reduce((groups, current) => {
  if (!current.desc) {
    return groups.slice();
  }

  let group = groups.find((g) => g.category === current.desc?.category);

  if (!group) {
    group = { category: current.desc.category, passives: [], spells: [] };
    groups.push(group);
  }

  if (isPassive(current.type)) {
    group.passives.push(current);
  } else {
    group.spells.push(current as ExtendedSpellStatus);
  }

  return groups.slice();
}, [] as AbilityGroup[]);

categorizedAbilityDefs.sort((f, s) => f.category.localeCompare(s.category));

categorizedAbilityDefs.forEach((g) => {
  g.spells.sort((f, s) => f.desc?.name.localeCompare(s.desc?.name ?? "") ?? 0);
  g.passives.sort(
    (f, s) => f.desc?.name.localeCompare(s.desc?.name ?? "") ?? 0
  );
});

export { categorizedAbilityDefs };
