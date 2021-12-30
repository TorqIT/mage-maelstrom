import React from "react";
import { Arena } from "../../Arena";
import { Stack } from "../../Common";
import { TeamDisplay } from "..";
import { useGameManager } from "../../Logic";
import { NiceButton } from "../NiceButton";
import { BattleLogs } from "../BattleLogs";
import { Controls } from "./Controls";

export interface BattleProps {}

export const Battle: React.FC<BattleProps> = ({}) => {
  const { leftTeam, rightTeam, clearGame, restartGame } = useGameManager();

  if (!leftTeam || !rightTeam) {
    return null;
  }

  return (
    <div style={{ padding: "0px 40px" }}>
      <Stack alignment="middle" gap={50}>
        <div
          className="mageMaelstromTitle"
          style={{ padding: "30px 0px", textAlign: "center" }}
        >
          Mage Maelstrom
        </div>
        <Stack.Item>
          <Stack alignment="end">
            <Stack gap={20}>
              <NiceButton onClick={restartGame}>Restart Game</NiceButton>
              <NiceButton onClick={clearGame}>New Game</NiceButton>
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>

      <Stack gap={30} alignment="middle" stretch>
        <Stack.Item>
          <Stack direction="vertical" stretch gap={20}>
            <Controls />
            <Stack stretch gap={5}>
              <Stack.Item>
                <TeamDisplay team={leftTeam} />
              </Stack.Item>
              <Arena />
              <Stack.Item>
                <TeamDisplay team={rightTeam} />
              </Stack.Item>
            </Stack>
          </Stack>
        </Stack.Item>

        <Stack.Item size={0.25}>
          <BattleLogs />
        </Stack.Item>
      </Stack>
    </div>
  );
};
