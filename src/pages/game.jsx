import "./game.css";
import { useEffect, useRef, useState } from "react";
import GameBoard from "../components/gameboard.jsx";
import { TICK_MS } from "../data/levels.js";
import { createGame, nextLevel, tick, togglePause, viewOf } from "../game/engine.js";
import { readRecord, writeRecord } from "../game/record.js";
import { audio } from "../game/audio.js";

const KEYS = {
  ArrowUp: "up", w: "up", W: "up",
  ArrowDown: "down", s: "down", S: "down",
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
};
function Game({ onExit, onGameOver }) {
  // El juego vive en una "ref": cambia 6 veces por segundo sin recrearse
  const game = useRef(null);
  if (!game.current) game.current = createGame();

  const [view, setView] = useState(() => viewOf(game.current));
  const [record] = useState(readRecord);

  const sync = () => setView(viewOf(game.current));

  // Reproduce los sonidos que dejó el motor en este turno
  const playEvents = () => {
    const g = game.current;
    g.events.forEach((name) => audio.play(name));
    g.events.length = 0;
  };

  const pause = () => {
    const g = game.current;
    const before = g.status;
    togglePause(g);
    if (g.status !== before) audio.play("pause");
    sync();
  };

  // Reloj del juego
  useEffect(() => {
    const id = setInterval(() => {
      if (game.current.status === "playing") {
        tick(game.current);
        playEvents();
        sync();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Teclado: flechas / WASD mueven, P o Esc pausan
  useEffect(() => {
    const onKey = (e) => {
      const dir = KEYS[e.key];
      const g = game.current;
      if (dir) {
        e.preventDefault();
        g.want = dir;
        if (g.status === "ready") {
          g.status = "playing";
          audio.play("start");
          sync();
        }
      } else if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (g.status === "playing" || g.status === "paused") pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fin de nivel o de partida
  useEffect(() => {
    if (view.status === "levelup") {
      const t = setTimeout(() => {
        game.current = nextLevel(game.current);
        sync();
      }, 1800);
      return () => clearTimeout(t);
    }

    if (view.status === "over" || view.status === "won") {
      const score = game.current.score;
      const isRecord = score > record; // record = el que había al empezar
      if (isRecord) writeRecord(score);
      const t = setTimeout(() => {
        if (onGameOver) {
          onGameOver({
            score,
            won: view.status === "won",
            best: Math.max(record, score),
            isRecord,
          });
        }
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [view.status]);

  return (
    <GameBoard
      view={view}
      record={record}
      onPause={pause}
      onResume={pause}
      onExit={onExit}
    />
  );
}

export default Game;
