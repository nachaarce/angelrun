import { formatScore } from "../game/engine.js";
import { START_LIVES } from "../data/levels.js";
import SoundControls from "./soundcontrols.jsx";
import {
  StarIcon,
  WingIcon,
  BagSprite,
  PerfumeSprite,
  BowSprite,
  HeelsSprite,
} from "./sprites.jsx";

export function TopBar({ score, level, record, onPause }) {
  return (
    <div className="topbar">
      <p className="stat">
        <span>PUNTOS:</span> {formatScore(score)}
      </p>
      <p className="stat">
        <span>NIVEL:</span> {level}
      </p>
      <p className="stat">
        <span>RECORD:</span> {formatScore(record)}
      </p>
      <div className="topbar-controls">
        <SoundControls />
        <button type="button" className="pause-btn" aria-label="Pausa" onClick={onPause}>
          <i />
          <i />
        </button>
      </div>
    </div>
  );
}

const LOOK_SLOTS = [
  { key: "perfume", label: "Perfume", icon: <PerfumeSprite /> },
  { key: "bow", label: "Moño", icon: <BowSprite /> },
  { key: "heels", label: "Tacos", icon: <HeelsSprite /> },
  { key: "bag", label: "Bolsa", icon: <BagSprite /> },
];

export function BottomBar({ lives, look, lookCount, pinkSeconds, pinkRatio }) {
  return (
    <div className="bottombar">
      <div className="lives" aria-label={`${lives} vidas`}>
        {Array.from({ length: START_LIVES }, (_, i) => (
          <span key={i} className={i < lives ? "star on" : "star"}>
            <StarIcon />
          </span>
        ))}
        <b>VIDAS</b>
      </div>

      <div className="look" aria-label={`Look: ${lookCount} de 4 piezas`}>
        <b>TU LOOK</b>
        {LOOK_SLOTS.map((s) => (
          <span key={s.key} title={s.label} className={look[s.key] ? "slot on" : "slot"}>
            {s.icon}
          </span>
        ))}
      </div>

      <div className="pinkbar">
        <span className="pink-wing">
          <WingIcon />
        </span>
        <div className="pink-track">
          <div className="pink-fill" style={{ width: `${Math.round(pinkRatio * 100)}%` }} />
        </div>
        <b>PINK MODE {String(pinkSeconds).padStart(2, "0")}s</b>
      </div>
    </div>
  );
}
