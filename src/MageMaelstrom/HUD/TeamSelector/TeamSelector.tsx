import classNames from "classnames";
import React, { useState } from "react";
import { Stack } from "../../Common";
import { useTeamSelection } from "../../Logic/TeamSelectionProvider";
import { Help } from "../Help";
import { NiceButton } from "../NiceButton";
import { SelectableTeam } from "./SelectableTeam";
import styles from "./TeamSelector.module.css";

export interface TeamSelectorProps {}

export const TeamSelector: React.FC<TeamSelectorProps> = ({}) => {
  const { teams } = useTeamSelection();

  const [left, setLeft] = useState<number>();
  const [right, setRight] = useState<number>();

  const { startGame } = useTeamSelection();

  const clickTeam = (index: number) => {
    if (left == null) {
      setLeft(index);
    } else if (right == null) {
      setRight(index);
    }
  };

  return (
    <div style={{ paddingTop: 30 }}>
      <Stack alignment="middle">
        <Stack.Item>
          <div className="mageMaelstromTitle">Mage Maelstrom</div>
        </Stack.Item>
        <Stack.Item>
          <Stack alignment="middle" gap={20}>
            <div className={classNames(styles.openSlot, styles.openTeamSlot)}>
              {left != null && (
                <SelectableTeam
                  team={teams[left].team}
                  onClick={() => setLeft(undefined)}
                />
              )}
            </div>
            <div className={styles.versus}>VS</div>
            <div className={classNames(styles.openSlot, styles.openTeamSlot)}>
              {right != null && (
                <SelectableTeam
                  team={teams[right].team}
                  onClick={() => setRight(undefined)}
                />
              )}
            </div>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Stack alignment="middle">
            {left != null && right != null && (
              <NiceButton large onClick={() => startGame(left, right)}>
                Commence Battle
              </NiceButton>
            )}
          </Stack>
        </Stack.Item>
      </Stack>
      <Stack className={styles.poolWrapper} gap={50} stretch>
        <Stack.Item>
          <div className={classNames(styles.openSlot, styles.pool)}>
            <Stack style={{ flexWrap: "wrap" }}>
              {teams.map((t, index) => (
                <SelectableTeam
                  key={t.team.id}
                  team={t.team}
                  errors={t.errors}
                  warnings={t.warnings}
                  onClick={() => clickTeam(index)}
                />
              ))}
            </Stack>
          </div>
        </Stack.Item>
        <Help vertical size={250} />
      </Stack>
    </div>
  );
};
