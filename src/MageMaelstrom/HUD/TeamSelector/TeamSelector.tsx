import classNames from "classnames";
import React, { useMemo, useRef, useState } from "react";
import { Team } from "../..";
import { IdentifiedTeam } from "../../Combatant";
import { Stack } from "../../Common";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";
import { SelectableTeam } from "./SelectableTeam";
import styles from "./TeamSelector.module.css";

export interface TeamSelectorProps {
  teams: Team[];
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ teams }) => {
  const [left, setLeft] = useState<IdentifiedTeam>();
  const [right, setRight] = useState<IdentifiedTeam>();

  const idCounterRef = useRef(1);

  const identifiedTeams = useMemo(
    () =>
      teams.map(
        (t): IdentifiedTeam => ({
          ...t,
          id: idCounterRef.current++,
          combatants: t.combatants.map((c) => ({
            ...c,
            id: idCounterRef.current++,
          })),
        })
      ),
    [teams]
  );

  const { startGame } = useGameManager();

  const clickTeam = (team: IdentifiedTeam) => {
    if (!left) {
      setLeft(team);
    } else if (!right) {
      setRight(team);
    }
  };

  return (
    <div>
      <Stack alignment="middle">
        <Stack.Item>
          <div className="mageMaelstromTitle">Mage Maelstrom</div>
        </Stack.Item>
        <Stack.Item>
          <Stack alignment="middle" gap={20}>
            <div className={classNames(styles.openSlot, styles.openTeamSlot)}>
              {left && (
                <SelectableTeam
                  team={left}
                  onClick={() => setLeft(undefined)}
                />
              )}
            </div>
            <div className={styles.versus}>VS</div>
            <div className={classNames(styles.openSlot, styles.openTeamSlot)}>
              {right && (
                <SelectableTeam
                  team={right}
                  onClick={() => setRight(undefined)}
                />
              )}
            </div>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Stack alignment="middle">
            {left && right && (
              <NiceButton large onClick={() => startGame(left, right)}>
                Commence Battle
              </NiceButton>
            )}
          </Stack>
        </Stack.Item>
      </Stack>
      <div className={classNames(styles.openSlot, styles.pool)}>
        <Stack style={{ flexWrap: "wrap" }}>
          {identifiedTeams.map((t) => (
            <SelectableTeam key={t.id} team={t} onClick={() => clickTeam(t)} />
          ))}
        </Stack>
      </div>
    </div>
  );
};
