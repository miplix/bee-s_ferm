/**
 * Telegram WebApp integration.
 *
 * При запуске игры внутри Telegram (как mini-app) отключаем swipe-back,
 * раскрываем на полный экран, синхронизируем тему. Если игра открыта в
 * обычном браузере — window.Telegram отсутствует и всё это no-op.
 *
 * Docs: https://core.telegram.org/bots/webapps
 */

// Минимальный тип Telegram WebApp API (только поля что используем)
interface TgWebApp {
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  enableClosingConfirmation?: () => void;
  disableClosingConfirmation?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  isVerticalSwipesEnabled?: boolean;
  platform?: string;
  version?: string;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

export function initTelegramWebApp(): void {
  const tg = window.Telegram?.WebApp;
  if (!tg) return; // не в Telegram — выходим

  try {
    tg.ready?.();
    tg.expand?.();                  // во весь экран
    tg.disableVerticalSwipes?.();   // отключаем свайп-вниз для закрытия
    tg.disableClosingConfirmation?.();
    // Цвета под игровой коричневый HUD
    tg.setHeaderColor?.("#3E2210");
    tg.setBackgroundColor?.("#3E2210");
  } catch {
    // молча игнорируем — старые версии TG могут не поддерживать часть API
  }
}
