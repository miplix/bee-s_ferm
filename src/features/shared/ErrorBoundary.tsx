import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#1a1a2e] text-white font-game text-[10px] gap-4 p-8">
          <p>Что-то пошло не так</p>
          <pre className="text-red-400 text-[8px] max-w-md overflow-auto">
            {this.state.error.message}
          </pre>
          <button
            className="px-4 py-2 bg-yellow-700 border-2 border-black"
            onClick={() => location.reload()}
          >
            Перезагрузить страницу
          </button>
          <p className="text-white/40 text-[7px] max-w-md text-center leading-relaxed">
            Сейв НЕ трогается — попробуй просто перезагрузить. Если не помогло, напиши автору.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
