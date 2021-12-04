import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { teams } from "./Teams";

function App() {
  return (
    <GameManagerProvider
      specs={{
        rules: {
          maxCombatants: 2,
          minStat: 5,
          maxTotalStats: 50,
        },
        arena: {
          width: 16,
          height: 12,
        },
        stats: {
          healthPerStrength: 10,
          healthRegenPerStrength: 0.5,
          agilityBonus: 1.035,
          manaPerInt: 7,
          manaRegenPerInt: 0.1,
        },
      }}
    >
      <MageMaelstrom teams={teams} />
    </GameManagerProvider>
  );
}

export default App;
