import { useEffect, useMemo, useState } from "react";
import { useTimer } from "./lib/useTimer";
import { useStatsStore, selectTodayCount } from "./store";
import { formatClock, formatTimecode } from "./lib/format";
import { ProgressRing } from "./components/progress-ring";
import { Controls } from "./components/controls";

export default function App() {
  const { phase, runState, remaining, total, justFinished, start, pause, reset } = useTimer();
  const sessions = useStatsStore((s) => s.sessions);
  const todayCount = useMemo(() => selectTodayCount(sessions), [sessions]);

  const time = formatClock(remaining);
  const breathing = runState === "paused";
  const pulsing = justFinished;

  const label = phase === "focus" ? "专注 · FOCUS" : "休息 · BREAK";
  const sub =
    runState === "idle"
      ? "准备就绪"
      : runState === "paused"
        ? "已暂停"
        : phase === "focus"
          ? "保持在场"
          : "喘口气";

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* 顶部品牌行：极简，无任何边框 */}
      <header className="flex items-baseline justify-between px-6 pt-8 sm:px-10">
        <div>
          <h1 className="font-display text-2xl tracking-wide">番茄钟</h1>
          <p className="mono-label mt-1 text-muted">POMODORO STUDIO — 一次只做一件事</p>
        </div>
        <LiveClock />
      </header>

      {/* 中心：环形进度 + 读数 + 控制 */}
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-10">
        <ProgressRing
          remaining={remaining}
          total={total}
          label={label}
          sub={sub}
          time={time}
          breathing={breathing}
          pulsing={pulsing}
        />
        <Controls runState={runState} onStart={start} onPause={pause} onReset={reset} />
      </main>

      {/* 底部统计：极简小字，无边框 */}
      <footer className="px-6 pb-8 text-center sm:px-10">
        <p className="mono-label text-muted">
          今日完成 <span className="text-ink">{todayCount}</span> 个番茄钟
        </p>
      </footer>
    </div>
  );
}

/** 右上角实时时钟（延续系列作品的时间码语言） */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className="font-mono text-xs tabular-nums text-muted" dateTime={now.toISOString()}>
      {formatTimecode(now)}
    </time>
  );
}
