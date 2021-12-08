import React from "react";
import { Arena } from "../../Arena";
import { Stack } from "../../Common";
import { TeamDisplay } from "..";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";

export interface BattleProps {}

export const Battle: React.FC<BattleProps> = ({}) => {
  const {
    leftTeam,
    rightTeam,
    tick,
    tickUntilNextAction,
    currentTick,
    toggleLooping,
  } = useGameManager();

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <div>
      <Stack alignment="middle">
        <Stack.Item>
          <div
            className="mageMaelstromTitle"
            style={{ padding: "30px 0px", textAlign: "center" }}
          >
            Mage Maelstrom
          </div>
        </Stack.Item>
        <Stack.Item>
          <Stack gap={20} alignment="middle">
            <NiceButton onClick={tick}>Tick: {currentTick}</NiceButton>
            <NiceButton onClick={tickUntilNextAction}>Next Action</NiceButton>
            <NiceButton onClick={toggleLooping}>Toggle Looping</NiceButton>
          </Stack>
        </Stack.Item>
      </Stack>

      <Stack alignment="middle" stretch>
        <TeamDisplay team={leftTeam} />
        <Arena />
        <TeamDisplay team={rightTeam} />
      </Stack>
    </div>
  );
};
