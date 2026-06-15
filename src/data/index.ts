import type { Puzzle } from '../types';

import animalEasy from './puzzles/animal_easy.json';
import animalNormal from './puzzles/animal_normal.json';
import animalHard from './puzzles/animal_hard.json';

import foodEasy from './puzzles/food_easy.json';
import foodNormal from './puzzles/food_normal.json';
import foodHard from './puzzles/food_hard.json';

import travelEasy from './puzzles/travel_easy.json';
import travelNormal from './puzzles/travel_normal.json';
import travelHard from './puzzles/travel_hard.json';

export const puzzles: Puzzle[] = [
  ...(animalEasy as Puzzle[]),
  ...(animalNormal as Puzzle[]),
  ...(animalHard as Puzzle[]),
  ...(foodEasy as Puzzle[]),
  ...(foodNormal as Puzzle[]),
  ...(foodHard as Puzzle[]),
  ...(travelEasy as Puzzle[]),
  ...(travelNormal as Puzzle[]),
  ...(travelHard as Puzzle[]),
];

export const getPuzzlesByTheme = (theme: string) => 
  puzzles.filter(p => p.theme === theme);

export const getPuzzlesByDifficulty = (theme: string, difficulty: string) => 
  puzzles.filter(p => p.theme === theme && p.difficulty === difficulty);

export const getPuzzleById = (id: string) => 
  puzzles.find(p => p.id === id);
