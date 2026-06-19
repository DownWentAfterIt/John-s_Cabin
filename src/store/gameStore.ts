import { create } from 'zustand';
import { Game, Platform, GameStore } from '../types';
import { loadGames, saveGames } from '../utils/storage';

console.log('Initializing game store...');

export const useGameStore = create<GameStore>((set, get) => ({
  games: loadGames(),
  searchQuery: '',
  selectedPlatform: 'All',

  addGame: (game) => {
    const newGame: Game = {
      ...game,
      id: Date.now().toString()
    };
    set((state) => {
      const updatedGames = [...state.games, newGame];
      saveGames(updatedGames);
      return { games: updatedGames };
    });
  },

  updateGame: (id, game) => {
    set((state) => {
      const updatedGames = state.games.map((g) =>
        g.id === id ? { ...g, ...game } : g
      );
      saveGames(updatedGames);
      return { games: updatedGames };
    });
  },

  deleteGame: (id) => {
    set((state) => {
      const updatedGames = state.games.filter((g) => g.id !== id);
      saveGames(updatedGames);
      return { games: updatedGames };
    });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedPlatform: (platform) => {
    set({ selectedPlatform: platform });
  },

  getFilteredGames: () => {
    const state = get();
    return state.games.filter((game) => {
      const matchesSearch = game.name
        .toLowerCase()
        .includes(state.searchQuery.toLowerCase());
      const matchesPlatform =
        state.selectedPlatform === 'All' || game.platform === state.selectedPlatform;
      return matchesSearch && matchesPlatform;
    });
  }
}));

const initialState = useGameStore.getState();
console.log('Initial games loaded:', initialState.games.length);
