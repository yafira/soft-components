// shared web audio helpers for demos that make sound
// audio only starts after a user gesture, so call these from event handlers or
// from effects that a click has just triggered

const MAX_LEVEL = 0.22;

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!context) context = new Ctor();
  if (context.state === "suspended") void context.resume();
  return context;
}

// a short burst of noise that fades out fast, shared by every click
function getNoise(ac: AudioContext): AudioBuffer {
  if (noise && noise.sampleRate === ac.sampleRate) return noise;
  const length = Math.floor(ac.sampleRate * 0.04);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade * fade * fade;
  }
  noise = buffer;
  return buffer;
}

export type ClickOptions = {
  pitch?: number; // center frequency of the click, in hz
  gain?: number; // 0 to 1, capped internally
  delay?: number; // seconds from now
};

export function playClick(options: ClickOptions = {}) {
  const ac = getAudioContext();
  if (!ac) return;
  const { pitch = 1800, gain = 0.12, delay = 0 } = options;

  const source = ac.createBufferSource();
  source.buffer = getNoise(ac);

  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = pitch;
  filter.Q.value = 1.6;

  const level = ac.createGain();
  level.gain.value = Math.min(gain, MAX_LEVEL);

  source.connect(filter);
  filter.connect(level);
  level.connect(ac.destination);
  source.start(ac.currentTime + delay);
}

export type Tone = {
  setFrequency: (hz: number) => void;
  setLevel: (level: number) => void; // 0 to 1
  stop: () => void;
};

// one sine oscillator behind a gain and a compressor, so a slider can never
// send the speaker anything loud
export function createTone(type: OscillatorType = "sine"): Tone | null {
  const ac = getAudioContext();
  if (!ac) return null;

  const oscillator = ac.createOscillator();
  oscillator.type = type;

  const gain = ac.createGain();
  gain.gain.value = 0;

  const limiter = ac.createDynamicsCompressor();

  oscillator.connect(gain);
  gain.connect(limiter);
  limiter.connect(ac.destination);
  oscillator.start();

  let stopped = false;

  return {
    setFrequency(hz) {
      if (stopped) return;
      oscillator.frequency.setTargetAtTime(hz, ac.currentTime, 0.02);
    },
    setLevel(level) {
      if (stopped) return;
      const clamped = Math.min(Math.max(level, 0), 1) * MAX_LEVEL;
      gain.gain.setTargetAtTime(clamped, ac.currentTime, 0.02);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      gain.gain.setTargetAtTime(0, ac.currentTime, 0.03);
      oscillator.stop(ac.currentTime + 0.25);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        limiter.disconnect();
      };
    },
  };
}
