import "./gameover.css";
import { useMemo } from "react";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import Button from "../components/button.jsx";
import Wing from "../components/wing.jsx";
import Ranking from "../components/ranking.jsx";
import { formatScore } from "../game/engine.js";
import { readRecord } from "../game/record.js";
import { loadRanking } from "../game/ranking.js";

// result = { score, won, best, isRecord, entryId } (lo manda la pantalla de juego)
function GameOver({ result, playerName, onAgain, onMenu }) {
  const { score = 0, won = false, isRecord = false, entryId } = result || {};
  // Si se recarga la página, el récord se recupera del navegador
  const best = Math.max(result?.best ?? 0, readRecord());
  const entries = useMemo(() => loadRanking(), []);

  return (
    <div className="screen gameover">
      <Header showBrand={false} />

      <main className="go-main">
        <div className="go-center">
          <div className="go-title-wrap">
            <h1 className="go-title">{won ? "You’re an Angel" : "Game Over"}</h1>
          </div>

          {playerName && <p className="go-name">{playerName}</p>}

          <p className="go-label">PUNTAJE FINAL</p>
          <p className="go-score" aria-live="polite">
            {formatScore(score)}
          </p>

          <div className="go-best">
            <span>MEJOR PUNTAJE</span>
            <strong>{formatScore(best)}</strong>
          </div>
          {isRecord && <p className="go-record">¡Nuevo récord!</p>}

          <Ranking entries={entries} highlightId={entryId} />

          <div className="go-actions">
            <div className="cta-wrap">
              <Wing side="left" />
              <Button variant="cta" onClick={onAgain}>
                DE NUEVO
              </Button>
              <Wing side="right" />
            </div>
            <Button variant="secondary" size="sm" onClick={onMenu}>
              MENÚ PRINCIPAL
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default GameOver;
