import { Gamepad2, Plus } from "lucide-react";

interface HeaderProps {
  onAddGame: () => void;
}

export function Header({ onAddGame }: HeaderProps) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Game Collection</h1>
              <p className="text-xs text-slate-400">Track your completed games</p>
            </div>
          </div>
          <button onClick={onAddGame} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
}
