/**
 * useT — хук для локализации.
 * Использование:
 *   const t = useT();
 *   <h1>{t("hud.move")}</h1>
 *   <span>{t("toast.level_required", { n: 5 })}</span>
 *
 * Если ключ не найден в текущем языке — fallback в ru, потом сам ключ.
 */

import { useCallback } from "react";
import { useStore } from "../state/store";
import { dict } from "./dict";
import type { Language } from "./types";

export function useT() {
  const lang = useStore((s) => (s as any).language as Language | undefined) ?? "ru";
  return useCallback((key: string, params?: Record<string, string | number>): string => {
    let str = dict[lang]?.[key] ?? dict.ru[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  }, [lang]);
}

/** Не-реактивная версия (для action-функций / toast вне React-компонентов). */
export function t(key: string, params?: Record<string, string | number>): string {
  // Динамический импорт стора чтобы избежать циклов при инициализации
  let lang: Language = "ru";
  try {
    const state = (useStore as any).getState();
    lang = (state.language as Language) ?? "ru";
  } catch {/* до инициализации стора — fallback ru */}
  let str = dict[lang]?.[key] ?? dict.ru[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
