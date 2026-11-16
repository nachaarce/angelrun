import "./instructions.css";
import Header from "../components/header.jsx";
import InfoCard from "../components/infocard.jsx";
import ArrowKeys from "../components/arrowkeys.jsx";
import Button from "../components/button.jsx";
import Wing from "../components/wing.jsx";
import { audio } from "../game/audio.js";
import {
  AngelSprite,
  HeartSprite,
  GhostSprite,
  RunwaySprite,
  PerfumeSprite,
  BowSprite,
  HeelsSprite,
  BagSprite,
} from "../components/sprites.jsx";

// Las 4 piezas del look y el poder que da cada una
const POWERS = [
  { icon: <PerfumeSprite />, name: "Perfume", power: "Pink Mode" },
  { icon: <BowSprite />, name: "Moño", power: "Escudo" },
  { icon: <HeelsSprite />, name: "Tacos", power: "Velocidad" },
  { icon: <BagSprite />, name: "Bolsa", power: "Puntos extra" },
];

function Instructions({ onPlay, onBack }) {
  return (
    <div className="screen howto">
      <Header showSound={false} />

      <main className="howto-main">
        <h1 className="howto-title">¿Cómo jugar?</h1>

        <p className="howto-intro">
          Recorre la pasarela, recolecta <strong>corazones</strong> para armar tu{" "}
          <strong>look</strong> con accesorios de Victoria’s Secret, evita a los{" "}
          <strong>fantasmas</strong> y activa el <strong>Pink Mode</strong> para ser
          invencible por unos segundos
        </p>

        <section className="info-grid" aria-label="Elementos del juego">
          <InfoCard icon={<AngelSprite />} title="Tú">
            Sos el <strong>Angel</strong> de Victoria’s Secret
          </InfoCard>
          <InfoCard icon={<HeartSprite />} title="Corazones">
            Juntalos para <strong>sumar puntos</strong> y hacer aparecer tu look
          </InfoCard>
          <InfoCard
            icon={<AngelSprite bow heels bag perfume />}
            title="Tu look"
          >
            Juntá las <strong>4 piezas</strong>: perfume, moño, tacos y bolsa
          </InfoCard>
          <InfoCard icon={<RunwaySprite />} title="Pasarela">
            Con el look completo, <strong>corré a la pasarela</strong>
          </InfoCard>
          <InfoCard icon={<GhostSprite />} title="Fantasmas">
            <strong>Evitalos</strong> para no perder vidas
          </InfoCard>
        </section>

        <section className="powers" aria-label="Poderes de cada pieza">
          <h2 className="powers-title">CADA PIEZA TE DA UN PODER</h2>
          <ul className="powers-list">
            {POWERS.map((p) => (
              <li key={p.name} className="power">
                <span className="power-icon">{p.icon}</span>
                <span className="power-text">
                  <b>{p.name}</b>
                  {p.power}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="controls">
          <ArrowKeys />
          <div className="controls-text">
            <h2>CONTROLES</h2>
            <p>
              Usa las flechas del teclado o las teclas <strong>WASD</strong> para
              moverte
            </p>
          </div>
        </section>

        <div className="cta-wrap">
          <Wing side="left" />
          <Button variant="cta" onClick={onPlay}>
            ¡A JUGAR!
          </Button>
          <Wing side="right" />
        </div>
      </main>

      <button
        type="button"
        className="back-link"
        onClick={() => {
          audio.play("click");
          onBack();
        }}
      >
        Volver
      </button>
    </div>
  );
}

export default Instructions;
