import React from "react";
import "./App.css";
import { GameManagerProvider } from "./Logic/GameManagerProvider";
import { MageMaelstrom } from "./MageMaelstrom";

function App() {
  return (
    <GameManagerProvider arenaWidth={20} arenaHeight={20}>
      <MageMaelstrom />
    </GameManagerProvider>
  );
}

export default App;
