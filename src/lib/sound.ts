/**
 * Lightweight sound effects via WebAudio. No external assets.
 * Each sound is a tiny generated tone — keeps bundle small.
 */

let ctx: AudioContext | null = null;
let muted = (() => {
  try { return localStorage.getItem("near_farm_muted") === "1"; }
  catch { return false; }
})();

function getCtx(): AudioContext | null {
  if (muted) return null;
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(frequency: number, duration = 0.1, type: OscillatorType = "sine", volume = 0.15) {
  const c = getCtx(); if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

function chord(freqs: number[], duration = 0.2, type: OscillatorType = "sine", volume = 0.1) {
  for (const f of freqs) tone(f, duration, type, volume);
}

// ── Public sound effects ──

export const sfx = {
  click: () => tone(440, 0.05, "square", 0.08),
  plant: () => tone(523, 0.12, "sine", 0.15),                // C5
  harvest: () => chord([523, 659, 784], 0.15, "sine", 0.1),  // C-E-G major
  build: () => chord([392, 523], 0.25, "triangle", 0.12),
  chop: () => tone(220, 0.08, "sawtooth", 0.18),
  mine: () => tone(180, 0.1, "square", 0.18),
  reward: () => chord([523, 659, 784, 1047], 0.3, "sine", 0.12),
  error: () => tone(180, 0.15, "sawtooth", 0.1),
  expand: () => chord([261, 392, 523, 659], 0.4, "triangle", 0.1), // expand chord
};

export function isMuted(): boolean {
  return muted;
}

export function setMuted(v: boolean): void {
  muted = v;
  try { localStorage.setItem("near_farm_muted", v ? "1" : "0"); } catch {}
}
