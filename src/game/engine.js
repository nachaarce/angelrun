import {
  MAZE,
  LEVELS,
  POINTS,
  TICK_MS,
  START_LIVES,
  PIECES,
  PIECE_RULES,
  SPEED_SECONDS,
} from "../data/levels.js";

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPP = { up: "down", down: "up", left: "right", right: "left" };
const NAMES = Object.keys(DIRS);
const CHASE = [0.85, 0.7, 0.45, 0.6]; // personalidad de cada fantasma
const SPEED_TICKS = Math.round((SPEED_SECONDS * 1000) / TICK_MS);

// 000500
export const formatScore = (n) => String(n).padStart(6, "0");


// ---------- Lugares de las piezas (se sortean en cada nivel) ----------
const keyOf = (x, y) => `${x},${y}`;
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Distancia caminando desde la pasarela hasta cada casilla
function walkDistances(m) {
  const dist = new Map([[keyOf(m.angel.x, m.angel.y), 0]]);
  const queue = [m.angel];
  while (queue.length) {
    const cur = queue.shift();
    for (const d of Object.values(DIRS)) {
      const x = cur.x + d.x;
      const y = cur.y + d.y;
      if (y < 0 || y >= m.h || x < 0 || x >= m.w || m.walls[y][x]) continue;
      if (dist.has(keyOf(x, y))) continue;
      dist.set(keyOf(x, y), dist.get(keyOf(cur.x, cur.y)) + 1);
      queue.push({ x, y });
    }
  }
  return dist;
}

const randomOf = (list) => list[Math.floor(Math.random() * list.length)];

// Elige un lugar para cada pieza: lejos de la pasarela, lejos entre sí
// y distinto a los del nivel anterior ("avoid")
export function pickPieceSpots(m, avoid = []) {
  const dist = walkDistances(m);
  const banned = new Set(avoid);
  m.ghosts.forEach((g) => banned.add(keyOf(g.x, g.y)));
  banned.add(keyOf(m.angel.x, m.angel.y));

  const pool = [];
  for (let y = 0; y < m.h; y++) {
    for (let x = 0; x < m.w; x++) {
      const k = keyOf(x, y);
      if (m.walls[y][x] || banned.has(k) || m.items[y][x] === "H") continue;
      if ((dist.get(k) ?? 0) >= PIECE_RULES.minFromStart) pool.push({ x, y });
    }
  }

  const chosen = [];
  for (let i = 0; i < PIECES.length; i++) {
    const free = pool.filter((c) => !chosen.some((o) => o.x === c.x && o.y === c.y));
    let options = free.filter((c) => chosen.every((o) => manhattan(o, c) >= PIECE_RULES.minApart));
    if (!options.length) options = free.filter((c) => chosen.every((o) => manhattan(o, c) >= 3));
    if (!options.length) options = free;
    chosen.push(randomOf(options));
  }
  return chosen;
}

// ---------- Armado del nivel ----------
function parseMaze(rows) {
  const h = rows.length;
  const w = rows[0].length;
  const walls = [];
  const items = [];
  const ghosts = [];
  let angel = null;
  let dots = 0;

  for (let y = 0; y < h; y++) {
    const wallRow = [];
    const itemRow = [];
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      let item = " ";
      if (ch === ".") {
        item = ".";
        dots++;
      } else if (ch === "H") {
        item = "H";
      } else if (ch === "A") {
        angel = { x, y };
      } else if (ch === "G") {
        ghosts.push({ x, y });
      }
      wallRow.push(ch === "#");
      itemRow.push(item);
    }
    walls.push(wallRow);
    items.push(itemRow);
  }
  return { w, h, walls, items, angel, ghosts, dots };
}

const emit = (g, name) => g.events.push(name);

export function createGame(levelIdx = 0, carry = {}) {
  const cfg = LEVELS[levelIdx];
  const m = parseMaze(MAZE);

  // Las piezas del look van en lugares distintos en cada nivel y cada partida
  const spots = pickPieceSpots(m, carry.avoid || []);
  let total = m.dots;
  const pieces = PIECES.map((p, i) => {
    const { x, y } = spots[i];
    m.items[y][x] = " "; // sin corazoncito en esa casilla
    total--;
    return { ...p, x, y };
  });
  pieces.forEach((p) => {
    p.at = Math.round(total * p.at); // cuántos corazoncitos hacen falta
    p.shown = false;
  });

  return {
    levelIdx,
    cfg,
    w: m.w,
    h: m.h,
    walls: m.walls,
    items: m.items,
    total, // corazoncitos del nivel
    eaten: 0, // corazoncitos juntados
    pieces,
    look: { perfume: false, bow: false, heels: false, bag: false },
    shield: false, // el Moño protege de un fantasma
    speedTicks: 0, // los Tacos dan velocidad
    boostAcc: 0, // va sumando la velocidad extra de los Tacos
    toast: null, // mensajito en pantalla
    score: carry.score ?? 0,
    lives: carry.lives ?? START_LIVES,
    status: "ready", // ready | playing | paused | levelup | over | won
    start: m.angel,
    angel: { x: m.angel.x, y: m.angel.y, px: m.angel.x, py: m.angel.y, dir: "left" },
    want: null, // dirección pedida con el teclado
    ghosts: m.ghosts.slice(0, 4).map((p, i) => ({
      id: i, x: p.x, y: p.y, px: p.x, py: p.y, sx: p.x, sy: p.y,
      dir: "up", mode: "normal", acc: 0,
    })),
    pinkTicks: 0,
    pinkTotal: Math.round((cfg.pinkSeconds * 1000) / TICK_MS),
    combo: 0,
    events: [], // sonidos pendientes (los reproduce la pantalla)
  };
}

