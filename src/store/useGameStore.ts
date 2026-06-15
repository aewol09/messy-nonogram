import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from '../types';

interface StoreState {
  completedPuzzles: string[];
  inProgressPuzzles: Record<string, GameState>;
  settings: {
    hapticEnabled: boolean;
    darkMode: boolean;
  };
  completePuzzle: (id: string) => void;
  saveProgress: (id: string, state: GameState) => void;
  getGameState: (id: string) => GameState | null;
  resetProgress: (id: string) => void;
  updateSettings: (settings: Partial<StoreState['settings']>) => void;
  resetAllProgress: () => void;
}

export const useGameStore = create<StoreState>()(
  persist(
    (set, get) => ({
      completedPuzzles: [],
      inProgressPuzzles: {},
      settings: {
        hapticEnabled: true,
        darkMode: false,
      },
      completePuzzle: (id: string) => {
        set((state) => {
          if (!state.completedPuzzles.includes(id)) {
            return {
              completedPuzzles: [...state.completedPuzzles, id],
            };
          }
          return state;
        });
      },
      saveProgress: (id: string, gameState: GameState) => {
        set((state) => ({
          inProgressPuzzles: {
            ...state.inProgressPuzzles,
            [id]: gameState,
          },
        }));
      },
      getGameState: (id: string) => {
        const state = get();
        return state.inProgressPuzzles[id] || null;
      },
      resetProgress: (id: string) => {
        set((state) => {
          const newInProgress = { ...state.inProgressPuzzles };
          delete newInProgress[id];
          return { inProgressPuzzles: newInProgress };
        });
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      resetAllProgress: () => {
        set({
          completedPuzzles: [],
          inProgressPuzzles: {},
        });
      }
    }),
    {
      name: 'pixel-puzzle-quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
