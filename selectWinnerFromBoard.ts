/*
 * Copyright 2023 Marek Kobida
 */

function selectWinnerFromBoard(board: string[]): [row: number[], winner: string] | undefined {
  const rows = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];

  for (const row of rows) {
    const [a, b, c] = row;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [row, board[a]];
    }
  }
}

export default selectWinnerFromBoard;
