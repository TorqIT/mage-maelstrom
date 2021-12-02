import React from "react";
import { Arena } from "../../Arena";
import { Stack } from "../../Common";
import { TeamDisplay } from "..";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";

export interface BattleProps {}

export const Battle: React.FC<BattleProps> = ({}) => {
  const { leftTeam, rightTeam, tick, currentTick, toggleLooping } =
    useGameManager();

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <div>
      <Stack gap="gutter" alignment="middle">
        <div className="mageMaelstromTitle" style={{ padding: "30px 0px" }}>
          Mage Maelstrom
        </div>
        <Stack gap={20}>
          <NiceButton onClick={tick}>Tick: {currentTick}</NiceButton>
          <NiceButton onClick={toggleLooping}>Toggle Looping</NiceButton>
        </Stack>
      </Stack>

      <Stack alignment="middle" stretch>
        <TeamDisplay team={leftTeam} />
        <Arena />
        <TeamDisplay team={rightTeam} />
      </Stack>
    </div>
  );
};
