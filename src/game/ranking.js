// Ranking local: otras jugadoras inventadas al azar + los puntajes de esta computadora
const KEY = "angelrun-ranking";
const MAX = 50;

const NAMES = [
  "Sofi", "Cami", "Valen", "Lucía", "Mica", "Juli", "Agus", "Flor", "Male", "Romi",
  "Pili", "Cande", "Delfi", "Abril", "Mora", "Tomi", "Nico", "Fran", "Maxi", "Bauti",
  "Luna", "Emma", "Olivia", "Isa", "Vicky", "Lara", "Zoe", "Bianca", "Camila", "Martina",
];

const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// Puntaje inventado: casi todas llegan a los primeros niveles, pocas al último
function fakeScore() {
  const r = Math.random();
  const level = r < 0.3 ? 0 : r < 0.58 ? 1 : r < 0.78 ? 2 : r < 0.92 ? 3 : 4;
  return Math.round((level * 4000 + rand(300, 3800)) / 10) * 10;
}

function seed() {
  const names = [...NAMES].sort(() => Math.random() - 0.5).slice(0, 10);
  return names.map((name, i) => ({ id: `bot-${i}`, name, score: fakeScore() }));
}

let memory = null; // por si el navegador no deja guardar

const sortDesc = (list) => [...list].sort((a, b) => b.score - a.score);

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "null");
    if (Array.isArray(list) && list.length) return list;
  } catch {
    /* sin almacenamiento */
  }
  return memory;
}

function write(list) {
  memory = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* sin almacenamiento */
  }
}

// La primera vez inventa las jugadoras; después siempre usa las mismas
export function loadRanking() {
  let list = read();
  if (!list) {
    list = seed();
    write(list);
  }
  return sortDesc(list);
}

// Suma el puntaje de esta partida y devuelve su id para resaltarlo
export function addScore(name, score) {
  const entry = { id: `you-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, score };
  const entries = sortDesc([...loadRanking(), entry]).slice(0, MAX);
  write(entries);
  return { id: entry.id, entries };
}
