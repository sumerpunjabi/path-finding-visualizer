import PriorityQueue from "js-priority-queue";

const astar = (grid, startNode, endNode, heuristic, allowDiag) => {
  // Initialize visited nodes and shortest path as empty arrays
  const visitedNodes = [];
  let shortestPath = [];

  // Set diagonal distance based on heuristic
  const diagDist = heuristic === "chebyshev" ? 1 : 1.414;

  // Initialize priority queue with comparator function
  const pq = new PriorityQueue({
    comparator: (a, b) => a.f === b.f ? a.h - b.h : a.f - b.f
  });

  // Set properties for each node in the grid
  grid.forEach(row => row.forEach(node => {
    node.g = Infinity; // g: distance
    node.h = Infinity; // h: heuristic
    node.f = Infinity; // f = g + h
    node.prevNode = null;
  }));

  grid[startNode.row][startNode.column].g = 0;
  grid[startNode.row][startNode.column].h = 0;
  grid[startNode.row][startNode.column].f = 0;
  pq.queue(grid[startNode.row][startNode.column]);
  while (pq.length) {
    const currentNode = pq.dequeue();
    const { row, col } = currentNode;
    currentNode.isVisited = true;
    visitedNodes.push(currentNode);

    // If the current node is the end node, get the shortest path and break the loop
    if (currentNode.row === endNode.row && currentNode.col === endNode.column) {
      shortestPath = getShortestPath(currentNode);
      break;
    }

    // Define the directions for neighboring nodes
    const directions = [
      [1, 0],  // right
      [0, 1],  // down
      [-1, 0], // left
      [0, -1]  // up
    ];

    // If diagonal movement is allowed, add diagonal directions
    if (allowDiag) {
      directions.push([-1, 1], [1, 1], [-1, -1], [1, -1]);
    }

    // Iterate over each direction
    for (const direction of directions) {
      const newRow = row + direction[0];
      const newCol = col + direction[1];

      // Check if the neighboring node is within the grid and can be visited
      if (
        grid[newRow] &&
        grid[newRow][newCol] &&
        !grid[newRow][newCol].isVisited &&
        (!grid[newRow][newCol].isWall || (newRow === endNode.row && newCol === endNode.column))
      ) {
        // If the neighboring node is the end node, update its properties and get the shortest path
        if (newRow === endNode.row && newCol === endNode.column) {
          grid[newRow][newCol].isVisited = true;
          grid[newRow][newCol].prevNode = currentNode;
          shortestPath = getShortestPath(grid[newRow][newCol]);
          return { visitedNodes, shortestPath };
        }

        // Calculate the g, h, and f values for the neighboring node
        const dist = Math.abs(direction[0]) === 1 && Math.abs(direction[1]) === 1 ? diagDist : 1;
        const gNew = currentNode.g + dist;
        const hNew = calculateHeuristic(newRow, newCol, endNode, heuristic, diagDist);
        const fNew = gNew + hNew;

        // If the f value for the neighboring node is less than its current f value, update its properties and add it to the queue
        if (grid[newRow][newCol].f > fNew) {
          grid[newRow][newCol].g = gNew;
          grid[newRow][newCol].h = hNew;
          grid[newRow][newCol].f = fNew;
          grid[newRow][newCol].prevNode = currentNode;
          pq.queue(grid[newRow][newCol]);
        }
      }
    }
  }
  return { visitedNodes, shortestPath };
};

const calculateHeuristic = (row, col, endNode, heuristic, diagDist) => {
  const dx = Math.abs(row - endNode.row);
  const dy = Math.abs(col - endNode.column);
  const d = 1;
  let ans;
  switch (heuristic) {
    case "manhattan":
      ans = d * (dx + dy);
      break;
    case "euclidean":
      ans = d * Math.sqrt(dx * dx + dy * dy);
      break;
    case "octile":
    case "chebyshev":
      const d2 = diagDist;
      ans = d * Math.max(dx, dy) + (d2 - d) * Math.min(dx, dy);
      break;
    default:
      throw new Error(`Unknown heuristic: ${heuristic}`);
  }
  return ans;
};

const getShortestPath = node => {
  const shortestPath = [];
  while (node !== null) {
    shortestPath.push(node);
    node = node.prevNode;
    if (node) node.isShortestPath = true;
  }
  return shortestPath.reverse();
};

export default astar;
