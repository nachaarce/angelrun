import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import NameEntry from "./pages/nameentry.jsx";
import Instructions from "./pages/instructions.jsx";
import Game from "./pages/game.jsx";
import GameOver from "./pages/gameover.jsx";
import { addScore } from "./game/ranking.js";

function App() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [result, setResult] = useState({ score: 0, won: false });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            onPlay={() => navigate("/nombre")}
            onInstructions={() => navigate("/como-jugar")}
          />
        }
      />

      <Route
        path="/como-jugar"
        element={
          <Instructions
            onPlay={() => navigate("/nombre")}
            onBack={() => navigate("/")}
          />
        }
      />

      <Route
        path="/nombre"
        element={
          <NameEntry
            onBack={() => navigate("/")}
            onStart={(name) => {
              setPlayerName(name);
              navigate("/juego");
            }}
          />
        }
      />

      <Route
        path="/juego"
        element={
          <Game
            onExit={() => navigate("/")}
            onGameOver={(r) => {
              // Suma el puntaje al ranking y guarda su id para resaltarlo
              const { id } = addScore(playerName || "Angel", r.score);
              setResult({ ...r, entryId: id });
              navigate("/fin");
            }}
          />
        }
      />

      <Route
        path="/fin"
        element={
          <GameOver
            result={result}
            playerName={playerName}
            onAgain={() => navigate("/juego")}
            onMenu={() => navigate("/")}
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
