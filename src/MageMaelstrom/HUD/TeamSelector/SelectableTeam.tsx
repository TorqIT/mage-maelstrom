import classNames from "classnames";
import React, { useMemo } from "react";
import { CombatantIcon } from "..";
import { IdentifiedTeam } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import { Icon, mmWarning } from "../../Common/Icon";
import { GameSpecs, useGameManager } from "../../Logic";
import { useGameSpecs } from "../../Logic/GameSpecsProvider";
import styles from "./SelectableTeam.module.css";

export interface SelectableTeamProps {
  team: IdentifiedTeam;
  errors?: string[];
  warnings?: string[];
  onClick?: () => void;
}

export const SelectableTeam: React.FC<SelectableTeamProps> = ({
  team,
  errors,
  warnings,
  onClick,
}) => {
  const specs = useGameSpecs();
  const isSelectable = errors == null || errors?.length === 0;

  const intializedCombatants = useMemo(
    () =>
      team.CombatantSubclasses.map((SubCombatant) => new SubCombatant(specs)),
    [team, specs]
  );

  return (
    <Tooltip
      content={
        <ul style={{ paddingLeft: 20 }}>
          {errors?.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      }
      disabled={isSelectable}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.disabled]: !isSelectable,
        })}
        onClick={isSelectable ? onClick : undefined}
      >
        <div className={styles.name}>{team.name}</div>

        <Stack gap={20} alignment="middle">
          {intializedCombatants.map((c) => {
            const def = c.getDef();

            return (
              <CombatantIcon
                key={c?.getId()}
                name={def.name}
                icon={def.icon}
                color={team.color}
                size={100}
              />
            );
          })}
          {warnings && warnings.length > 0 && (!errors || errors.length === 0) && (
            <Tooltip
              content={
                <ul style={{ paddingLeft: 20 }}>
                  {warnings?.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              }
            >
              <Icon icon={mmWarning} size={64} />
            </Tooltip>
          )}
        </Stack>
      </div>
    </Tooltip>
  );
};
