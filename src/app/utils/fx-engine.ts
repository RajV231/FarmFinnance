let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

// Added 4 new sound types!
export type SFXType = 'click' | 'cash' | 'error' | 'success' | 'plant' | 'harvest' | 'bad_event' | 'loan' | 'buzz';

export const playSFX = (type: SFXType) => {
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    switch (type) {
      case 'click': // UI Buttons
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        if (navigator.vibrate) navigator.vibrate(10);
        break;

      case 'cash': // Buying/Selling
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        break;

      case 'loan': // Taking Debt (Heavy, deep sound)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
        break;

      case 'plant': // Starting a season (Soft digging sound)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
        if (navigator.vibrate) navigator.vibrate(30);
        break;

      case 'harvest': // End of season (Happy double chime)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
        if (navigator.vibrate) navigator.vibrate([30, 30, 30, 30, 50]);
        break;

      case 'bad_event': // Weather crash (Sad trombone drop)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        break;

      case 'buzz': // Wrong Quiz Answer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.setValueAtTime(0.01, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
        if (navigator.vibrate) navigator.vibrate(80);
        break;

      case 'success': // General UI Success
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        osc.frequency.setValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        if (navigator.vibrate) navigator.vibrate([30, 30, 50]);
        break;

      case 'error': // Generic Error
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        break;
    }
  } catch (e) {
    console.error("Audio FX error", e);
  }
};