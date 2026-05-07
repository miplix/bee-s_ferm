/**
 * Лёгкая фоновая музыка — процедурный ambient pad на Web Audio API.
 * Не использует аудио-ассеты (всё генерируется в браузере).
 *
 * Звук: ТОЛЬКО три низкочастотные синусоиды (A2 + C3 + E3 = A-minor аккорд).
 * Жёсткий lowpass на 400 Hz — НИКАКИХ высоких частот, никакого «ультразвука».
 *
 * Контекст AudioContext создаётся ТОЛЬКО после первого взаимодействия юзера
 * (нельзя автозапустить из-за autoplay-policy браузера).
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let nodes: { osc: OscillatorNode[]; lfo: OscillatorNode | null; filter: BiquadFilterNode | null } | null = null;
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

function buildPad() {
  const audioCtx = ensureContext();

  // Master gain
  masterGain = audioCtx.createGain();
  masterGain.gain.value = enabledFlag ? 0.04 : 0;
  masterGain.connect(audioCtx.destination);

  // Жёсткий lowpass — рубим всё выше 400 Hz, гарантируем тёплый бас-пэд без шипений.
  // Cutoff качается LFO в диапазоне 250..400 Hz (узкий, безопасный).
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 325;
  filter.Q.value = 0.7;
  filter.connect(masterGain);

  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.04; // 25-секундный цикл
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 75; // ±75 Hz around 325 = 250..400 Hz
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  // Триада чистых синусоид
  const oscs: OscillatorNode[] = [];
  for (const f of FREQS) {
    const o = audioCtx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 6;
    const g = audioCtx.createGain();
    g.gain.value = 0.33;
    o.connect(g);
    g.connect(filter);
    o.start();
    oscs.push(o);
  }

  nodes = { osc: oscs, lfo, filter };
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
