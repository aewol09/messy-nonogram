import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState, UserProfile, UserAccountData } from '../types';

interface StoreState {
  completedPuzzles: string[];
  inProgressPuzzles: Record<string, GameState>;
  hintPool: number;
  isUnlimitedHints: boolean;
  currentUser: UserProfile | null;
  accounts: Record<string, UserAccountData>;
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
  
  // Hint Management
  addHints: (count: number) => void;
  setUnlimitedHints: (unlimited: boolean) => void;

  // Auth Actions
  loginWithGoogle: () => void;
  loginWithEmail: (email: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  deleteAccount: () => void;
}

export const useGameStore = create<StoreState>()(
  persist(
    (set, get) => ({
      completedPuzzles: [],
      inProgressPuzzles: {},
      hintPool: 3, // Default extra hints
      isUnlimitedHints: false,
      currentUser: {
        id: 'guest_user',
        name: '게스트 유저',
        email: 'guest@pixelpuzzle.com',
        provider: 'guest',
      },
      accounts: {},
      settings: {
        hapticEnabled: true,
        darkMode: false,
      },

      completePuzzle: (id: string) => {
        set((state) => {
          if (!state.completedPuzzles.includes(id)) {
            const nextCompleted = [...state.completedPuzzles, id];
            const currentAccount = state.currentUser ? state.accounts[state.currentUser.id] : null;
            
            const updatedAccounts = state.currentUser ? {
              ...state.accounts,
              [state.currentUser.id]: {
                profile: state.currentUser,
                completedPuzzles: nextCompleted,
                inProgressPuzzles: state.inProgressPuzzles,
                hintPool: state.hintPool,
                isUnlimitedHints: state.isUnlimitedHints,
                ...(currentAccount || {}),
              }
            } : state.accounts;

            return {
              completedPuzzles: nextCompleted,
              accounts: updatedAccounts,
            };
          }
          return state;
        });
      },

      saveProgress: (id: string, gameState: GameState) => {
        set((state) => {
          const nextInProgress = {
            ...state.inProgressPuzzles,
            [id]: gameState,
          };

          const updatedAccounts = state.currentUser ? {
            ...state.accounts,
            [state.currentUser.id]: {
              profile: state.currentUser,
              completedPuzzles: state.completedPuzzles,
              inProgressPuzzles: nextInProgress,
              hintPool: state.hintPool,
              isUnlimitedHints: state.isUnlimitedHints,
            }
          } : state.accounts;

          return {
            inProgressPuzzles: nextInProgress,
            accounts: updatedAccounts,
          };
        });
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
        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            delete updatedAccounts[state.currentUser.id];
          }
          return {
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
          };
        });
      },

      // Hint Refill Actions
      addHints: (count: number) => {
        set((state) => ({ hintPool: state.hintPool + count }));
      },

      setUnlimitedHints: (unlimited: boolean) => {
        set({ isUnlimitedHints: unlimited });
      },

      // Authentication Actions
      loginWithGoogle: () => {
        const googleUser: UserProfile = {
          id: 'google_user_123',
          name: '구글 사용자',
          email: 'user@gmail.com',
          provider: 'google',
        };

        set((state) => {
          const savedAccount = state.accounts[googleUser.id];
          return {
            currentUser: googleUser,
            completedPuzzles: savedAccount ? savedAccount.completedPuzzles : state.completedPuzzles,
            inProgressPuzzles: savedAccount ? savedAccount.inProgressPuzzles : state.inProgressPuzzles,
            hintPool: savedAccount ? savedAccount.hintPool : state.hintPool,
            isUnlimitedHints: savedAccount ? savedAccount.isUnlimitedHints : state.isUnlimitedHints,
            accounts: {
              ...state.accounts,
              [googleUser.id]: savedAccount || {
                profile: googleUser,
                completedPuzzles: state.completedPuzzles,
                inProgressPuzzles: state.inProgressPuzzles,
                hintPool: state.hintPool,
                isUnlimitedHints: state.isUnlimitedHints,
              }
            }
          };
        });
      },

      loginWithEmail: (email: string) => {
        const userId = `email_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const userName = email.split('@')[0] || '유저';
        const emailUser: UserProfile = {
          id: userId,
          name: userName,
          email,
          provider: 'email',
        };

        set((state) => {
          const savedAccount = state.accounts[userId];
          return {
            currentUser: emailUser,
            completedPuzzles: savedAccount ? savedAccount.completedPuzzles : state.completedPuzzles,
            inProgressPuzzles: savedAccount ? savedAccount.inProgressPuzzles : state.inProgressPuzzles,
            hintPool: savedAccount ? savedAccount.hintPool : state.hintPool,
            isUnlimitedHints: savedAccount ? savedAccount.isUnlimitedHints : state.isUnlimitedHints,
            accounts: {
              ...state.accounts,
              [userId]: savedAccount || {
                profile: emailUser,
                completedPuzzles: state.completedPuzzles,
                inProgressPuzzles: state.inProgressPuzzles,
                hintPool: state.hintPool,
                isUnlimitedHints: state.isUnlimitedHints,
              }
            }
          };
        });
      },

      loginAsGuest: () => {
        const guestUser: UserProfile = {
          id: 'guest_user',
          name: '게스트 유저',
          email: 'guest@pixelpuzzle.com',
          provider: 'guest',
        };
        set({ currentUser: guestUser });
      },

      logout: () => {
        set({
          currentUser: null,
        });
      },

      deleteAccount: () => {
        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            delete updatedAccounts[state.currentUser.id];
          }
          return {
            currentUser: {
              id: 'guest_user',
              name: '게스트 유저',
              email: 'guest@pixelpuzzle.com',
              provider: 'guest',
            },
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
          };
        });
      },
    }),
    {
      name: 'pixel-puzzle-quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

