"use client";

interface Props {
  onConnect: () => void;
  loading: boolean;
}

export default function ConnectScreen({ onConnect, loading }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-4">
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">🌾</div>
        <h1 className="text-5xl font-bold mb-2 text-white">NEAR Farm</h1>
        <p className="text-gray-400 text-lg">Фермерская 2D игра на блокчейне NEAR</p>
        <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto">
          Размещай объекты, собирай ресурсы, развивай свою ферму
        </p>
      </div>
      <button
        onClick={onConnect}
        disabled={loading}
        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-lg font-semibold transition-colors text-white"
        style={{ zIndex: 50 }}
      >
        {loading ? "Подключение..." : "🔗 Подключить кошелёк NEAR"}
      </button>
      <p className="text-gray-600 text-xs mt-4">
        HOT Wallet · Meteor · MyNearWallet · Nightly · и другие
      </p>
    </div>
  );
}
