let audioContext = null;
let enabled = true;

function getContext() {
    if (!audioContext) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioContext = new Ctx();
    }
    return audioContext;
}

function tone({ freq = 440, duration = 0.06, type = 'sine', volume = 0.02 }) {
    if (!enabled) return;
    const ctx = getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
}

const soundMap = {
    next: [{ freq: 680, duration: 0.045, type: 'triangle', volume: 0.02 }],
    prev: [{ freq: 360, duration: 0.05, type: 'triangle', volume: 0.02 }],
    finish: [
        { freq: 620, duration: 0.05, type: 'triangle', volume: 0.022 },
        { freq: 860, duration: 0.07, type: 'triangle', volume: 0.022 }
    ],
    close: [{ freq: 290, duration: 0.05, type: 'sawtooth', volume: 0.016 }],
    download: [
        { freq: 520, duration: 0.04, type: 'sine', volume: 0.02 },
        { freq: 420, duration: 0.06, type: 'sine', volume: 0.02 }
    ],
    tip: [{ freq: 780, duration: 0.04, type: 'sine', volume: 0.018 }],
    add: [{ freq: 730, duration: 0.035, type: 'square', volume: 0.017 }],
    remove: [{ freq: 300, duration: 0.04, type: 'square', volume: 0.017 }]
};

export function playUiSound(kind) {
    const sequence = soundMap[kind] || soundMap.next;
    sequence.forEach((item, index) => {
        const delay = index * 45;
        window.setTimeout(() => tone(item), delay);
    });
}

export function setUiSoundEnabled(value) {
    enabled = Boolean(value);
}
