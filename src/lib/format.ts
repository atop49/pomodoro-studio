/** 秒数 → MM:SS（两位补零） */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${`${m}`.padStart(2, "0")}:${`${sec}`.padStart(2, "0")}`;
}

/** 计时开始时刻的本地 HH:MM:SS 时间码（风格延续系列作品） */
export function formatTimecode(d: Date): string {
  const p = (n: number) => `${n}`.padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
