import { memo } from "react";
import { LOGO_BOX } from "../data/levels.js";
import {
  AngelSprite,
  HeartSprite,
  BagSprite,
  PerfumeSprite,
  BowSprite,
  HeelsSprite,
  GhostSprite,
} from "./sprites.jsx";

const GHOST_COLORS = ["#ff9fc0", "#8f9cf0", "#e8a08a", "#7fdc8a"];
const SCARED_COLOR = "#cdb4ff";

const ITEM_ICONS = {
  H: <HeartSprite />,
  perfume: <PerfumeSprite />,
  bow: <BowSprite />,
  heels: <HeelsSprite />,
  bag: <BagSprite />,
};

// Posición y tamaño de una casilla, en porcentaje del laberinto
const cell = (x, y, w, h, cw = 1, ch = 1) => ({
  left: `${(x * 100) / w}%`,
  top: `${(y * 100) / h}%`,
  width: `${(cw * 100) / w}%`,
  height: `${(ch * 100) / h}%`,
});

// Paredes: se dibuja solo el borde que mira a un camino (queda como un contorno rosa)
const WallLayer = memo(function WallLayer({ walls }) {
  const h = walls.length;
  const w = walls[0].length;
  const open = (x, y) => y >= 0 && y < h && x >= 0 && x < w && !walls[y][x];
  const out = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!walls[y][x]) continue;
      const cls = ["wall"];
      if (open(x, y - 1)) cls.push("t");
      if (open(x + 1, y)) cls.push("r");
      if (open(x, y + 1)) cls.push("b");
      if (open(x - 1, y)) cls.push("l");
      out.push(<div key={`${x}-${y}`} className={cls.join(" ")} style={cell(x, y, w, h)} />);
    }
  }
  return <>{out}</>;
});

function Maze({ view }) {
  const { w, h, walls, items, angel, ghosts, start, look, lookCount, shield, fast } = view;
  const blink = view.pinkSeconds > 0 && view.pinkSeconds <= 2;

  const itemEls = [];
  items.forEach((row, y) =>
    row.forEach((it, x) => {
      if (it === " ") return;
      const isDot = it === ".";
      const cls = isDot ? "item item-dot" : `item item-${it === "H" ? "heart" : "piece"}`;
      itemEls.push(
        <div key={`i${x}-${y}`} className={cls} style={cell(x, y, w, h)}>
          {!isDot && ITEM_ICONS[it]}
        </div>,
      );
    }),
  );

  return (
    <div className="maze">
      <WallLayer walls={walls} />

      <div className="logo-box" style={cell(LOGO_BOX.x, LOGO_BOX.y, w, h, LOGO_BOX.w, LOGO_BOX.h)}>
        <span>VS</span>
      </div>

      {lookCount === 4 && (
        <div className="runway" style={cell(start.x, start.y, w, h)}>
          <span />
        </div>
      )}

      {itemEls}

      {ghosts.map((g) => {
        const scared = g.mode === "scared";
        const color = scared ? SCARED_COLOR : GHOST_COLORS[g.id];
        return (
          <div
            key={`g${g.id}`}
            className={`entity entity-ghost${scared && blink ? " blink" : ""}`}
            style={cell(g.x, g.y, w, h)}
          >
            <GhostSprite color={color} />
          </div>
        );
      })}

      <div className={`entity entity-angel${fast ? " fast" : ""}`} style={cell(angel.x, angel.y, w, h)}>
        <AngelSprite
          bow={look.bow}
          heels={look.heels}
          bag={look.bag}
          perfume={look.perfume}
          shield={shield}
        />
      </div>
    </div>
  );
}

export default Maze;
