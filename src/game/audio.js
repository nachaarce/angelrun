// Sonido de Angel Run: todo se sintetiza con Web Audio (no hay archivos de audio)
const KEY = "angelrun-audio";

let sfxOn = true; // efectos
let musicOn = false; // música de fondo
let ctx = null;
let master = null;
let musicBus = null;
let wakaToggle = false;

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "null");
  if (saved) {
    sfxOn = !!saved.sfx;
    musicOn = !!saved.music;
  }
} catch {
  /* sin almacenamiento: se usan los valores por defecto */
}

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ sfx: sfxOn, music: musicOn }));
  } catch {
    /* nada */
  }
};

// Los navegadores solo dejan sonar después de un clic o una tecla
function ensure() {
  if (!ctx) {
    const AC = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.16;
    musicBus.connect(master);
  }
  if (ctx.state === "suspended") {
    const r = ctx.resume();
    if (r && r.catch) r.catch(() => {});
  }
  return ctx;
}

// Una nota: frecuencia, duración, forma de onda, volumen y cuándo empieza
function tone({ freq, dur = 0.1, type = "square", vol = 0.15, at = 0, slideTo, bus }) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(bus || master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

const notes = (list, opts = {}) =>
  list.forEach((freq, i) => tone({ freq, at: i * (opts.step ?? 0.09), ...opts }));

const SOUNDS = {
  dot: () => {
    wakaToggle = !wakaToggle;
    tone({ freq: wakaToggle ? 520 : 400, dur: 0.05, vol: 0.07 });
  },
  heart: () => notes([660, 880], { type: "triangle", dur: 0.09, vol: 0.18 }),
  appear: () => notes([784, 988, 1319], { type: "sine", dur: 0.16, vol: 0.2, step: 0.1 }),
  piece: () => notes([523, 659, 784, 1047], { dur: 0.08, vol: 0.13 }),
  look: () => notes([784, 988, 1175, 1568], { type: "triangle", dur: 0.14, vol: 0.2, step: 0.1 }),
  pink: () => {
    tone({ freq: 300, slideTo: 1200, dur: 0.5, type: "sawtooth", vol: 0.12 });
    notes([880, 1175, 1568], { type: "triangle", dur: 0.12, vol: 0.15, step: 0.12 });
  },
  speed: () => tone({ freq: 500, slideTo: 1100, dur: 0.28, type: "square", vol: 0.13 }),
  shield: () => notes([880, 1175], { type: "sine", dur: 0.18, vol: 0.2, step: 0.12 }),
  shieldbreak: () => tone({ freq: 700, slideTo: 150, dur: 0.25, type: "square", vol: 0.16 }),
  ghost: () => tone({ freq: 300, slideTo: 1500, dur: 0.26, type: "square", vol: 0.15 }),
  life: () => tone({ freq: 700, slideTo: 140, dur: 0.7, type: "sawtooth", vol: 0.16 }),
  over: () => notes([392, 330, 262, 196], { type: "triangle", dur: 0.3, vol: 0.25, step: 0.28 }),
  levelup: () => {
    notes([523, 659, 784, 1047], { dur: 0.11, vol: 0.14, step: 0.11 });
    tone({ freq: 1047, dur: 0.45, vol: 0.14, at: 0.5 });
  },
  won: () => {
    notes([523, 659, 784, 1047, 784, 1047, 1319], { dur: 0.16, vol: 0.15, step: 0.15 });
    tone({ freq: 1568, dur: 0.7, vol: 0.15, at: 1.1 });
  },
  click: () => tone({ freq: 620, slideTo: 880, dur: 0.07, type: "triangle", vol: 0.16 }),
  select: () => notes([523, 784], { type: "triangle", dur: 0.09, vol: 0.18, step: 0.07 }),
  start: () => tone({ freq: 440, slideTo: 880, dur: 0.15, type: "triangle", vol: 0.18 }),
  pause: () => notes([330, 262], { type: "triangle", dur: 0.1, vol: 0.18, step: 0.09 }),
};

// ---------- Música de fondo: ritmo de desfile (house) ----------
// Bombo en cada tiempo, palmas, hi-hats, bajo a contratiempo, acordes y una melodía
const BPM = 124;
const STEP = 60 / BPM / 4; // una semicorchea
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

// 4 compases que se repiten: Am - F - C - G
const CHORDS = [
  { root: 45, stab: [57, 60, 64] },
  { root: 41, stab: [53, 57, 60] },
  { root: 48, stab: [60, 64, 67] },
  { root: 43, stab: [55, 59, 62] },
];
// Melodía: [casilla del compás (0 a 15), nota MIDI]
const LEAD = [
  [[0, 76], [3, 81], [6, 79], [10, 76], [12, 72]],
  [[0, 77], [3, 81], [6, 84], [10, 81], [12, 77]],
  [[0, 79], [3, 76], [6, 79], [10, 84], [12, 79]],
  [[0, 74], [3, 79], [6, 83], [10, 79], [14, 74]],
];

let noise = null;
const noiseBuffer = () => {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noise;
};

function kick(t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(160, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(1, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  o.connect(g);
  g.connect(musicBus);
  o.start(t);
  o.stop(t + 0.3);
}

// Palmas y hi-hats: ruido filtrado
function hit(t, { dur = 0.1, hp = 0, bp = 0, vol = 0.3 }) {
  const src = ctx.createBufferSource();
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  src.buffer = noiseBuffer();
  if (bp) {
    f.type = "bandpass";
    f.frequency.value = bp;
    f.Q.value = 0.8;
  } else {
    f.type = "highpass";
    f.frequency.value = hp;
  }
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(musicBus);
  src.start(t);
  src.stop(t + dur + 0.02);
}

// Sintetizador con filtro (bajo, acordes y melodía)
function synth(t, freq, { dur = 0.15, type = "sawtooth", vol = 0.2, cutoff = 1200 }) {
  const o = ctx.createOscillator();
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  f.type = "lowpass";
  f.frequency.value = cutoff;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(f);
  f.connect(g);
  g.connect(musicBus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function musicStep(n, t) {
  const bar = Math.floor(n / 16) % 4;
  const s = n % 16;
  const chord = CHORDS[bar];

  if (s % 4 === 0) kick(t); // bombo en cada tiempo
  if (s === 4 || s === 12) hit(t, { dur: 0.14, bp: 1800, vol: 0.45 }); // palmas
  if (s % 4 === 2) hit(t, { dur: 0.09, hp: 7000, vol: 0.22 }); // hi-hat abierto
  else if (s % 2 === 1) hit(t, { dur: 0.03, hp: 9000, vol: 0.08 }); // hi-hat suave
  if (s % 4 === 2) synth(t, mtof(chord.root), { dur: STEP * 1.6, vol: 0.55, cutoff: 500 }); // bajo
  if ([3, 6, 11, 14].includes(s)) {
    chord.stab.forEach((m) =>
      synth(t, mtof(m), { dur: STEP * 1.2, type: "square", vol: 0.07, cutoff: 2500 }),
    );
  }
  LEAD[bar].forEach(([st, m]) => {
    if (st === s) synth(t, mtof(m), { dur: STEP * 2.5, vol: 0.11, cutoff: 3500 });
  });
}

let musicTimer = null;
let nextNote = 0;
let step = 0;

function scheduleMusic() {
  while (nextNote < ctx.currentTime + 0.4) {
    musicStep(step, Math.max(nextNote, ctx.currentTime));
    nextNote += STEP;
    step++;
  }
}

function startMusic() {
  if (musicTimer || !ensure()) return;
  nextNote = ctx.currentTime + 0.05;
  step = 0;
  scheduleMusic();
  musicTimer = setInterval(scheduleMusic, 100);
}

function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
}

export const audio = {
  isSfxOn: () => sfxOn,
  isMusicOn: () => musicOn,

  setSfx(on) {
    sfxOn = on;
    save();
  },

  setMusic(on) {
    musicOn = on;
    save();
    if (on) startMusic();
    else stopMusic();
  },

  play(name) {
    if (!sfxOn || !SOUNDS[name] || !ensure()) return;
    SOUNDS[name]();
  },

  // Se llama en el primer clic o tecla: ahí el navegador ya permite el sonido
  unlock() {
    ensure();
    if (musicOn) startMusic();
  },
};

if (typeof window !== "undefined") {
  const unlock = () => audio.unlock();
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}
