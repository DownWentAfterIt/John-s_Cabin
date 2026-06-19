import { Game } from '../types';

const STORAGE_KEY = 'game-collection-data';

const defaultGames: Game[] = [
  {
    id: '1',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    platform: 'Nintendo',
    subPlatform: 'Switch',
    rating: 5,
    completedDate: '2024-06-15',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Legend%20of%20Zelda%20Tears%20of%20the%20Kingdom%20game%20cover%20art%20epic%20fantasy%20adventure&image_size=landscape_16_9',
    notes: 'Amazing open world experience!',
    review: '',
    images: [],
    videos: []
  },
  {
    id: '2',
    name: 'Baldurs Gate 3',
    platform: 'PC',
    subPlatform: 'Steam',
    rating: 5,
    completedDate: '2024-03-20',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Baldurs%20Gate%203%20game%20cover%20art%20fantasy%20RPG%20dark%20medieval&image_size=landscape_16_9',
    notes: 'One of the best RPGs ever made.',
    review: '',
    images: [],
    videos: []
  },
  {
    id: '3',
    name: 'God of War Ragnarok',
    platform: 'PlayStation',
    subPlatform: 'PS5',
    rating: 5,
    completedDate: '2023-11-30',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=God%20of%20War%20Ragnarok%20game%20cover%20art%20epic%20norse%20mythology%20battle&image_size=landscape_16_9',
    notes: 'Masterful storytelling.',
    review: '',
    images: [],
    videos: []
  },
  {
    id: '4',
    name: 'Elden Ring',
    platform: 'PC',
    subPlatform: 'Steam',
    rating: 5,
    completedDate: '2023-04-15',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elden%20Ring%20game%20cover%20art%20dark%20fantasy%20mysterious%20epic&image_size=landscape_16_9',
    notes: 'Challenging but rewarding.',
    review: '',
    images: [],
    videos: []
  },
  {
    id: '5',
    name: 'Halo Infinite',
    platform: 'Xbox',
    subPlatform: 'Xbox Series',
    rating: 4,
    completedDate: '2023-02-10',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Halo%20Infinite%20game%20cover%20art%20sci-fi%20shooter%20Master%20Chief&image_size=landscape_16_9',
    notes: 'Great multiplayer experience.',
    review: '',
    images: [],
    videos: []
  },
  {
    id: '6',
    name: 'Genshin Impact',
    platform: 'Mobile',
    subPlatform: 'iOS',
    rating: 4,
    completedDate: '2024-01-05',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Genshin%20Impact%20game%20cover%20art%20anime%20style%20fantasy%20world&image_size=landscape_16_9',
    notes: 'Addictive gacha game.',
    review: '',
    images: [],
    videos: []
  }
];

const isValidGame = (game: unknown): game is Game => {
  if (typeof game !== 'object' || game === null) return false;
  const g = game as Game;
  return (
    typeof g.id === 'string' &&
    typeof g.name === 'string' &&
    typeof g.platform === 'string' &&
    typeof g.subPlatform === 'string' &&
    typeof g.rating === 'number' &&
    typeof g.completedDate === 'string' &&
    typeof g.coverUrl === 'string' &&
    typeof g.notes === 'string' &&
    typeof g.review === 'string' &&
    Array.isArray(g.images) &&
    Array.isArray(g.videos)
  );
};

const isValidGameArray = (data: unknown): data is Game[] => {
  if (!Array.isArray(data)) return false;
  return data.every(isValidGame);
};

export const loadGames = (): Game[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (isValidGameArray(parsed)) {
        if (parsed.length > 0) {
          return parsed;
        }
      }
    }
    saveGames(defaultGames);
    return defaultGames;
  } catch (error) {
    console.error('Failed to load games:', error);
    saveGames(defaultGames);
    return defaultGames;
  }
};

export const saveGames = (games: Game[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.error('Failed to save games:', error);
  }
};
