import json
import os
import random

themes = ['animal', 'food', 'travel']
difficulties = {'easy': 5, 'normal': 10, 'hard': 15}
names = {
    'animal': ['Cat', 'Dog', 'Rabbit', 'Bear', 'Fox', 'Elephant', 'Lion', 'Tiger', 'Monkey', 'Deer'],
    'food': ['Apple', 'Burger', 'Pizza', 'Donut', 'Cake', 'Sushi', 'Taco', 'Ice Cream', 'Salad', 'Bread'],
    'travel': ['Airplane', 'Suitcase', 'Map', 'Camera', 'Passport', 'Globe', 'Tent', 'Train', 'Bus', 'Hotel']
}

os.makedirs('assets/puzzles', exist_ok=True)

for theme in themes:
    for diff, size in difficulties.items():
        puzzles = []
        for i in range(10):
            solution = []
            for r in range(size):
                row = []
                for c in range(size):
                    row.append(random.choice([0, 1]))
                # Ensure not completely empty row
                if sum(row) == 0:
                    row[random.randint(0, size-1)] = 1
                solution.append(row)
            
            # Ensure not completely empty col
            for c in range(size):
                if sum(solution[r][c] for r in range(size)) == 0:
                    solution[random.randint(0, size-1)][c] = 1

            puzzle = {
                'id': f'{theme}_{diff}_{i+1}',
                'theme': theme,
                'difficulty': diff,
                'name': names[theme][i] if diff == 'normal' else f"{names[theme][i]} ({diff.capitalize()})",
                'width': size,
                'height': size,
                'solution': solution
            }
            puzzles.append(puzzle)
        
        file_path = f'assets/puzzles/{theme}_{diff}.json'
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(puzzles, f, ensure_ascii=False, indent=2)

print("Generated all 90 puzzles in assets/puzzles/")
