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
            width: 16,
            height: 12,
          },
          stats: {
            healthPerStrength: 12,
            healthRegenPerStrength: 0.25,
            agilityBonus: 1.035,
            manaPerInt: 7,
            manaRegenPerInt: 0.1,
          },
        }}
      >
        <MageMaelstrom teams={teams} />
      </GameManagerProvider>
    </LoggingProvider>
  );
}

export default App;
