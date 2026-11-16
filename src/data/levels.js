// ======================================================
//  Angel Run: datos del juego
// ======================================================

// Mapa (25 columnas x 15 filas)
//   #  pared        .  corazoncito (10 pts)      H  corazón grande (50 pts)
//   A  inicio de Angel y PASARELA (la salida)    G  inicio de un fantasma
export const MAZE = [
  "H...........#...........H",
  ".###.####...#...####.###.",
  ".###.####.......####.###.",
  ".........................",
  ".##.##.#####.#####.##.##.",
  ".##.##....G...G....##.##.",
  "....##.#.#######.#.##....",
  ".##.##.#.#######.#.##.##.",
  "....##.#.#######.#.##....",
  ".##.##....G...G....##.##.",
  ".##.##.#####.#####.##.##.",
  ".........................",
  ".###.####.......####.###.",
  ".###.####...#...####.###.",
  "H...........A...........H",
];

// Dónde va el logo VS (el bloque central del laberinto)
export const LOGO_BOX = { x: 9, y: 6, w: 7, h: 3 };

// ---------- El look ----------
// Para pasar de nivel hay que juntar las 4 piezas del look y llegar a la pasarela.
// Cada pieza aparece cuando Angel junta cierto porcentaje de los corazoncitos (at).
// Dónde aparece se sortea en cada nivel y en cada partida.
export const PIECES = [
  { kind: "perfume", name: "el Perfume", at: 0.2 },
  { kind: "bow", name: "el Moño", at: 0.45 },
  { kind: "heels", name: "los Tacos", at: 0.7 },
  { kind: "bag", name: "la Bolsa", at: 0.9 },
];

// Reglas del sorteo de lugares (en casillas)
export const PIECE_RULES = {
  minFromStart: 8, // caminando desde la pasarela
  minApart: 8, // distancia mínima entre dos piezas
};

export const SPEED_SECONDS = 6; // cuánto dura la velocidad de los Tacos

// ---------- Dificultad por nivel ----------
// Todo sube de a poco con cada nivel.
// ghostSpeed: velocidad de los fantasmas (0 a 1; Angel va a 1)
// heelsBoost: velocidad extra de Angel con los Tacos (0.3 = un 30% más rápida)
// pinkSeconds: duración del Pink Mode
// aggr: qué tanto persiguen a Angel (0 a 1)
export const LEVELS = [
  { ghostSpeed: 0.4, heelsBoost: 0.3, pinkSeconds: 10, aggr: 0.75 },
  { ghostSpeed: 0.47, heelsBoost: 0.4, pinkSeconds: 8, aggr: 0.8 },
  { ghostSpeed: 0.54, heelsBoost: 0.5, pinkSeconds: 6, aggr: 0.9 },
  { ghostSpeed: 0.62, heelsBoost: 0.6, pinkSeconds: 5, aggr: 1 },
  { ghostSpeed: 0.7, heelsBoost: 0.7, pinkSeconds: 4, aggr: 1 },
];

export const START_LIVES = 4; // vidas con las que empieza la partida

export const TICK_MS = 150; // cada cuántos milisegundos avanza el juego

export const POINTS = {
  dot: 10,
  heart: 50,
  perfume: 200,
  bag: 100,
  bow: 300,
  heels: 300,
  level: 1000,
  ghost: [200, 400, 800, 1600],
};
