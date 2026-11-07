import { IconPlay, IconPause, IconReset } from "./icons";
import type { RunState } from "../types";

type ControlsProps = {
  runState: RunState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

const btn =
  "inline-flex items-center gap-2 h-11 px-7 border border-ink/70 bg-transparent text-[0.8125rem] uppercase tracking-[0.12em] text-ink cursor-pointer transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent outline-none select-none";

export function Controls({ runState, onStart, onPause, onReset }: ControlsProps) {
  const running = runState === "running";
  return (
    <div className="flex items-center justify-center gap-4">
      <button type="button" className={btn} onClick={running ? onPause : onStart}>
        {running ? <IconPause /> : <IconPlay />}
        {running ? "暂停" : runState === "paused" ? "继续" : "开始"}
      </button>
      <button type="button" className={btn} onClick={onReset} disabled={runState === "idle"}>
        <IconReset />
        重置
      </button>
    </div>
  );
}
