import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Star, Edit, Trash2, X, ArrowLeft, Image, Video, ChevronRight, Upload } from "lucide-react";
import { fileToBase64, isImageFile, isVideoFile, formatFileSize } from "../utils/upload";
import { ModuleHeader } from "../components/ModuleHeader";
import { useAuth } from "../contexts/AuthContext";

type Platform = "PC" | "PlayStation" | "Xbox" | "Nintendo" | "Mobile";

type SubPlatform = 
  | "Steam" | "Ubisoft Connect" | "EA" | "Epic Games Store" | "GOG" | "Misc"
  | "PS" | "PS2" | "PS3" | "PS4" | "PS5" | "PSP" | "PSV"
  | "Xbox" | "Xbox 360" | "Xbox One" | "Xbox Series"
  | "FC" | "SFC" | "N64" | "NGC" | "GB" | "GBA" | "NDS" | "3DS/2DS" | "Wii" | "Wii U" | "Switch" | "Switch 2" | "Legacy"
  | "Android" | "iOS";

interface Game {
  id: string;
  name: string;
  platform: Platform;
  subPlatform: SubPlatform;
  rating: number;
  completedDate: string;
  coverUrl: string;
  notes: string;
  review: string;
  images: string[];
  videos: string[];
}

const platformConfig: Record<Platform, { name: string; subPlatforms: SubPlatform[] }> = {
  PC: {
    name: "PC",
    subPlatforms: ["Steam", "Ubisoft Connect", "EA", "Epic Games Store", "GOG", "Misc"]
  },
  PlayStation: {
    name: "PlayStation",
    subPlatforms: ["PS", "PS2", "PS3", "PS4", "PS5", "PSP", "PSV"]
  },
  Xbox: {
    name: "Xbox",
    subPlatforms: ["Xbox", "Xbox 360", "Xbox One", "Xbox Series"]
  },
  Nintendo: {
    name: "Nintendo",
    subPlatforms: ["FC", "SFC", "N64", "NGC", "GB", "GBA", "NDS", "3DS/2DS", "Wii", "Wii U", "Switch", "Switch 2", "Legacy"]
  },
  Mobile: {
    name: "Mobile",
    subPlatforms: ["Android", "iOS"]
  }
};

const platforms: (Platform | "All")[] = ["All", "PC", "PlayStation", "Xbox", "Nintendo", "Mobile"];

function getPlatformLabel(platform: Platform | "All"): string {
  if (platform === "All") return "全部";
  return platform;
}

function getSubPlatformLabel(subPlatform: SubPlatform | "All"): string {
  if (subPlatform === "All") return "全部";
  if (subPlatform === "Misc") return "其它";
  return subPlatform;
}

const STORAGE_KEY = "game-collection-data";

