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

// 电子设备分类
export type DeviceCategory = 
  | 'Desktop' | 'Host' | 'Desktop Parts' | 'Laptop' | 'Monitor' | 'Mouse' | 'Keyboard' 
  | 'Gaming Headset' | 'Daily Headset' | 'Mousepad' | 'Controller' 
  | 'Handheld' | 'External Sound Card' | 'Misc';

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  purchaseDate: string;
  price: number;
  imageUrl: string;
  notes: string;
  review: string;
  images: string[];
  videos: string[];
}

// EDC物品分类
export type EDCItemCategory = 'Tool' | 'Daily' | 'Bag' | 'Electronics' | 'Perfume' | 'Stationery';

export interface EDCItem {
  id: string;
  name: string;
  category: EDCItemCategory;
  brand: string;
  imageUrl: string;
  notes: string;
  review: string;
  images: string[];
  videos: string[];
  linkedDeviceId?: string; // 如果是电子产品，可以关联到Device
}

// EDC方案
export interface EDCSetup {
  id: string;
  name: string;
  description: string;
  itemIds: string[]; // EDC物品ID数组
  imageUrl: string;
  images: string[];
  notes: string;
  review: string;
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
