// Íconos del juego en SVG. Se usan en "Cómo jugar", en el laberinto y en el HUD.
const wingShape = (
  <g>
    <path d="M44 38 C28 36 8 22 2 4 C20 6 38 18 44 38Z" fill="#ff8cc6" />
    <path d="M44 42 C26 42 8 36 2 22 C20 22 36 28 44 42Z" fill="#ff5fae" />
    <path d="M44 46 C30 50 14 50 6 42 C22 38 36 40 44 46Z" fill="#ff2a8a" />
  </g>
);

// Angel. Cada pieza del look que junta se le va sumando.
export function AngelSprite({
  bow = false,
  heels = false,
  bag = false,
  perfume = false,
  shield = false,
}) {
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true">
      {wingShape}
      <g transform="translate(120 0) scale(-1 1)">{wingShape}</g>
      {shield && (
        <circle
          cx="60"
          cy="42"
          r="28"
          fill="rgba(255,255,255,0.15)"
          stroke="#fff"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
      )}
      <circle cx="60" cy="42" r="20" fill="#e91e63" />
      <circle cx="54" cy="35" r="7" fill="#ff6fa5" opacity="0.5" />
      {bow && (
        <g transform="translate(60 23)">
          <path d="M0 0 L-13 -8 V8Z" fill="#ffb3d9" />
          <path d="M0 0 L13 -8 V8Z" fill="#ffb3d9" />
          <circle r="3.4" fill="#ff2a8a" />
        </g>
      )}
      {heels && (
        <g fill="#ffd0e6">
          <path d="M42 60h10l3 5H40z" />
          <path d="M68 60h10l3 5H66z" />
        </g>
      )}
      {bag && (
        <g>
          <path
            d="M81 53v-3a5 5 0 0 1 10 0v3"
            fill="none"
            stroke="#f3b6d6"
            strokeWidth="2"
          />
          <rect x="78" y="53" width="16" height="12" rx="2" fill="#ff2a8a" />
        </g>
      )}
      {perfume && (
        <g>
          <rect x="27" y="50" width="12" height="14" rx="2" fill="#ff5fae" />
          <rect x="30" y="46" width="6" height="5" fill="#ff2a8a" />
        </g>
      )}
    </svg>
  );
}

export function HeartSprite() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"
        fill="#c2185b"
        opacity="0.7"
      />
      <g transform="translate(2.4 2.6) scale(0.8)">
        <path
          d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"
          fill="#ff4f8f"
        />
      </g>
    </svg>
  );
}

export function BagSprite() {
  return (
    <svg viewBox="0 0 48 56" aria-hidden="true">
      <path
        d="M15 20v-6a9 9 0 0 1 18 0v6"
        fill="none"
        stroke="#f3b6d6"
        strokeWidth="3"
      />
      <rect x="4" y="18" width="40" height="34" rx="6" fill="#e91e63" />
      <text
        x="24"
        y="42"
        textAnchor="middle"
        fontSize="18"
        fill="#ffd0e6"
        fontFamily="Cormorant Garamond, serif"
        fontWeight="600"
      >
        VS
      </text>
    </svg>
  );
}

export function PerfumeSprite() {
  return (
    <svg viewBox="0 0 48 56" aria-hidden="true">
      <rect x="14" y="2" width="20" height="8" fill="#ff5fae" />
      <rect x="20" y="10" width="8" height="8" fill="#e91e63" />
      <rect x="4" y="18" width="40" height="34" rx="6" fill="#e91e63" />
      <text
        x="24"
        y="42"
        textAnchor="middle"
        fontSize="18"
        fill="#ffd0e6"
        fontFamily="Cormorant Garamond, serif"
        fontWeight="600"
      >
        VS
      </text>
    </svg>
  );
}

export function BowSprite() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true">
      <path d="M24 16 L3 3 V29Z" fill="#ff8cc6" />
      <path d="M24 16 L45 3 V29Z" fill="#ff5fae" />
      <circle cx="24" cy="16" r="5.5" fill="#e91e63" />
    </svg>
  );
}

export function HeelsSprite() {
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true">
      <path
        d="M6 6 H15 L22 22 C30 23 40 25 45 31 V35 H16 L12 26 H9 V36 H6Z"
        fill="#e91e63"
      />
      <path d="M6 6 H15 L18 13 H6Z" fill="#ff5fae" />
    </svg>
  );
}

export function GhostSprite({ color = "#ff9fc0" }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 28V16a12 12 0 0 1 24 0V28l-4-3-4 3-4-3-4 3-4-3-4 3z" fill={color} />
      <circle cx="12" cy="16" r="2.2" fill="#3a0b33" />
      <circle cx="20" cy="16" r="2.2" fill="#3a0b33" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z" fill="currentColor" />
    </svg>
  );
}

export function WingIcon() {
  return (
    <svg viewBox="0 0 48 52" aria-hidden="true">
      <path d="M46 40 C30 38 8 24 2 4 C22 8 40 22 46 40Z" fill="#ff8cc6" />
      <path d="M46 44 C28 44 8 38 2 24 C22 24 38 32 46 44Z" fill="#ff5fae" />
      <path d="M46 48 C32 52 14 50 6 44 C22 40 36 42 46 48Z" fill="#ff2a8a" />
    </svg>
  );
}

// La pasarela: la salida que se ilumina con el look completo
export function RunwaySprite() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="19" fill="rgba(255,34,114,0.35)" stroke="#fff" strokeWidth="3" />
      <circle cx="24" cy="24" r="10" fill="#ff7ab8" />
      <circle cx="24" cy="24" r="4" fill="#fff" />
    </svg>
  );
}
