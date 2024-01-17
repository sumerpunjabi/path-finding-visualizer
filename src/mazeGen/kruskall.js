import disjointSet from "disjoint-set";

// Kruskal's algorithm for maze generation
const kruskal = (grid, rows, columns) => {
  const set = disjointSet();
  let addedWalls = [];
  let removedWalls = [];
  let edges = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      // If the cell is on an even row or column, it's a potential edge
      if (i % 2 === 0 || j % 2 === 0) {
        // Exclude border cells
        if (i !== 0 && j !== 0 && i !== rows - 1 && j !== columns - 1) {
          edges.push(grid[i][j]);
        }
      } else {
        // If the cell is on an odd row and column, it's a potential node
        set.add(grid[i][j]);
      }
      // Initially, all cells are walls
      grid[i][j].isWall = true;
      addedWalls.push(grid[i][j]);
    }
  }

  shuffle(edges);

  edges.forEach(edge => {
    // Check if the edge can be removed horizontally
    const canRemoveHorizontally = edge.row % 2 !== 0 && !set.connected(grid[edge.row][edge.col - 1], grid[edge.row][edge.col + 1]);
    if (canRemoveHorizontally) {
      set.union(grid[edge.row][edge.col - 1], grid[edge.row][edge.col + 1]);
      removeWall(grid, edge.row, edge.col);
      removeWall(grid, edge.row, edge.col - 1);
      removeWall(grid, edge.row, edge.col + 1);
      removedWalls.push(grid[edge.row][edge.col - 1], grid[edge.row][edge.col], grid[edge.row][edge.col + 1]);
    }

    // Check if the edge can be removed vertically
    const canRemoveVertically = edge.col % 2 !== 0 && !set.connected(grid[edge.row - 1][edge.col], grid[edge.row + 1][edge.col]);
    if (canRemoveVertically) {
      set.union(grid[edge.row - 1][edge.col], grid[edge.row + 1][edge.col]);
      removeWall(grid, edge.row, edge.col);
      removeWall(grid, edge.row - 1, edge.col);
      removeWall(grid, edge.row + 1, edge.col);
      removedWalls.push(grid[edge.row - 1][edge.col], grid[edge.row][edge.col], grid[edge.row + 1][edge.col]);
    }
  });

  return { addedWalls, removedWalls, animAddedWalls: false };
};

const removeWall = (grid, row, col) => {
  grid[row][col].isWall = false;
};

// Fisher-Yates shuffle algorithm
const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default kruskal;