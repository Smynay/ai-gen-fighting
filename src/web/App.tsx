import { Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import { PvPGamePage } from "./pages/PvPGamePage";

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/pvp" element={<PvPGamePage />} />
      </Routes>
    </GameProvider>
  );
}
