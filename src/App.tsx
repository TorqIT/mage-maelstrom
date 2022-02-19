import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { LoggingProvider } from "./MageMaelstrom/Logging";
import { GameSpecsProvider } from "./MageMaelstrom/Logic/GameSpecsProvider";
import { SimulationProvider } from "./MageMaelstrom/Logic/SimulationProvider";
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
          maxAbilities: 4,
        },
        suddenDeath: {
          start: 15000,
          delay: 10,
          radius: 3.5,
          flatDamage: 15,
          percentDamage: 0.15,
        },
        arena: {
          width: 14,
          height: 10,
        },
        stats: {
          baseHealth: 180,
          baseHealthRegen: 0.3,
          healthPerStrength: 10,
          healthRegenPerStrength: 0.18,
          slowdownPerStrength: 0.008,

          baseAttackPeriod: 120,
          agilityBonus: 0.04,

          baseMana: 10,
          baseManaRegen: 0.1,
          manaPerInt: 5,
          manaRegenPerInt: 0.05,

          baseDamage: 10,
          vision: 3.5,
        },
      }}
    >
      <TeamSelectionProvider teams={teams}>
        <LoggingProvider>
          <GameManagerProvider>
            <SimulationProvider>
              <MageMaelstrom />
            </SimulationProvider>
          </GameManagerProvider>
        </LoggingProvider>
      </TeamSelectionProvider>
    </GameSpecsProvider>
  );
}

export default App;
