"use client";

interface Props {
  onConnect: () => void;
  loading: boolean;
}

export default function ConnectScreen({ onConnect, loading }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">🌾 NEAR Farm</h1>
        <p className="text-gray-400">Фермерская 2D игра на блокчейне NEAR</p>
        <p className="text-gray-500 text-sm mt-2">
          Размещай NFT объекты, собирай ресурсы, крафти и ходи в гости
        </p>
      </div>
      <button
        onClick={onConnect}
        disabled={loading}
        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-lg font-semibold transition-colors"
      >
        {loading ? "Подключение..." : "🔗 Подключить кошелёк NEAR"}
      </button>
    </div>
  );
}
