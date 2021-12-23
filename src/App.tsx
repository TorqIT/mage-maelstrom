import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { LoggingProvider } from "./MageMaelstrom/Logging";
import { GameSpecsProvider } from "./MageMaelstrom/Logic/GameSpecsProvider";
import { TeamSelectionProvider } from "./MageMaelstrom/Logic/TeamSelectionProvider";
import { teams } from "./Teams";

function App() {
  return (
    <GameSpecsProvider
      specs={{
        rules: {
          maxCombatants: 2,
          minStat: 5,
          maxTotalStats: 40,
        },
        arena: {
          width: 14,
          height: 10,
        },
        stats: {
          healthPerStrength: 12,
          healthRegenPerStrength: 0.22,
          agilityBonus: 1.04,
          manaPerInt: 7,
          manaRegenPerInt: 0.1,
          vision: 3.5,
        },
      }}
    >
      <TeamSelectionProvider>
        <LoggingProvider>
          <GameManagerProvider>
            <MageMaelstrom teams={teams} />
          </GameManagerProvider>
        </LoggingProvider>
      </TeamSelectionProvider>
    </GameSpecsProvider>
  );
}

export default App;
