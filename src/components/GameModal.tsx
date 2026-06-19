import { useState } from "react";
import { X, Star } from "lucide-react";
import { Game, Platform, SubPlatform } from "../types";
import { useGameStore } from "../store/gameStore";

interface GameModalProps {
  game?: Game | null;
  onClose: () => void;
}

const platforms: Platform[] = ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"];

const platformConfig: Record<Platform, SubPlatform[]> = {
  PC: ["Steam", "Ubisoft Connect", "EA", "Epic Games Store", "GOG", "Misc"],
  PlayStation: ["PS", "PS2", "PS3", "PS4", "PS5", "PSP", "PSV"],
  Xbox: ["Xbox", "Xbox 360", "Xbox One", "Xbox Series"],
  Nintendo: ["FC", "SFC", "N64", "NGC", "GB", "GBA", "NDS", "3DS/2DS", "Wii", "Wii U", "Switch", "Switch 2", "Legacy"],
  Mobile: ["Android", "iOS"]
};

export function GameModal({ game, onClose }: GameModalProps) {
  const isEdit = !!game;
  const [formData, setFormData] = useState({
    name: game?.name || "",
    platform: game?.platform || "PC",
    subPlatform: game?.subPlatform || platformConfig["PC"][0],
    rating: game?.rating || 3,
    completedDate: game?.completedDate || new Date().toISOString().split("T")[0],
    coverUrl: game?.coverUrl || "",
    notes: game?.notes || ""
  });

  const addGame = useGameStore((state) => state.addGame);
  const updateGame = useGameStore((state) => state.updateGame);

  const handlePlatformChange = (platform: Platform) => {
    setFormData(prev => ({ ...prev, platform, subPlatform: platformConfig[platform][0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    if (isEdit && game) {
      updateGame(game.id, formData);
    } else {
      addGame({ ...formData, review: "", images: [], videos: [] });
    }
    onClose();
  };

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit Game" : "Add New Game"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Game Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Platform</label>
            <select value={formData.platform} onChange={(e) => handlePlatformChange(e.target.value as Platform)} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50">
              {platforms.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Sub Platform</label>
            <select value={formData.subPlatform} onChange={(e) => setFormData({ ...formData, subPlatform: e.target.value as SubPlatform })} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50">
              {platformConfig[formData.platform].map((subPlatform) => (
                <option key={subPlatform} value={subPlatform}>{subPlatform}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} type="button" onClick={() => handleRatingChange(rating)} className={`p-2 rounded-lg transition-all ${formData.rating >= rating ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-slate-700/50"}`}>
                  <Star className={`w-6 h-6 ${formData.rating >= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-400"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Completed Date</label>
            <input type="date" value={formData.completedDate} onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Cover Image URL (optional)</label>
            <input type="url" value={formData.coverUrl} onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })} placeholder="https://example.com/cover.jpg" className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes (optional)</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Write your thoughts about the game..." className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              {isEdit ? "Save Changes" : "Add Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
