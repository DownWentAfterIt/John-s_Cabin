export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'Mobile';

export type SubPlatform = 
  | 'Steam' | 'Ubisoft Connect' | 'EA' | 'Epic Games Store' | 'GOG' | 'Misc'
  | 'PS' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'PSV'
  | 'Xbox' | 'Xbox 360' | 'Xbox One' | 'Xbox Series'
  | 'FC' | 'SFC' | 'N64' | 'NGC' | 'GB' | 'GBA' | 'NDS' | '3DS/2DS' | 'Wii' | 'Wii U' | 'Switch' | 'Switch 2' | 'Legacy'
  | 'Android' | 'iOS';

export interface Game {
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

export interface GameStore {
  games: Game[];
  searchQuery: string;
  selectedPlatform: Platform | 'All';
  addGame: (game: Omit<Game, 'id'>) => void;
  updateGame: (id: string, game: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: Platform | 'All') => void;
  getFilteredGames: () => Game[];
}
