# Pixel Puzzle Quest - Implementation Plan

## 1. Overview
A Nonogram (Picross) puzzle game built with Flutter.
- Offline only, no ads, no IAPs.
- Themes: Animal, Food, Travel.
- Difficulties: Easy (5x5), Normal (10x10), Hard (15x15).
- Total Puzzles: 90 (10 per difficulty per theme).

## 2. Architecture
- **State Management**: `provider` using the MVVM pattern.
- **Data Persistence**: `shared_preferences` for storing game state, hints, and collections.
- **Assets**: Puzzles stored as JSON files in `assets/puzzles/`.

## 3. Implementation Steps

### Step 1: Project Setup & Dependencies
- Update `pubspec.yaml` with required dependencies: `provider`, `shared_preferences`, `flutter_animate`, `vibration`.
- Setup directory structure (`lib/core`, `lib/models`, `lib/services`, `lib/viewmodels`, `lib/views`, `lib/widgets`).

### Step 2: Data Models & Services
- `Puzzle` model: Represents a single puzzle (grid size, row/col hints, solution, current state).
- `ThemeData` model: Represents theme progress.
- `StorageService`: Abstraction over `shared_preferences`.
- `PuzzleGenerator`: A dart script/utility to programmatically generate 90 valid nonogram puzzles and save them as JSON in `assets/puzzles/`.

### Step 3: ViewModels
- `GameViewModel`: Manages the state of the active game (board state, checking win condition, using hints).
- `CollectionViewModel`: Manages the state of unlocked pixel arts.
- `HomeViewModel`: Manages theme and difficulty selection progress.

### Step 4: UI Implementation
- **Theme/Styling**: Material 3, Primary `#4F46E5`, Secondary `#8B5CF6`, Background `#F8FAFC`. Dark mode support.
- **Home Screen**: Play, Collection, Settings navigation.
- **Theme Selection Screen**: Cards for Animal, Food, Travel with completion %.
- **Difficulty Selection Screen**: Easy, Normal, Hard with completion %.
- **Puzzle List Screen**: Grid of 10 puzzles per difficulty.
- **Game Screen**: Interactive Nonogram grid with row/col hints, toggle fill/X, hint button, reset.
- **Collection Screen**: Unlocked pixel art grouped by theme.

### Step 5: Puzzle Generation
- Implement a script (`tool/generate_puzzles.dart`) to create the 90 `.json` files with randomized but solvable nonogram patterns.

### Step 6: Testing & Polish
- Ensure null safety.
- Verify game loop (select -> play -> win -> collection).
- Haptic feedback on completion.
