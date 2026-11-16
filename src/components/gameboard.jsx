import { TopBar, BottomBar } from "./hud.jsx";
import Maze from "./maze.jsx";
import Button from "./button.jsx";

// Pantalla del juego (solo dibuja; la lógica está en pages/game.jsx)
function GameBoard({ view, record, onPause, onResume, onExit }) {
  const { status } = view;

  return (
    <div className="screen game-screen">
      <TopBar
        score={view.score}
        level={view.levelIdx + 1}
        record={Math.max(record, view.score)}
        onPause={onPause}
      />

      <div className="maze-wrap">
        <div className="stage" style={{ "--cols": view.w, "--rows": view.h }}>
        <Maze view={view} />

        {view.toast && status === "playing" && <p className="toast">{view.toast}</p>}

        {status === "ready" && (
          <div className="overlay">
            <h2>Nivel {view.levelIdx + 1}</h2>
            <p>
              Juntá los corazoncitos: van apareciendo las piezas de tu look. Con el look completo,
              corré a la pasarela.
            </p>
            <p className="hint">Presioná una flecha para empezar</p>
          </div>
        )}

        {status === "paused" && (
          <div className="overlay">
            <h2>Pausa</h2>
            <Button variant="cta" sound="none" onClick={onResume}>
              SEGUIR
            </Button>
            <Button variant="secondary" size="sm" onClick={onExit}>
              SALIR
            </Button>
          </div>
        )}

        {status === "levelup" && (
          <div className="overlay">
            <h2>¡Desfile completado!</h2>
            <p>Look completo. +1.000 puntos</p>
          </div>
        )}

        {status === "over" && (
          <div className="overlay">
            <h2>Game Over</h2>
          </div>
        )}

        {status === "won" && (
          <div className="overlay">
            <h2>You’re an Angel</h2>
            <p>¡Completaste los 5 niveles!</p>
          </div>
        )}
        </div>
      </div>

      <BottomBar
        lives={view.lives}
        look={view.look}
        lookCount={view.lookCount}
        pinkSeconds={view.pinkSeconds}
        pinkRatio={view.pinkRatio}
      />
    </div>
  );
}

export default GameBoard;