export const nextLevel = (g) =>
  createGame(g.levelIdx + 1, {
    score: g.score,
    lives: g.lives,
    // el próximo nivel no repite los lugares de este
    avoid: g.pieces.map((p) => `${p.x},${p.y}`),
  });

export function togglePause(g) {
  if (g.status === "playing") g.status = "paused";
  else if (g.status === "paused") g.status = "playing";
}

const lookCount = (g) => Object.values(g.look).filter(Boolean).length;

// ---------- Utilidades ----------
const canGo = (g, x, y) => y >= 0 && y < g.h && x >= 0 && x < g.w && !g.walls[y][x];
const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const say = (g, text) => (g.toast = { text, ttl: 22 });

// ---------- Angel ----------
function moveAngel(g) {
  const a = g.angel;
  a.px = a.x;
  a.py = a.y;
  if (g.want) {
    const w = DIRS[g.want];
    if (canGo(g, a.x + w.x, a.y + w.y)) a.dir = g.want;
  }
  const d = DIRS[a.dir];
  if (canGo(g, a.x + d.x, a.y + d.y)) {
    a.x += d.x;
    a.y += d.y;
  }
}

// Las piezas del look aparecen según los corazoncitos juntados
function revealPieces(g) {
  for (const p of g.pieces) {
    if (!p.shown && g.eaten >= p.at) {
      p.shown = true;
      g.items[p.y][p.x] = p.kind;
      say(g, `¡Nueva pieza: ${p.name}!`);
      emit(g, "appear");
    }
  }
}

function collect(g) {
  const { x, y } = g.angel;
  const it = g.items[y][x];
  if (it === " ") return;
  g.items[y][x] = " ";

  if (it === ".") {
    g.score += POINTS.dot;
    g.eaten++;
    emit(g, "dot");
    revealPieces(g);
  } else if (it === "H") {
    g.score += POINTS.heart;
    emit(g, "heart");
  } else {
    // Es una pieza del look
    g.look[it] = true;
    g.score += POINTS[it];
    if (it === "perfume") {
      g.pinkTicks = g.pinkTotal; // Pink Mode
      g.combo = 0;
      g.ghosts.forEach((gh) => (gh.mode = "scared"));
      say(g, "¡PINK MODE!");
      emit(g, "pink");
    } else if (it === "bow") {
      g.shield = true;
      say(g, "¡Escudo! Te protege de un fantasma");
      emit(g, "shield");
    } else if (it === "heels") {
      g.speedTicks = SPEED_TICKS;
      say(g, "¡Tacos! Vas más rápida");
      emit(g, "speed");
    } else {
      say(g, "¡Puntos extra!");
      emit(g, "piece");
    }
    if (lookCount(g) === 4) {
      say(g, "¡Look completo! Corré a la pasarela");
      emit(g, "look");
    }
  }
}

// Llegar a la pasarela (donde empieza Angel) con el look completo
function reachedRunway(g) {
  const a = g.angel;
  const moved = a.px !== a.x || a.py !== a.y;
  return lookCount(g) === 4 && moved && a.x === g.start.x && a.y === g.start.y;
}

// ---------- Fantasmas ----------
function targetOf(g, gh) {
  const a = g.angel;
  if (gh.id === 1) {
    const d = DIRS[a.dir]; // intenta cortarle el camino
    return { x: a.x + d.x * 4, y: a.y + d.y * 4 };
  }
  if (gh.id === 3 && dist(gh, a) < 6) return { x: gh.sx, y: gh.sy }; // se aleja si está cerca
  return { x: a.x, y: a.y };
}

