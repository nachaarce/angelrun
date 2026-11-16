import { useState } from "react";
import { audio } from "../game/audio.js";

// Botones de sonido y de música (se usan en el Header y en el juego)
function SoundControls() {
  const [soundOn, setSoundOn] = useState(audio.isSfxOn());
  const [musicOn, setMusicOn] = useState(audio.isMusicOn());

  const toggleSound = () => {
    const on = !soundOn;
    setSoundOn(on);
    audio.setSfx(on);
    if (on) audio.play("heart"); // sonidito de confirmación
  };

  const toggleMusic = () => {
    const on = !musicOn;
    setMusicOn(on);
    audio.setMusic(on);
  };

  return (
    <div className="sound-controls">
      <button
        type="button"
        className="icon-btn"
        aria-label={soundOn ? "Silenciar efectos" : "Activar efectos"}
        aria-pressed={soundOn}
        onClick={toggleSound}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
          {soundOn ? (
            <path
              d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <button
        type="button"
        className="icon-btn"
        aria-label={musicOn ? "Silenciar música" : "Activar música"}
        aria-pressed={musicOn}
        onClick={toggleMusic}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 17V5l11-2v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="6" cy="17" r="3" fill="currentColor" />
          <circle cx="17" cy="15" r="3" fill="currentColor" />
          {!musicOn && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      </button>
    </div>
  );
}

export default SoundControls;
