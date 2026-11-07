/** 计时模式 */
export type Phase = "focus" | "break";

/** 计时器运行状态 */
export type RunState = "idle" | "running" | "paused";

/** 一条已完成番茄钟的记录（按天聚合统计用） */
export type SessionLog = {
  /** ISO 字符串，完成时刻 */
  at: string;
  /** 本轮专注时长（分钟） */
  minutes: number;
};

export const FOCUS_MINUTES = 25;
export const BREAK_MINUTES = 5;
