/**
 * 浏览器通知封装：请求权限 + 发送。
 * 未授权或被拒绝时静默降级（不阻塞主流程）。
 */

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

export function notify(title: string, body: string): void {
  try {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification(title, { body, silent: true });
  } catch {
    /* 通知失败不影响计时 */
  }
}
