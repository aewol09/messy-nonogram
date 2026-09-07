export type ThemeType = 'animal' | 'food' | 'travel';
export type DifficultyType = 'easy' | 'normal' | 'hard';

export interface Puzzle {
  id: string;
  theme: ThemeType;
  difficulty: DifficultyType;
  name: string;
  width: number;
  height: number;
  solution: number[][]; // 1 for filled, 0 for empty
  colorSolution?: string[][]; // Hex color code strings for each cell when completed
}

export interface CellState {
  value: number; // 0: empty, 1: filled, 2: X
}

export interface GameState {
  board: CellState[][];
  isComplete: boolean;
  hintsUsed: number;
}

// User progress storage
export interface UserProgress {
  completedPuzzles: string[]; // List of completed puzzle IDs
  inProgressPuzzles: Record<string, GameState>; // id -> current state
  hintCounts: Record<string, number>; // id -> hints used
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'email' | 'guest';
  isAdmin?: boolean;
}

export interface UserAccountData {
  profile: UserProfile;
  completedPuzzles: string[];
  inProgressPuzzles: Record<string, GameState>;
  hintPool: number;
  isUnlimitedHints: boolean;
}