function moveGhost(g, gh) {
  gh.px = gh.x;
  gh.py = gh.y;
  const all = NAMES.filter((n) => canGo(g, gh.x + DIRS[n].x, gh.y + DIRS[n].y));
  let opts = all.filter((n) => n !== OPP[gh.dir]); // no da media vuelta
  if (!opts.length) opts = all;
  if (!opts.length) return;

  let pick;
  if (gh.mode === "scared" || Math.random() > CHASE[gh.id] * g.cfg.aggr) {
    pick = opts[Math.floor(Math.random() * opts.length)];
  } else {
    const t = targetOf(g, gh);
    const d = (n) => dist({ x: gh.x + DIRS[n].x, y: gh.y + DIRS[n].y }, t);
    pick = opts.reduce((best, n) => (d(n) < d(best) ? n : best));
  }
  gh.dir = pick;
  gh.x += DIRS[pick].x;
  gh.y += DIRS[pick].y;
}

const sendHome = (gh, wait = -3) => {
  gh.x = gh.px = gh.sx;
  gh.y = gh.py = gh.sy;
  gh.dir = "up";
  gh.acc = wait; // tarda un poco en volver a salir
};

// ---------- Choques ----------
function resetPositions(g) {
  const a = g.angel;
  a.x = a.px = g.start.x;
  a.y = a.py = g.start.y;
  a.dir = "left";
  g.want = null;
  g.speedTicks = 0;
  g.boostAcc = 0;
  g.ghosts.forEach((gh) => {
    sendHome(gh, 0);
    gh.mode = "normal";
  });
}

function loseLife(g) {
  g.lives--;
  g.pinkTicks = 0;
  g.combo = 0;
  g.toast = null;
  if (g.lives <= 0) {
    g.status = "over";
    emit(g, "over");
    return;
  }
  emit(g, "life");
  resetPositions(g);
  g.status = "ready"; // espera una flecha para seguir
}

function collide(g) {
  const a = g.angel;
  for (const gh of g.ghosts) {
    const same = gh.x === a.x && gh.y === a.y;
    const swap = gh.x === a.px && gh.y === a.py && gh.px === a.x && gh.py === a.y;
    if (!same && !swap) continue;

    if (gh.mode === "scared") {
      g.score += POINTS.ghost[Math.min(g.combo, 3)]; // 200, 400, 800, 1600
      g.combo++;
      gh.mode = "normal";
      sendHome(gh);
      emit(g, "ghost");
    } else if (g.shield) {
      g.shield = false; // el Moño se gasta
      sendHome(gh, -4);
      say(g, "¡El moño te salvó!");
      emit(g, "shieldbreak");
    } else {
      loseLife(g);
      return;
    }
  }
}

// ---------- Un paso del juego ----------
export function tick(g) {
  if (g.status !== "playing") return;

  if (g.toast && --g.toast.ttl <= 0) g.toast = null;

  // Con los Tacos Angel da, de vez en cuando, un paso extra (más seguido en niveles altos)
  let steps = 1;
  if (g.speedTicks > 0) {
    g.speedTicks--;
    g.boostAcc += g.cfg.heelsBoost;
    if (g.boostAcc >= 1) {
      g.boostAcc -= 1;
      steps = 2;
    }
  }

  for (let s = 0; s < steps; s++) {
    moveAngel(g);
    collect(g);

    if (reachedRunway(g)) {
      g.score += POINTS.level;
      g.status = g.levelIdx === LEVELS.length - 1 ? "won" : "levelup";
      emit(g, g.status);
      return;
    }

    collide(g);
    if (g.status !== "playing") return;
  }

  if (g.pinkTicks > 0) {
    g.pinkTicks--;
    if (g.pinkTicks === 0) {
      g.ghosts.forEach((gh) => (gh.mode = "normal"));
      g.combo = 0;
    }
  }

  for (const gh of g.ghosts) {
    const speed = gh.mode === "scared" ? g.cfg.ghostSpeed * 0.6 : g.cfg.ghostSpeed;
    gh.acc += speed;
    if (gh.acc >= 1) {
      gh.acc -= 1;
      moveGhost(g, gh);
      collide(g);
      if (g.status !== "playing") return;
    }
  }
}

// Copia liviana del estado para que React la dibuje
export const viewOf = (g) => ({
  status: g.status,
  levelIdx: g.levelIdx,
  score: g.score,
  lives: g.lives,
  w: g.w,
  h: g.h,
  walls: g.walls,
  items: g.items.map((r) => r.slice()),
  start: g.start,
  angel: { ...g.angel },
  ghosts: g.ghosts.map((gh) => ({ id: gh.id, x: gh.x, y: gh.y, mode: gh.mode })),
  look: { ...g.look },
  lookCount: lookCount(g),
  shield: g.shield,
  fast: g.speedTicks > 0,
  toast: g.toast ? g.toast.text : "",
  pinkSeconds: Math.ceil((g.pinkTicks * TICK_MS) / 1000),
  pinkRatio: g.pinkTotal ? g.pinkTicks / g.pinkTotal : 0,
});
