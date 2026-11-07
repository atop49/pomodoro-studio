type IconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconPlay({ width = 14, height = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={width} height={height} className={className} {...base}>
      <path d="M5 3.5v9l7-4.5-7-4.5Z" />
    </svg>
  );
}

export function IconPause({ width = 14, height = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={width} height={height} className={className} {...base}>
      <path d="M5.5 3.5v9M10.5 3.5v9" />
    </svg>
  );
}

export function IconReset({ width = 14, height = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={width} height={height} className={className} {...base}>
      <path d="M3 8a5 5 0 1 0 1.46-3.54" />
      <path d="M3 3v3h3" />
    </svg>
  );
}
