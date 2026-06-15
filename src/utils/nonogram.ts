export const calculateHints = (line: number[]): number[] => {
  const hints: number[] = [];
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 1) {
      count++;
    } else {
      if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
  }
  if (count > 0) {
    hints.push(count);
  }
  return hints.length > 0 ? hints : [0];
};

export const getRowHints = (solution: number[][]): number[][] => {
  return solution.map(row => calculateHints(row));
};

export const getColHints = (solution: number[][]): number[][] => {
  if (solution.length === 0) return [];
  const cols = solution[0].length;
  const colHints: number[][] = [];
  for (let j = 0; j < cols; j++) {
    const col = solution.map(row => row[j]);
    colHints.push(calculateHints(col));
  }
  return colHints;
};

export const checkWinCondition = (board: number[][], solution: number[][]): boolean => {
  for (let r = 0; r < solution.length; r++) {
    for (let c = 0; c < solution[r].length; c++) {
      // 1 means filled, anything else is not filled.
      // board might have 2 for X, 0 for empty.
      const isFilledInBoard = board[r][c] === 1;
      const isFilledInSolution = solution[r][c] === 1;
      
      if (isFilledInBoard !== isFilledInSolution) {
        return false;
      }
    }
  }
  return true;
};
