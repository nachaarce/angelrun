// Récord guardado en el navegador (localStorage)
const KEY = "angelrun-record";

export function readRecord() {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0; // sin almacenamiento: no pasa nada
  }
}

export function writeRecord(score) {
  try {
    localStorage.setItem(KEY, String(score));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}
