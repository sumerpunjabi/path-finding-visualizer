const prim = (grid, rows, columns) => {
  let addedWalls = [];
  let removedWalls = [];
  let openCells = {};
  let frontierCells = {};

  // Initialize the grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i % 2 !== 0 && j % 2 !== 0) {
        openCells[getKey(i, j)] = grid[i][j];
      }
      grid[i][j].isWall = true;
      addedWalls.push(grid[i][j]);
    }
  }

  const directions = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2]
  ];

  const neighbours = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  // Start from a random open cell
  const start = openCells[randomKey(openCells)];
  grid[start.row][start.col].isWall = false;
  removedWalls.push(grid[start.row][start.col]);

  // Add neighbouring cells to the frontier
  directions.forEach(direction => {
    const newRow = start.row + direction[0];
    const newCol = start.col + direction[1];
    if (
      grid[newRow] &&
      grid[newRow][newCol] &&
      grid[newRow][newCol].isWall &&
      newRow !== 0 &&
      newCol !== 0 &&
      newRow !== rows - 1 &&
      newCol !== columns - 1
    ) {
      frontierCells[getKey(newRow, newCol)] = grid[newRow][newCol];
    }
  });

  // Explore the frontier
  while (Object.keys(frontierCells).length) {
    const randomFrontierKey = randomKey(frontierCells);
    const { row, col } = frontierCells[randomFrontierKey];
    let neighbourCells = {};

    directions.every((direction, index) => {
      const newRow = row + direction[0];
      const newCol = col + direction[1];
      const wallRow = row + neighbours[index][0];
      const wallCol = col + neighbours[index][1];
      if (grid[newRow] && grid[newRow][newCol] && !grid[newRow][newCol].isWall) {
        neighbourCells[getKey(wallRow, wallCol)] = grid[wallRow][wallCol];
      }
      return true;
    });

    const randomNeighbour = neighbourCells[randomKey(neighbourCells)];
    grid[randomNeighbour.row][randomNeighbour.col].isWall = false;
    grid[frontierCells[randomFrontierKey].row][frontierCells[randomFrontierKey].col].isWall = false;
    removedWalls.push(grid[randomNeighbour.row][randomNeighbour.col]);
    removedWalls.push(grid[frontierCells[randomFrontierKey].row][frontierCells[randomFrontierKey].col]);

    // Add new frontier cells
    directions.forEach(direction => {
      const newRow = frontierCells[randomFrontierKey].row + direction[0];
      const newCol = frontierCells[randomFrontierKey].col + direction[1];
      if (
        grid[newRow] &&
        grid[newRow][newCol] &&
        grid[newRow][newCol].isWall &&
        newRow !== 0 &&
        newCol !== 0 &&
        newRow !== rows - 1 &&
        newCol !== columns - 1
      ) {
        frontierCells[getKey(newRow, newCol)] = grid[newRow][newCol];
      }
    });

    delete frontierCells[randomFrontierKey];
  }

  return { addedWalls, removedWalls, animAddedWalls: false };
};

const randomKey = obj => {
  const keys = Object.keys(obj);
  return keys[Math.floor(keys.length * Math.random())];
};

const getKey = (i, j) => `${i}-${j}`;

export default prim;
