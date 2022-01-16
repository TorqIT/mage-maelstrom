import React from "react";
import { AbilityStatus, ExtendedSpellStatus } from "../../Combatant";
import { categorizedAbilityDefs } from "../../Combatant/Ability/abilityDefs";
import { Stack } from "../../Common";
import { SpellGuide } from "./SpellGuide";
import styles from "./AbilityGuide.module.css";
import { PassiveGuide } from "./PassiveGuide";

export interface AbilityGuideProps {}

export const AbilityGuide = React.memo<AbilityGuideProps>(({}) => {
  return (
    <div>
      {categorizedAbilityDefs.map((c) => (
        <div key={c.category}>
          <h1>
            {c.category.charAt(0).toUpperCase() + c.category.substring(1)}
          </h1>
          <Stack direction="vertical" gap={50} stretch>
            <div>
              <div className={styles.subCategory}>Spells</div>
              <Stack direction="vertical" stretch>
                {c.spells.map((a) => (
                  <div key={a.type} className={styles.ability}>
                    <SpellGuide status={a} />
                  </div>
                ))}
              </Stack>
            </div>
            {c.passives.length > 0 && (
              <div>
                <div className={styles.subCategory}>Passives</div>
                <Stack direction="vertical" stretch>
                  {c.passives.map((a) => (
                    <div key={a.type} className={styles.ability}>
                      <PassiveGuide status={a} />
                    </div>
                  ))}
                </Stack>
              </div>
            )}
          </Stack>
        </div>
      ))}
    </div>
  );
});
