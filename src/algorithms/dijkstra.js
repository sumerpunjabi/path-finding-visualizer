import PriorityQueue from "js-priority-queue";

const dijkstra = (grid, startNode, endNode, allowDiag) => {
  let visitedNodes = [];
  let shortestPath = [];
  let pq = new PriorityQueue({
    comparator: (a, b) => a.distance - b.distance
  });

  initializeNodes(grid, startNode);
  pq.queue(grid[startNode.row][startNode.column]);

  while (pq.length) {
    const node = pq.dequeue();
    const { row, col } = node;

    if (grid[row][col].isVisited) continue;

    grid[row][col].isVisited = true;
    visitedNodes.push(node);

    const directions = getDirections(allowDiag);

    for (let direction of directions) {
      const r = row + direction[0];
      const c = col + direction[1];

      if (isValidNode(grid, r, c, endNode)) {
        if (r === endNode.row && c === endNode.column) {
          grid[r][c].isVisited = true;
          grid[r][c].prevNode = grid[row][col];
          shortestPath = getShortestPath(grid[r][c]);
          return { visitedNodes, shortestPath };
        }

        const dist = Math.abs(direction[0]) === 1 && Math.abs(direction[1]) === 1 ? 1.4 : 1;
        if (node.distance + dist < grid[r][c].distance) {
          grid[r][c].prevNode = node;
          grid[r][c].distance = node.distance + dist;
        }

        pq.queue(grid[r][c]);
      }
    }
  }

  return { visitedNodes, shortestPath };
};

const initializeNodes = (grid, startNode) => {
  grid.forEach(row =>
    row.forEach(node => {
      node.distance = (node.row === startNode.row && node.col === startNode.column) ? 0 : Infinity;
      node.prevNode = null;
    })
  );
};

const getDirections = (allowDiag) => {
  let directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];

  if (allowDiag) {
    directions.push([-1, 1], [1, 1], [-1, -1], [1, -1]);
  }

  return directions;
};

const isValidNode = (grid, r, c, endNode) => {
  return grid[r] &&
    grid[r][c] &&
    !grid[r][c].isVisited &&
    (!grid[r][c].isWall || (r === endNode.row && c === endNode.column));
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

export default dijkstra;