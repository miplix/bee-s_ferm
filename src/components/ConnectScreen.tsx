"use client";

interface Props {
  onConnect: () => void;
  loading: boolean;
}

export default function ConnectScreen({ onConnect, loading }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-4">
      <div className="text-7xl mb-6">🌾</div>
      <h1 className="text-4xl font-bold mb-2 text-white">NEAR Farm</h1>
      <p className="text-gray-400 mb-8">Фермерская 2D игра на блокчейне NEAR</p>
      <button
        onClick={onConnect}
        disabled={loading}
        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-lg font-semibold transition-colors text-white"
      >
        {loading ? "Подключение..." : "🔗 Подключить кошелёк"}
      </button>
      <p className="text-gray-600 text-xs mt-4">
        HOT · Meteor · MyNearWallet · Nightly · OKX · WalletConnect
      </p>
    </div>
  );
}
