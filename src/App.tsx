import React from "react";
import "./App.css";
import { GameManagerProvider, MageMaelstrom } from "./MageMaelstrom";
import { teams } from "./Teams";

function App() {
  return (
    <GameManagerProvider arenaWidth={16} arenaHeight={16}>
      <MageMaelstrom teams={teams} />
    </GameManagerProvider>
  );
}

export default App;
