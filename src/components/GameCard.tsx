import { Star, Edit, Trash2 } from "lucide-react";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

export function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden card-hover group">
      <div className="relative aspect-video overflow-hidden">
        <img src={game.coverUrl} alt={game.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-2 right-2 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < game.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`} />
          ))}
        </div>
        <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/70 backdrop-blur-sm rounded-md text-xs font-medium text-white">
          {game.platform}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-2">{game.name}</h3>
        <p className="text-xs text-slate-400 mb-3">Completed: {game.completedDate}</p>
        {game.notes && (
          <p className="text-sm text-slate-300 mb-4 line-clamp-2">{game.notes}</p>
        )}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(game)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button onClick={() => onDelete(game.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
