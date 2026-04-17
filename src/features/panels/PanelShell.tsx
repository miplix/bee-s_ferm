import type { ReactNode } from "react";
import { useStore } from "../../state/store";

interface Props {
  title: string;
  children: ReactNode;
}

export function PanelShell({ title, children }: Props) {
  const setPanel = useStore((s) => s.setPanel);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      onClick={() => setPanel(null)}
    >
      {/* Backdrop — click anywhere outside to close */}
      <div className="absolute inset-0" />

      {/* Panel */}
      <div
        className="relative w-[320px] h-full bg-brown-700 border-l-2 border-black
          overflow-y-auto shadow-[-4px_0_12px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-brown-800 border-b-2 border-black">
          <span className="font-game text-[10px] text-yellow-300">{title}</span>
          <button
            onClick={() => setPanel(null)}
            className="font-game text-[10px] text-white/60 hover:text-white"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}
