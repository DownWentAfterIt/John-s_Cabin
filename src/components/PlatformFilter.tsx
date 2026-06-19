import { Platform } from "../types";
import { useGameStore } from "../store/gameStore";

const platforms: (Platform | "All")[] = ["All", "PC", "PlayStation", "Xbox", "Nintendo", "Mobile"];

export function PlatformFilter() {
  const selectedPlatform = useGameStore((state) => state.selectedPlatform);
  const setSelectedPlatform = useGameStore((state) => state.setSelectedPlatform);

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <button key={platform} onClick={() => setSelectedPlatform(platform)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPlatform === platform ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50"}`}>
          {platform}
        </button>
      ))}
    </div>
  );
}
