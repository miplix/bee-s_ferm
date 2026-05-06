/**
 * Лёгкая фоновая музыка — процедурный ambient pad на Web Audio API.
 * Не использует аудио-ассеты (всё генерируется в браузере).
 *
 * Звук: A-minor sustained chord (A2 + C3 + E3) с медленным lowpass-свипом
 * и тихим шумовым слоем. Громкость намеренно низкая (~0.04 от мастера).
 *
 * Контекст AudioContext создаётся ТОЛЬКО после первого взаимодействия юзера
 * (нельзя автозапустить из-за autoplay-policy браузера).
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let nodes: { osc: OscillatorNode[]; lfo: OscillatorNode | null; filter: BiquadFilterNode | null; noise: AudioBufferSourceNode | null } | null = null;
let started = false;
let enabledFlag = true;

const FREQS = [110, 130.81, 164.81]; // A2, C3, E3 (A minor triad)

function ensureContext(): AudioContext {
  if (!ctx) {
    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
    ctx = new Ctor() as AudioContext;
  }
  return ctx as AudioContext;
}

function buildNoiseBuffer(audioCtx: AudioContext, durationSec = 4): AudioBuffer {
  const sr = audioCtx.sampleRate;
  const buf = audioCtx.createBuffer(1, sr * durationSec, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3; // тихий белый шум
  }
  return buf;
}

function buildPad() {
  const audioCtx = ensureContext();

  // Master gain — единая ручка громкости
  masterGain = audioCtx.createGain();
  masterGain.gain.value = enabledFlag ? 0.04 : 0;
  masterGain.connect(audioCtx.destination);

  // Lowpass filter с медленным LFO-сипом по cutoff (создаёт «дыхание»)
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500;
  filter.Q.value = 1.2;
  filter.connect(masterGain);

  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.04; // 25-секундный цикл
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 300; // ±300 Hz around 500 = 200..800 Hz
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  // Триада осцилляторов
  const oscs: OscillatorNode[] = [];
  for (const f of FREQS) {
    const o = audioCtx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    // Лёгкий detune для каждой ноты — придаёт «толщину»
    o.detune.value = (Math.random() - 0.5) * 8;
    const g = audioCtx.createGain();
    g.gain.value = 0.33; // вместе складываются и нормализуются masterGain
    o.connect(g);
    g.connect(filter);
    o.start();
    oscs.push(o);
  }

  // Тихий шумовой слой (атмосфера) через bandpass
  const noiseBuffer = buildNoiseBuffer(audioCtx);
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 600;
  bp.Q.value = 0.6;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0.05;
  noise.connect(bp); bp.connect(noiseGain); noiseGain.connect(masterGain);
  noise.start();

  nodes = { osc: oscs, lfo, filter, noise };
}

/** Запустить фоновую музыку. Идемпотентно — повторный вызов не пересоздаёт. */
export function startMusic(enabled = true) {
  enabledFlag = enabled;
  if (started) {
    setMusicEnabled(enabled);
    return;
  }
  try {
    buildPad();
    started = true;
  } catch (e) {
    console.warn("[music] start failed:", e);
  }
}

/** Включить/выключить (без teardown — просто mute через masterGain). */
export function setMusicEnabled(on: boolean) {
  enabledFlag = on;
  if (masterGain && ctx) {
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(on ? 0.04 : 0, ctx.currentTime + 0.5);
  }
}

/** Полная остановка (используется при unmount или сбросе игры). */
export function stopMusic() {
  if (nodes) {
    try {
      nodes.osc.forEach((o) => o.stop());
      nodes.lfo?.stop();
      nodes.noise?.stop();
    } catch {/* noop */}
    nodes = null;
  }
  if (ctx) {
    ctx.close().catch(() => {});
    ctx = null;
  }
  masterGain = null;
  started = false;
}