const defaultGames: Game[] = [
  {
    id: "1",
    name: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo",
    subPlatform: "Switch",
    rating: 5,
    completedDate: "2024-06-15",
    coverUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Legend%20of%20Zelda%20Tears%20of%20the%20Kingdom%20game%20cover%20art%20epic%20fantasy%20adventure&image_size=landscape_16_9",
    notes: "Amazing open world experience!",
    review: "The Legend of Zelda: Tears of the Kingdom is a masterpiece of game design. The open world is vast and filled with countless secrets to discover. The Ultrahand ability adds a whole new dimension to puzzle solving, allowing you to create anything your imagination can conjure. The story is heartfelt and engaging, with memorable characters and epic moments. This is easily one of the best games ever made.",
    images: [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zelda%20Tears%20of%20Kingdom%20gameplay%20flying%20on%20zonai%20device%20epic%20sky%20islands&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zelda%20Tears%20of%20Kingdom%20underground%20caves%20mysterious%20dark%20atmosphere&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Zelda%20Tears%20of%20Kingdom%20Link%20using%20Ultrahand%20building%20vehicle&image_size=landscape_16_9"
    ],
    videos: []
  },
  {
    id: "2",
    name: "Baldurs Gate 3",
    platform: "PC",
    subPlatform: "Steam",
    rating: 5,
    completedDate: "2024-03-20",
    coverUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Baldurs%20Gate%203%20game%20cover%20art%20fantasy%20RPG%20dark%20medieval&image_size=landscape_16_9",
    notes: "One of the best RPGs ever made.",
    review: "Baldur's Gate 3 sets a new standard for RPGs. The writing is exceptional, with deep characters and branching storylines that make every playthrough unique. The turn-based combat is strategic and satisfying, with a vast array of spells and abilities to master. The game respects your choices and makes you feel like every decision matters. A must-play for any RPG fan.",
    images: [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Baldurs%20Gate%203%20party%20adventure%20fantasy%20medieval%20forest&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Baldurs%20Gate%203%20combat%20scene%20spells%20magic%20dark%20dungeon&image_size=landscape_16_9"
    ],
    videos: []
  },
  {
    id: "3",
    name: "God of War Ragnarok",
    platform: "PlayStation",
    subPlatform: "PS5",
    rating: 5,
    completedDate: "2023-11-30",
    coverUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=God%20of%20War%20Ragnarok%20game%20cover%20art%20epic%20norse%20mythology%20battle&image_size=landscape_16_9",
    notes: "Masterful storytelling.",
    review: "God of War Ragnarok is a triumph of narrative-driven game design. The relationship between Kratos and Atreus is at the heart of the story, and their journey through Norse mythology is both epic and deeply personal. The combat is visceral and satisfying, with new weapons and abilities that keep the gameplay fresh. The game is visually stunning, with breathtaking environments and incredible attention to detail.",
    images: [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=God%20of%20War%20Ragnarok%20Kratos%20Atreus%20norse%20landscape%20epic%20mountains&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=God%20of%20War%20Ragnarok%20battle%20giants%20epic%20action%20fire&image_size=landscape_16_9"
    ],
    videos: []
  },
  {
    id: "4",
    name: "Elden Ring",
    platform: "PC",
    subPlatform: "Steam",
    rating: 5,
    completedDate: "2023-04-15",
    coverUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elden%20Ring%20game%20cover%20art%20dark%20fantasy%20mysterious%20epic&image_size=landscape_16_9",
    notes: "Challenging but rewarding.",
    review: "Elden Ring is FromSoftware's magnum opus. The open world is a marvel of design, with hidden dungeons, secret paths, and epic bosses around every corner. The combat is punishing but fair, and mastering the game's mechanics is incredibly satisfying. The game's lore is deep and mysterious, inviting you to piece together the story from cryptic clues and environmental storytelling. A landmark achievement in gaming.",
    images: [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elden%20Ring%20open%20world%20castle%20golden%20light%20fantasy%20landscape&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elden%20Ring%20epic%20boss%20battle%20dark%20knight%20fire%20magic&image_size=landscape_16_9"
    ],
    videos: []
  },
  {
    id: "5",
    name: "Halo Infinite",
    platform: "Xbox",
    subPlatform: "Xbox Series",
    rating: 4,
    completedDate: "2023-02-10",
    coverUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Halo%20Infinite%20game%20cover%20art%20sci-fi%20shooter%20Master%20Chief&image_size=landscape_16_9",
    notes: "Great multiplayer experience.",
    review: "Halo Infinite marks a return to form for the franchise. The campaign is a love letter to classic Halo, with open world sections that feel fresh while maintaining the series' signature gameplay. Master Chief is back in top form, and the story sets up exciting possibilities for the future. The multiplayer is fast, fun, and addictive, with a progression system that rewards skill and dedication.",
    images: [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Halo%20Infinite%20Master%20Chief%20sci-fi%20armor%20blue%20energy%20sword&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Halo%20Infinite%20multiplayer%20battle%20spartans%20vehicles%20explosions&image_size=landscape_16_9"
    ],
    videos: []
  },
  {
    id: "6",
    name: "Genshin Impact",
    platform: "Mobile",
    subPlatform: "iOS",
    rating: 4,
    completedDate: "2024-01-05",
    coverUrl: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Genshin%20Impact%20game%20cover%20art%20anime%20style%20fantasy%20world&image_size=landscape_16_9",
    notes: "Addictive gacha game.",
    review: "Genshin Impact is a surprisingly deep and polished open world RPG for mobile. The world of Teyvat is beautiful and expansive, with diverse regions to explore and countless secrets to find. The combat system is fast and flashy, with elemental reactions adding strategic depth. While the gacha system can be frustrating, the free-to-play experience is generous enough to enjoy the game without spending money.",
    images: [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Genshin%20Impact%20anime%20characters%20beautiful%20landscape%20fantasy%20world&image_size=landscape_16_9",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Genshin%20Impact%20combat%20magic%20elemental%20attacks%20anime%20style&image_size=landscape_16_9"
    ],
    videos: []
  }
];

function loadGamesFromStorage(): Game[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(g => {
          let platform = g.platform as string;
          let subPlatform = g.subPlatform as SubPlatform;
          
          if (platform === "PS") platform = "PlayStation";
          if (platform === "Switch") platform = "Nintendo";
          
          let finalPlatform = platform as Platform;
          if (!platformConfig[finalPlatform]) {
            finalPlatform = "PC";
          }
          if (!subPlatform || !platformConfig[finalPlatform].subPlatforms.includes(subPlatform)) {
            subPlatform = platformConfig[finalPlatform].subPlatforms[0];
          }
          
          return {
            ...g,
            platform: finalPlatform,
            subPlatform,
            review: g.review || "",
            images: g.images || [],
            videos: g.videos || []
          };
        });
      }
    }
  } catch (e) {
    console.error("Failed to load games:", e);
  }
  return defaultGames;
}

