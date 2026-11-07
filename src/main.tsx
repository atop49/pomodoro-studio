import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/geist";
import "@fontsource/geist-mono";
import "./index.css";
import App from "./App";

// 兜底诊断：把未捕获错误写进标题（沿用系列作品做法）
window.onerror = (msg) => {
  document.title = `ERR: ${String(msg)}`;
};
window.onunhandledrejection = (e) => {
  document.title = `ERR: ${String(e.reason)}`;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
