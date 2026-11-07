import { useCallback, useEffect, useRef, useState } from "react";
import { FOCUS_MINUTES, BREAK_MINUTES, type Phase, type RunState } from "../types";
import { playChime } from "../lib/sound";
import { notify, ensureNotificationPermission } from "../lib/notify";
import { useStatsStore } from "../store";

/**
 * 计时核心：以「目标结束时刻」为锚（时间戳差值），不受 setInterval 漂移影响；
 * 标签页后台节流也不会累积误差。remaining 每秒由 1s interval 刷新用于显示。
 */
export function useTimer() {
  const [phase, setPhase] = useState<Phase>("focus");
  const [runState, setRunState] = useState<RunState>("idle");
  const [remaining, setRemaining] = useState(FOCUS_MINUTES * 60);
  const [justFinished, setJustFinished] = useState(false);

  /** 本轮总秒数（用于环形进度比例） */
  const total = phase === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60;

  const endAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const completeFocus = useStatsStore((s) => s.completeFocus);

  const clearIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTicking = useCallback(() => {
    if (clearIntervalRef.current !== null) {
      clearInterval(clearIntervalRef.current);
      clearIntervalRef.current = null;
    }
  }, []);

  /** 到点：记统计、响铃、通知、切相位 */
  const handleFinish = useCallback(
    (finishedPhase: Phase) => {
      finishedRef.current = true;
      stopTicking();
      setRunState("idle");
      setRemaining(0);
      setJustFinished(true);
      window.setTimeout(() => setJustFinished(false), 1200);

      if (finishedPhase === "focus") {
        completeFocus();
        playChime();
        void ensureNotificationPermission().then((granted) => {
          if (granted)
            notify("专注完成", `本轮 ${FOCUS_MINUTES} 分钟番茄钟已收工，休息 ${BREAK_MINUTES} 分钟。`);
        });
        setPhase("break");
        setRemaining(BREAK_MINUTES * 60);
      } else {
        playChime();
        void ensureNotificationPermission().then((granted) => {
          if (granted) notify("休息结束", "准备好回到专注了吗？");
        });
        setPhase("focus");
        setRemaining(FOCUS_MINUTES * 60);
      }
    },
    [completeFocus, stopTicking],
  );

  const start = useCallback(() => {
    if (runState === "running") return;
    // 到点后的「开始」即开始新相位
    finishedRef.current = false;
    const secondsLeft = remaining > 0 ? remaining : total;
    if (remaining <= 0) setRemaining(total);
    endAtRef.current = Date.now() + secondsLeft * 1000;
    setRunState("running");
    stopTicking();
    clearIntervalRef.current = setInterval(() => {
      const endAt = endAtRef.current;
      if (endAt === null) return;
      const left = Math.round((endAt - Date.now()) / 1000);
      if (left <= 0) {
        handleFinish(phase);
      } else {
        setRemaining(left);
      }
    }, 250);
  }, [runState, remaining, total, phase, handleFinish, stopTicking]);

  const pause = useCallback(() => {
    if (runState !== "running") return;
    const endAt = endAtRef.current;
    if (endAt !== null) {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      setRemaining(left);
    }
    endAtRef.current = null;
    stopTicking();
    setRunState("paused");
  }, [runState, stopTicking]);

  const reset = useCallback(() => {
    stopTicking();
    endAtRef.current = null;
    finishedRef.current = false;
    setRunState("idle");
    setPhase("focus");
    setRemaining(FOCUS_MINUTES * 60);
  }, [stopTicking]);

  // 卸载时清理 interval
  useEffect(() => stopTicking, [stopTicking]);

  // 空闲时把显示归位（例如到点切换后的瞬间）
  useEffect(() => {
    if (runState === "idle" && endAtRef.current === null && !finishedRef.current) {
      setRemaining((r) => (r <= 0 ? total : r));
    }
  }, [runState, total]);

  return { phase, runState, remaining, total, justFinished, start, pause, reset };
}
