import React from "react";
import { Arena } from "../../Arena";
import { Stack } from "../../Common";
import { TeamDisplay } from "..";
import { useGameManager } from "../../Logic";

export interface BattleProps {}

export const Battle: React.FC<BattleProps> = ({}) => {
  const { leftTeam, rightTeam } = useGameManager();

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <div>
      <div className="mageMaelstromTitle" style={{ padding: "30px 0px" }}>
        Mage Maelstrom
      </div>
      <Stack alignment="middle" stretch>
        <TeamDisplay team={leftTeam} />
        <Arena />
        <TeamDisplay team={rightTeam} />
      </Stack>
    </div>
  );
};
