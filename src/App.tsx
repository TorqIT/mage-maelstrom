import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { teams } from "./Teams";

function App() {
  return (
    <GameManagerProvider
      specs={{
        arena: {
          width: 18,
          height: 14,
        },
        stats: {
          healthPerStrength: 10,
          healthRegenPerStrength: 0.5,
          agilityBonus: 1.03,
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
