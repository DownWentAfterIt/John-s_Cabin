import { Search } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function SearchBar() {
  const searchQuery = useGameStore((state) => state.searchQuery);
  const setSearchQuery = useGameStore((state) => state.setSearchQuery);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input type="text" placeholder="Search games..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
    </div>
  );
}
