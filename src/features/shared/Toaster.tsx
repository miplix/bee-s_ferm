import { useToastStore } from "../../state/toastStore";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-1 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`
            pointer-events-auto px-3 py-1.5 border font-game text-[8px] shadow-lg
            animate-[fadeIn_0.15s_ease-out]
            ${t.type === "error" ? "bg-red-900 border-red-600 text-red-200"
              : t.type === "success" ? "bg-green-900 border-green-500 text-green-200"
              : "bg-brown-700 border-yellow-600/50 text-white"}
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
