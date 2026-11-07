/**
 * 倒计时结束的提示音：Web Audio 合成三音上行铃（无外部资源）。
 * 在用户手势上下文里创建 AudioContext；失败时静默降级。
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  ac: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  peak: number,
): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const t0 = ac.currentTime + startAt;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** 倒计时结束提示音：E5 → A5 → C#6 三音上行，柔和铃声 */
export function playChime(): void {
  const ac = getCtx();
  if (!ac) return;
  const p = 0.16;
  tone(ac, 659.25, 0, 0.5, 0.18);
  tone(ac, 880.0, p, 0.55, 0.16);
  tone(ac, 1108.73, p * 2, 0.8, 0.14);
}
