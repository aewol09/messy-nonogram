import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState, UserProfile, UserAccountData } from '../types';
import { puzzles } from '../data';

export interface RegisteredUserRecord {
  username: string;
  email: string;
  password: string;
}

interface StoreState {
  completedPuzzles: string[];
  inProgressPuzzles: Record<string, GameState>;
  hintPool: number;
  isUnlimitedHints: boolean;
  currentUser: UserProfile | null;
  accounts: Record<string, UserAccountData>;
  registeredUsers: Record<string, RegisteredUserRecord>;
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
  unlockAllPuzzles: () => void;
  
  // Hint Management
  addHints: (count: number) => void;
  useHint: () => boolean;
  setUnlimitedHints: (unlimited: boolean) => void;

  // Auth Actions
  registerUser: (username: string, email: string, password: string) => { success: boolean; message?: string };
  loginUser: (idOrEmail: string, password: string) => { success: boolean; message?: string };
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, customName?: string) => void;
  loginAsAdmin: () => void;
  loginAsGuest: () => void;
  logout: () => void;
  deleteAccount: () => void;
}

const GUEST_PROFILE: UserProfile = {
  id: 'guest_user',
  name: '게스트 유저',
  email: 'guest@messynonogram.com',
  provider: 'guest',
  isAdmin: false,
};

