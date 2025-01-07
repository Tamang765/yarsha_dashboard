import React from "react";

type StatsModalProps = {
  isOpen: boolean;
  stats: {
    coins: number;
    experience_point: number;
    games_played: number;
    games_won: number;
  } | null;
  onClose: () => void;
};

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, stats, onClose }) => {
  if (!isOpen || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
          Player Statistics
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Coins:</span>
            <span className="text-gray-800">{stats.coins}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Experience:</span>
            <span className="text-gray-800">{stats.experience_point}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Games Played:</span>
            <span className="text-gray-800">{stats.games_played}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Games Won:</span>
            <span className="text-gray-800">{stats.games_won}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsModal;
