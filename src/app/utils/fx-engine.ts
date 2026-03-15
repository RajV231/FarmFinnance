let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

export type SFXType = 
  | 'click' | 'cash' | 'error' | 'success' | 'plant' 
  | 'harvest' | 'bad_event' | 'loan' | 'buzz' 
  | 'slider_tick' | 'toggle_on' | 'toggle_off' | 'select_crop';

export const playSFX = (type: SFXType) => {
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Connect nodes
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    switch (type) {
      case 'click': // Crisp, modern UI tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
        if (navigator.vibrate) navigator.vibrate(10);
        break;

      case 'slider_tick': // Very fast, quiet click for range inputs
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.02, now); // Very quiet!
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now); osc.stop(now + 0.02);
        break;

      case 'toggle_on': // Happy upward sweep (Insurance ON)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        if (navigator.vibrate) navigator.vibrate([10, 30]);
        break;

      case 'toggle_off': // Sad downward sweep (Insurance OFF)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        if (navigator.vibrate) navigator.vibrate(20);
        break;

      case 'select_crop': // Warm, organic pop
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
        if (navigator.vibrate) navigator.vibrate(15);
        break;

      case 'cash': // Digital cash register (double beep)
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        break;

      // ==========================================
      // REPLACED LOAN SOUND
      // ==========================================
      case 'loan': // Clean, formal ATM/Bank double-chime 
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now); // High clean beep
        osc.frequency.setValueAtTime(500, now + 0.15); // Lower clean beep
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        if (navigator.vibrate) navigator.vibrate([30, 40]);
        break;

      case 'plant': // Muffled thump (Shovel in dirt)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
        if (navigator.vibrate) navigator.vibrate(40);
        break;

      case 'harvest': // Triumphant major chord sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
        if (navigator.vibrate) navigator.vibrate([30, 30, 30, 30, 50]);
        break;

      // ==========================================
      // REPLACED BAD EVENT SOUND
      // ==========================================
      case 'bad_event': // Sharp, quick warning alert (double-beep)
        osc.type = 'square';
        osc.frequency.setValueAtTime(250, now); // Low punch
        osc.frequency.setValueAtTime(200, now + 0.15); // Lower punch
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
        if (navigator.vibrate) navigator.vibrate([50, 40, 50]);
        break;

      case 'buzz': // Harsh wrong answer
        osc.type = 'square';
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

      case 'error': // Generic UI Error
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
        if (navigator.vibrate) navigator.vibrate([40, 40]);
        break;
    }
  } catch (e) {
    console.error("Audio FX error", e);
  }
};