/** Поддерживаемые языки. Default = "ru". */
export type Language = "ru" | "en";

export const LANGUAGES: { code: Language; label: string; emoji: string }[] = [
  { code: "ru", label: "Русский",  emoji: "🇷🇺" },
  { code: "en", label: "English",  emoji: "🇬🇧" },
];
