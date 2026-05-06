import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { initTelegramWebApp } from "./lib/telegram";
import "./index.css";

// Инициализация Telegram WebApp (no-op в обычном браузере)
initTelegramWebApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
