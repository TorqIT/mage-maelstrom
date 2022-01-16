import React from "react";
import { categorizedAbilityDefs } from "../../Combatant/Ability/abilityDefs";

export interface SpellGuideProps {}

export const SpellGuide: React.FC<SpellGuideProps> = ({}) => {
  return (
    <div>
      {categorizedAbilityDefs.map((c) => (
        <div key={c.category}>
          <h1>{c.category}</h1>
          <div>
            {c.abilities.map((a) => (
              <div key={a.type}>{a.desc?.name}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
