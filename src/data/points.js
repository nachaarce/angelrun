// Puntos que da cada elemento del juego
export const POINTS = {
  heart: 10,
  bag: 100,
  perfume: 200,
};

// Convierte 500 en "000500", como en el diseño
export function formatScore(score) {
  return String(score).padStart(6, "0");
}
