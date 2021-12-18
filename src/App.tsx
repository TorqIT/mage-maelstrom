import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { LoggingProvider } from "./MageMaelstrom/Logging";
import { teams } from "./Teams";

function App() {
  return (
    <LoggingProvider>
      <GameManagerProvider
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
            vision: 4,
          },
        }}
      >
        <MageMaelstrom teams={teams} />
      </GameManagerProvider>
    </LoggingProvider>
  );
}

export default App;