export const useGameStore = create<StoreState>()(
  persist(
    (set, get) => ({
      completedPuzzles: [],
      inProgressPuzzles: {},
      hintPool: 3,
      isUnlimitedHints: false,
      currentUser: GUEST_PROFILE,
      accounts: {},
      registeredUsers: {},
      settings: {
        hapticEnabled: true,
        darkMode: false,
      },

      completePuzzle: (id: string) => {
        set((state) => {
          if (!state.completedPuzzles.includes(id)) {
            const nextCompleted = [...state.completedPuzzles, id];
            const userId = state.currentUser?.id || 'guest_user';
            
            const updatedAccount: UserAccountData = {
              profile: state.currentUser || GUEST_PROFILE,
              completedPuzzles: nextCompleted,
              inProgressPuzzles: state.inProgressPuzzles,
              hintPool: state.hintPool,
              isUnlimitedHints: state.currentUser?.isAdmin ? true : false,
            };

            return {
              completedPuzzles: nextCompleted,
              accounts: {
                ...state.accounts,
                [userId]: updatedAccount,
              },
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
          const userId = state.currentUser?.id || 'guest_user';

          const updatedAccount: UserAccountData = {
            profile: state.currentUser || GUEST_PROFILE,
            completedPuzzles: state.completedPuzzles,
            inProgressPuzzles: nextInProgress,
            hintPool: state.hintPool,
            isUnlimitedHints: state.currentUser?.isAdmin ? true : false,
          };

          return {
            inProgressPuzzles: nextInProgress,
            accounts: {
              ...state.accounts,
              [userId]: updatedAccount,
            },
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
          const userId = state.currentUser?.id || 'guest_user';
          const updatedAccount: UserAccountData = {
            profile: state.currentUser || GUEST_PROFILE,
            completedPuzzles: state.completedPuzzles,
            inProgressPuzzles: newInProgress,
            hintPool: state.hintPool,
            isUnlimitedHints: state.currentUser?.isAdmin ? true : false,
          };
          return {
            inProgressPuzzles: newInProgress,
            accounts: {
              ...state.accounts,
              [userId]: updatedAccount,
            },
          };
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      resetAllProgress: () => {
        set((state) => {
          const userId = state.currentUser?.id || 'guest_user';
          const updatedAccount: UserAccountData = {
            profile: state.currentUser || GUEST_PROFILE,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: state.currentUser?.isAdmin ? true : false,
          };
          return {
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            accounts: {
              ...state.accounts,
              [userId]: updatedAccount,
            },
          };
        });
      },

      unlockAllPuzzles: () => {
        set((state) => {
          const allIds = puzzles.map((p) => p.id);
          const userId = state.currentUser?.id || 'guest_user';
          const updatedAccount: UserAccountData = {
            profile: state.currentUser || GUEST_PROFILE,
            completedPuzzles: allIds,
            inProgressPuzzles: {},
            hintPool: state.hintPool,
            isUnlimitedHints: true,
          };
          return {
            completedPuzzles: allIds,
            inProgressPuzzles: {},
            accounts: {
              ...state.accounts,
              [userId]: updatedAccount,
            },
          };
        });
      },

      // Hint Management
      addHints: (count: number) => {
        set((state) => {
          const nextPool = Math.max(0, state.hintPool + count);
          const userId = state.currentUser?.id || 'guest_user';
          const updatedAccount: UserAccountData = {
            profile: state.currentUser || GUEST_PROFILE,
            completedPuzzles: state.completedPuzzles,
            inProgressPuzzles: state.inProgressPuzzles,
            hintPool: nextPool,
            isUnlimitedHints: state.currentUser?.isAdmin ? true : false,
          };
          return {
            hintPool: nextPool,
            accounts: {
              ...state.accounts,
              [userId]: updatedAccount,
            },
          };
        });
      },

      useHint: (): boolean => {
        const state = get();
        if (state.currentUser?.isAdmin || state.isUnlimitedHints) return true;
        if (state.hintPool > 0) {
          state.addHints(-1);
          return true;
        }
        return false;
      },

      setUnlimitedHints: (unlimited: boolean) => {
        set({ isUnlimitedHints: unlimited });
      },

      // Registration & Authentication Actions
      registerUser: (username: string, email: string, password: string) => {
        const state = get();
        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        // Check if username or email already registered
        const existingKey = Object.keys(state.registeredUsers || {}).find((key) => {
          const u = state.registeredUsers[key];
          return u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername.toLowerCase();
        });

        if (existingKey) {
          return { success: false, message: '이미 가입된 아이디 또는 이메일 주소입니다.' };
        }

        const userKey = `email_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const newRecord: RegisteredUserRecord = {
          username: cleanUsername,
          email: cleanEmail,
          password: password,
        };

        set((s) => ({
          registeredUsers: {
            ...s.registeredUsers,
            [userKey]: newRecord,
          },
        }));

        // Log in immediately
        get().loginWithEmail(cleanEmail, cleanUsername);
        return { success: true };
      },

      loginUser: (idOrEmail: string, password: string) => {
        const state = get();
        const cleanInput = idOrEmail.trim();
        const cleanLower = cleanInput.toLowerCase();

        // Check Admin Credentials
        if (cleanLower === 'admin' || cleanLower === 'admin@messynonogram.com' || cleanLower === 'admin@pixelpuzzle.com') {
          if (password === 'admin123@') {
            get().loginAsAdmin();
            return { success: true, message: 'admin' };
          } else {
            return { success: false, message: '비밀번호가 올바르지 않습니다.' };
          }
        }

        // Check Registered Users
        const matchingKey = Object.keys(state.registeredUsers || {}).find((key) => {
          const u = state.registeredUsers[key];
          return u.email.toLowerCase() === cleanLower || u.username.toLowerCase() === cleanLower;
        });

        if (!matchingKey) {
          return { success: false, message: '존재하지 않거나 탈퇴한 계정입니다. 회원가입을 먼저 진행해주세요.' };
        }

        const registeredUser = state.registeredUsers[matchingKey];
        if (registeredUser.password !== password) {
          return { success: false, message: '비밀번호가 올바르지 않습니다.' };
        }

        // Login with verified credentials
        get().loginWithEmail(registeredUser.email, registeredUser.username);
        return { success: true };
      },

      loginWithGoogle: () => {
        const googleUser: UserProfile = {
          id: 'google_user_123',
          name: '구글 사용자',
          email: 'user@gmail.com',
          provider: 'google',
          isAdmin: false,
        };

        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            updatedAccounts[state.currentUser.id] = {
              profile: state.currentUser,
              completedPuzzles: state.completedPuzzles,
              inProgressPuzzles: state.inProgressPuzzles,
              hintPool: state.hintPool,
              isUnlimitedHints: state.currentUser.isAdmin ? true : false,
            };
          }

          const targetAccount = updatedAccounts[googleUser.id];
          const newAccountData: UserAccountData = targetAccount || {
            profile: googleUser,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
          };

          updatedAccounts[googleUser.id] = newAccountData;

          return {
            currentUser: googleUser,
            completedPuzzles: newAccountData.completedPuzzles,
            inProgressPuzzles: newAccountData.inProgressPuzzles,
            hintPool: newAccountData.hintPool,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
          };
        });
      },

      loginWithEmail: (email: string, customName?: string) => {
        const cleanEmail = email.trim().toLowerCase();
        const userId = `email_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const userName = customName && customName.trim() ? customName.trim() : (cleanEmail.split('@')[0] || '유저');
        const emailUser: UserProfile = {
          id: userId,
          name: userName,
          email: cleanEmail,
          provider: 'email',
          isAdmin: false,
        };

        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            updatedAccounts[state.currentUser.id] = {
              profile: state.currentUser,
              completedPuzzles: state.completedPuzzles,
              inProgressPuzzles: state.inProgressPuzzles,
              hintPool: state.hintPool,
              isUnlimitedHints: state.currentUser.isAdmin ? true : false,
            };
          }

          const targetAccount = updatedAccounts[userId];
          const newAccountData: UserAccountData = targetAccount || {
            profile: emailUser,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
          };

          updatedAccounts[userId] = newAccountData;

          return {
            currentUser: emailUser,
            completedPuzzles: newAccountData.completedPuzzles,
            inProgressPuzzles: newAccountData.inProgressPuzzles,
            hintPool: newAccountData.hintPool,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
          };
        });
      },

      loginAsAdmin: () => {
        const adminUser: UserProfile = {
          id: 'admin_user',
          name: '👑 관리자 (Admin)',
          email: 'admin@messynonogram.com',
          provider: 'email',
          isAdmin: true,
        };

        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            updatedAccounts[state.currentUser.id] = {
              profile: state.currentUser,
              completedPuzzles: state.completedPuzzles,
              inProgressPuzzles: state.inProgressPuzzles,
              hintPool: state.hintPool,
              isUnlimitedHints: state.currentUser.isAdmin ? true : false,
            };
          }

          const targetAccount = updatedAccounts[adminUser.id];
          const newAccountData: UserAccountData = targetAccount || {
            profile: adminUser,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 999,
            isUnlimitedHints: true,
          };

          newAccountData.isUnlimitedHints = true;
          updatedAccounts[adminUser.id] = newAccountData;

          return {
            currentUser: adminUser,
            completedPuzzles: newAccountData.completedPuzzles,
            inProgressPuzzles: newAccountData.inProgressPuzzles,
            hintPool: newAccountData.hintPool,
            isUnlimitedHints: true,
            accounts: updatedAccounts,
          };
        });
      },

      loginAsGuest: () => {
        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            updatedAccounts[state.currentUser.id] = {
              profile: state.currentUser,
              completedPuzzles: state.completedPuzzles,
              inProgressPuzzles: state.inProgressPuzzles,
              hintPool: state.hintPool,
              isUnlimitedHints: state.currentUser.isAdmin ? true : false,
            };
          }

          const guestAccount = updatedAccounts[GUEST_PROFILE.id] || {
            profile: GUEST_PROFILE,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
          };

          updatedAccounts[GUEST_PROFILE.id] = guestAccount;

          return {
            currentUser: GUEST_PROFILE,
            completedPuzzles: guestAccount.completedPuzzles,
            inProgressPuzzles: guestAccount.inProgressPuzzles,
            hintPool: guestAccount.hintPool,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
          };
        });
      },

      logout: () => {
        set((state) => {
          const updatedAccounts = { ...state.accounts };
          if (state.currentUser) {
            updatedAccounts[state.currentUser.id] = {
              profile: state.currentUser,
              completedPuzzles: state.completedPuzzles,
              inProgressPuzzles: state.inProgressPuzzles,
              hintPool: state.hintPool,
              isUnlimitedHints: state.currentUser.isAdmin ? true : false,
            };
          }

          const guestAccount = updatedAccounts[GUEST_PROFILE.id] || {
            profile: GUEST_PROFILE,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
          };

          updatedAccounts[GUEST_PROFILE.id] = guestAccount;

          return {
            currentUser: GUEST_PROFILE,
            completedPuzzles: guestAccount.completedPuzzles,
            inProgressPuzzles: guestAccount.inProgressPuzzles,
            hintPool: guestAccount.hintPool,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
          };
        });
      },

      deleteAccount: () => {
        set((state) => {
          const updatedAccounts = { ...state.accounts };
          const updatedRegistered = { ...state.registeredUsers };

          if (state.currentUser) {
            delete updatedAccounts[state.currentUser.id];

            // Remove from registeredUsers matching currentUser
            const matchingKey = Object.keys(updatedRegistered).find((key) => {
              const u = updatedRegistered[key];
              return (
                u.email.toLowerCase() === state.currentUser?.email.toLowerCase() ||
                u.username.toLowerCase() === state.currentUser?.name.toLowerCase()
              );
            });
            if (matchingKey) {
              delete updatedRegistered[matchingKey];
            }
          }

          const guestAccount = updatedAccounts[GUEST_PROFILE.id] || {
            profile: GUEST_PROFILE,
            completedPuzzles: [],
            inProgressPuzzles: {},
            hintPool: 3,
            isUnlimitedHints: false,
          };

          return {
            currentUser: GUEST_PROFILE,
            completedPuzzles: guestAccount.completedPuzzles,
            inProgressPuzzles: guestAccount.inProgressPuzzles,
            hintPool: guestAccount.hintPool,
            isUnlimitedHints: false,
            accounts: updatedAccounts,
            registeredUsers: updatedRegistered,
          };
        });
      },
    }),
    {
      name: 'messy-nonogram-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
