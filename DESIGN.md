# Design System: Pomodoro Studio

```yaml
tokens:
  colors:
    paper: "#f5f1e8"
    ink: "#111111"
    muted: "#8c877d"
    accent: "#ff4d00"
    hairline: "rgba(17,17,17,0.08)"
    ring-track: "rgba(17,17,17,0.08)"
    ring-progress: "#ff4d00"
  typography:
    display: YouSheBiaoTiHei
    body: Geist
    mono: Geist Mono
  radius: 0
  shadow: none
theme: light
```

## North Star

**The Quiet Desk（安静的桌面）** — 番茄钟是系列作品中最「空」的一件：没有侧栏、没有卡片、没有列表。一整页留白，中央只悬一只圆环，圆环里是一枚等宽字读数。时间在这里是唯一的主体。

## World

延续「墨黑纸白 + 信号橙」家族语言，但把密度降到最低：

- **一页只放三样东西**：品牌行（左上 + 右上时间码）、中央圆环 + 读数、底部按钮与统计。其余全是留白。
- **圆环即进度**：极浅灰底环（ink 8% 透明度）+ 信号橙进度环，10px 粗线、圆头线帽，从顶部顺时针消退。
- **按钮回到「描边字」**：透明底 + 1px 墨色描边，hover/focus 转橙。这是全应用唯一的边框元素。
- **动效只有两处，都是状态语言**：暂停 = 数字呼吸（opacity 1→0.35，2.4s 循环）；到点 = 圆环脉冲（1.035 scale，1.1s 一次）。

## Typography

| 声部 | 字体 | 用途 |
|---|---|---|
| display | YouSheBiaoTiHei | 品牌行「番茄钟」二字 |
| mono（主声部） | Geist Mono 4.5rem medium tabular | 中央 MM:SS 读数 |
| label | Geist Mono 10px uppercase 0.14em | FOCUS/BREAK、副题、统计行 |
| body | Geist | 无长文，仅兜底 |

## Motion

| 名称 | 参数 | 触发 |
|---|---|---|
| breath | opacity 1→0.35, 2.4s ease-in-out infinite | 暂停中 |
| ring-pulse | scale 1→1.035→1, 1.1s ease-in-out ×1 | 倒计时到点 |
| stroke-dashoffset | 0.3s linear transition | 每次走秒 |

`prefers-reduced-motion` 下全部动画关闭。

## Rules

1. **The Lone Ring Rule** — 页面主体只有一个圆环。禁止添加任何第二视觉焦点（卡片、面板、边框区块）。
2. **The Orange Hand Rule** — 橙色只出现在：进度环、hover/focus 描边、选中数字强调。禁止大面积橙底。
3. **The Numbers Breathe Rule** — 暂停态必须可见：数字呼吸 + 副题「已暂停」，绝不让用户怀疑计时器死了。
4. **The Flat Page Rule** — 全站零阴影、零圆角。深度感全部交给留白。

## Do / Don't

- Do 用留白做层级；三段式布局（品牌 / 圆环 / 控制+统计）。
- Do 计时锚定时间戳差值（endAt − now），不信任 setInterval 累积。
- Don't 添加配置面板、设置抽屉 —— 极简是产品决策不是偷懒。
- Don't 用深色元素点缀 —— 全页严格亮色。

## Surfaces

- `desktop`：2560×1600 全屏，圆环 320px 居中。
- `mobile`：flex-col 自然堆叠，圆环 320px 在 375px 视口内仍完整。
