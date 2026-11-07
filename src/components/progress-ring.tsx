import { useMemo } from "react";

type ProgressRingProps = {
  /** 剩余秒数 */
  remaining: number;
  /** 本轮总秒数 */
  total: number;
  /** 模式名：FOCUS / BREAK */
  label: string;
  /** 模式副题 */
  sub: string;
  /** 时间显示（MM:SS） */
  time: string;
  /** 是否暂停中（呼吸闪烁） */
  breathing: boolean;
  /** 是否刚结束（圆环跳动） */
  pulsing: boolean;
};

const SIZE = 320;
const STROKE = 10;
const R = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function ProgressRing({
  remaining,
  total,
  label,
  sub,
  time,
  breathing,
  pulsing,
}: ProgressRingProps) {
  const fraction = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0;
  const dashOffset = useMemo(() => CIRCUMFERENCE * (1 - fraction), [fraction]);

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={pulsing ? "animate-ring-pulse" : undefined}
        aria-hidden="true"
      >
        {/* 底环：极浅灰 */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(17,17,17,0.08)"
          strokeWidth={STROKE}
        />
        {/* 进度环：信号橙，从顶部顺时针消退 */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="#c73e3a"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: "stroke-dashoffset 0.3s linear" }}
        />
      </svg>

      {/* 中央读数 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="mono-label mb-3">{label}</div>
        <div
          className={`font-mono text-[4.5rem] leading-none font-medium tracking-tight text-ink tabular-nums select-none ${
            breathing ? "animate-breath" : ""
          }`}
        >
          {time}
        </div>
        <div className="mono-label mt-3 text-muted">{sub}</div>
      </div>
    </div>
  );
}
