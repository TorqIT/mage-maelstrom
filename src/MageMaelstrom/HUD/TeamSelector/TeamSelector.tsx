import classNames from "classnames";
import React, { useState } from "react";
import { Team } from "../..";
import { Stack } from "../../Common";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";
import { SelectableTeam } from "./SelectableTeam";
import styles from "./TeamSelector.module.css";

export interface TeamSelectorProps {
  teams: Team[];
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ teams }) => {
  const [left, setLeft] = useState<Team>();
  const [right, setRight] = useState<Team>();

  const { startGame } = useGameManager();

  const clickTeam = (team: Team) => {
    if (!left) {
      setLeft(team);
    } else if (!right) {
      setRight(team);
    }
  };

  return (
    <div>
      <Stack alignment="middle">
        <Stack.Item></Stack.Item>
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
          {teams.map((t) => (
            <SelectableTeam
              key={t.name}
              team={t}
              onClick={() => clickTeam(t)}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
};
