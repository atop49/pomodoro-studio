import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FOCUS_MINUTES } from "./types";

/**
 * 统计 store：只记录「今天完成了几个番茄钟」。
 * 独立于计时器 store，persist 到 LocalStorage。
 */
type StatsState = {
  /** ISO 字符串数组，每项是一次完成的专注（时刻即天钥匙） */
  sessions: string[];
  completeFocus: () => void;
  clearAll: () => void;
};

/** 本地时区的 yyyy-mm-dd 天钥匙 */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function sanitizeIso(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : raw;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      sessions: [],
      completeFocus: () =>
        set((s) => ({ sessions: [...s.sessions, new Date().toISOString()] })),
      clearAll: () => set({ sessions: [] }),
    }),
    {
      name: "pomodoro-studio.stats.v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => {
        const raw = (persisted ?? {}) as { sessions?: unknown };
        const list = Array.isArray(raw.sessions) ? raw.sessions : [];
        return {
          sessions: list
            .map(sanitizeIso)
            .filter((v): v is string => v !== null),
        };
      },
    },
  ),
);

/** 选中今天完成的番茄钟时刻列表 */
export function selectTodaySessions(sessions: string[]): string[] {
  const key = dayKey(new Date().toISOString());
  return sessions.filter((iso) => dayKey(iso) === key);
}

/** 今日完成的番茄钟数 */
export function selectTodayCount(sessions: string[]): number {
  return selectTodaySessions(sessions).length;
}

/** 供音效/文案使用的默认专注时长（分钟） */
export const DEFAULT_FOCUS_MINUTES = FOCUS_MINUTES;
