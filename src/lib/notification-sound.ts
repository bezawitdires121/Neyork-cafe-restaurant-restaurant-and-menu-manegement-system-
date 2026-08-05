let audioCtx: AudioContext | null = null;
let unlocked = false;

export function unlockAudio() {
  if (unlocked) return;
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  unlocked = true;
}

function playTone(freq: number, start: number, duration: number, ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

// A cheerful little two-note "ding-dong" for the customer's order status
export function playCustomerChime() {
  if (!audioCtx) return;
  playTone(880, 0, 0.15, audioCtx);
  playTone(1174, 0.15, 0.25, audioCtx);
}

// A slightly more urgent three-note alert for the cashier
export function playCashierChime() {
  if (!audioCtx) return;
  playTone(660, 0, 0.1, audioCtx);
  playTone(880, 0.1, 0.1, audioCtx);
  playTone(1046, 0.2, 0.25, audioCtx);
}