function saveGamesToStorage(games: Game[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    console.error("Failed to save games:", e);
  }
}

function GameCard({ game, onEdit, onDelete, onViewDetail, isAuthenticated }: { game: Game; onEdit: (game: Game) => void; onDelete: (id: string) => void; onViewDetail: (game: Game) => void; isAuthenticated: boolean }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer" onClick={() => onViewDetail(game)}>
      <div className="relative aspect-video overflow-hidden">
        <img src={game.coverUrl} alt={game.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-2 right-2 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < game.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`} />
          ))}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="px-2 py-1 bg-slate-900/70 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {game.platform}
          </span>
          <span className="px-2 py-1 bg-blue-600/70 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {game.subPlatform}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-blue-600/80 backdrop-blur-sm rounded-md text-xs font-medium text-white">
          查看详情
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-2">{game.name}</h3>
        <p className="text-xs text-slate-400 mb-3">完成日期: {game.completedDate}</p>
        {game.notes && (
          <p className="text-sm text-slate-300 mb-4 line-clamp-2">{game.notes}</p>
        )}
        {isAuthenticated && (
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(game); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
              <Edit className="w-4 h-4" />
              编辑
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(game.id); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GameDetail({ game, onBack, onEdit, isAuthenticated }: { game: Game; onBack: () => void; onEdit?: () => void; isAuthenticated: boolean }) {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* 模糊封面背景 */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${game.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) saturate(150%)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="fixed inset-0 z-0 bg-slate-900/70" />
      
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <h1 className="text-xl font-bold text-white">游戏详情</h1>
            </div>
            {isAuthenticated && onEdit && (
              <button onClick={onEdit} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <Edit className="w-5 h-5 text-slate-300" />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden mb-6">
          <div className="relative h-64 sm:h-80">
            <img src={game.coverUrl} alt={game.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-xs font-medium">
                  {game.platform}
                </span>
                <span className="px-2 py-1 bg-blue-600/80 text-white rounded-md text-xs font-medium">
                  {game.subPlatform}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < game.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`} />
                  ))}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{game.name}</h2>
              <p className="text-sm text-slate-400 mt-1">完成日期: {game.completedDate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {game.review && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">我的评价</h3>
              <div className="text-slate-300 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: game.review }} />
            </div>
          )}

          {game.images && game.images.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">图片库</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden group">
                    <img src={image} alt={`${game.name} screenshot ${index + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{index + 1} / {game.images.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {game.videos && game.videos.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">视频</h3>
              </div>
              <div className="space-y-4">
                {game.videos.map((video, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <video src={video} controls className="w-full h-48 bg-slate-900" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {game.notes && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">简评</h3>
              <p className="text-slate-300">{game.notes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function GameModal({ game, onClose, onEditDetail }: { game?: Game | null; onClose: () => void; onEditDetail?: () => void }) {
  const isEdit = !!game;
  const [formData, setFormData] = useState({
    name: game?.name || "",
    platform: game?.platform || "PC",
    subPlatform: game?.subPlatform || platformConfig["PC"].subPlatforms[0],
    rating: game?.rating || 3,
    completedDate: game?.completedDate || new Date().toISOString().split("T")[0],
    coverUrl: game?.coverUrl || "",
    notes: game?.notes || ""
  });

  const handlePlatformChange = (platform: Platform) => {
    const defaultSubPlatform = platformConfig[platform].subPlatforms[0];
    setFormData(prev => ({ ...prev, platform, subPlatform: defaultSubPlatform }));
  };

  const [uploading, setUploading] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isImageFile(file)) return;

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, coverUrl: base64 }));
    } catch (error) {
      console.error("Failed to upload cover image:", error);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onClose();
    if (isEdit && game) {
      window.dispatchEvent(new CustomEvent("update-game", { detail: { id: game.id, data: formData } }));
    } else {
      window.dispatchEvent(new CustomEvent("add-game", { detail: { ...formData, review: "", images: [], videos: [] } }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "编辑游戏" : "添加游戏"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">名称</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">平台</label>
            <select value={formData.platform} onChange={(e) => handlePlatformChange(e.target.value as Platform)} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50">
              {platforms.filter(p => p !== "All").map((platform) => (
                <option key={platform} value={platform}>{platformConfig[platform].name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">子平台</label>
            <select value={formData.subPlatform} onChange={(e) => setFormData({ ...formData, subPlatform: e.target.value as SubPlatform })} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50">
              {platformConfig[formData.platform].subPlatforms.map((subPlatform) => (
                <option key={subPlatform} value={subPlatform}>{getSubPlatformLabel(subPlatform)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">评分</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} type="button" onClick={() => setFormData({ ...formData, rating })} className={`p-2 rounded-lg transition-all ${formData.rating >= rating ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-slate-700/50"}`}>
                  <Star className={`w-6 h-6 ${formData.rating >= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-400"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">完成日期</label>
            <input type="date" value={formData.completedDate} onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">封面图片</label>
            <div className="flex gap-2 mb-2">
              <input type="url" value={formData.coverUrl.startsWith("data:") ? "" : formData.coverUrl} onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })} placeholder="Image URL or upload below" className="flex-1 px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50" />
              <label className="px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{uploading ? "上传中..." : "上传"}</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            </div>
            {formData.coverUrl && (
              <div className="flex items-center gap-2">
                <img src={formData.coverUrl} alt="Cover preview" className="w-20 h-12 object-cover rounded-lg" />
                <span className="text-xs text-slate-400">Cover preview</span>
              </div>
            )}
          </div>
          {isEdit && onEditDetail && (
            <div>
              <button
                type="button"
                onClick={onEditDetail}
                className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 border-dashed rounded-lg text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                编辑详情内容
              </button>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">简评</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} placeholder="Write some quick notes..." className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
              取消
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              {isEdit ? "保存更改" : "添加游戏"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "All">("All");
  const [selectedSubPlatform, setSelectedSubPlatform] = useState<SubPlatform | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    const loaded = loadGamesFromStorage();
    setGames(loaded);
  }, []);

  useEffect(() => {
    const handleAddGame = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const newGame: Game = {
        ...detail,
        id: Date.now().toString(),
        review: detail.review || "",
        images: detail.images || [],
        videos: detail.videos || []
      };
      setGames(prev => {
        const updated = [...prev, newGame];
        saveGamesToStorage(updated);
        return updated;
      });
    };

    const handleUpdateGame = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setGames(prev => {
        const updated = prev.map(g => g.id === detail.id ? { ...g, ...detail.data } : g);
        saveGamesToStorage(updated);
        return updated;
      });
    };

    window.addEventListener("add-game", handleAddGame);
    window.addEventListener("update-game", handleUpdateGame);

    return () => {
      window.removeEventListener("add-game", handleAddGame);
      window.removeEventListener("update-game", handleUpdateGame);
    };
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = selectedPlatform === "All" || game.platform === selectedPlatform;
      const matchesSubPlatform = selectedSubPlatform === "All" || game.subPlatform === selectedSubPlatform;
      return matchesSearch && matchesPlatform && matchesSubPlatform;
    });
  }, [games, searchQuery, selectedPlatform, selectedSubPlatform]);

  const handleDeleteGame = (id: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      setGames(prev => {
        const updated = prev.filter(g => g.id !== id);
        saveGamesToStorage(updated);
        return updated;
      });
    }
  };

  if (selectedGame) {
    return <GameDetail game={selectedGame} onBack={() => setSelectedGame(null)} onEdit={() => navigate(`/edit/${selectedGame.id}`)} isAuthenticated={isAuthenticated} />;
  }

  return (
    <div className="min-h-screen pb-20">
      <ModuleHeader 
        title="John's Cabin" 
        subtitle="Track my Gaming Life" 
        onAdd={() => setModalOpen(true)} 
        addLabel="添加游戏" 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="搜索游戏..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button key={platform} onClick={() => { setSelectedPlatform(platform); setSelectedSubPlatform("All"); }} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPlatform === platform ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50"}`}>
                {getPlatformLabel(platform)}
              </button>
            ))}
          </div>
          {selectedPlatform !== "All" && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedSubPlatform("All")} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedSubPlatform === "All" ? "bg-blue-600 text-white" : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"}`}>
                全部 {platformConfig[selectedPlatform].name}
              </button>
              {platformConfig[selectedPlatform].subPlatforms.map((subPlatform) => (
                <button key={subPlatform} onClick={() => setSelectedSubPlatform(subPlatform)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedSubPlatform === subPlatform ? "bg-blue-600 text-white" : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"}`}>
                  {getSubPlatformLabel(subPlatform)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">游戏</h2>
          <p className="text-sm text-slate-400">{filteredGames.length} 个游戏</p>
        </div>
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 text-6xl mb-4">??</div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">未找到游戏</h3>
            <p className="text-sm text-slate-500">开始您的收藏！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} onEdit={(g) => { setEditingGame(g); setModalOpen(true); }} onDelete={handleDeleteGame} onViewDetail={setSelectedGame} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        )}
      </main>
      {modalOpen && (
        <GameModal
          game={editingGame}
          onClose={() => { setModalOpen(false); setEditingGame(null); }}
          onEditDetail={() => {
            if (editingGame) {
              navigate(`/edit/${editingGame.id}`);
            }
          }}
        />
      )}
    </div>
  );
}
