import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { teams } from "./Teams";

function App() {
  return (
    <GameManagerProvider arenaWidth={20} arenaHeight={20}>
      <MageMaelstrom teams={teams} />
    </GameManagerProvider>
  );
}

export default App;
