import PriorityQueue from "js-priority-queue";

const jumpPointSearch = (grid, startNode, endNode) => {
  let visitedNodes = [];
  let shortestPath = [];
  
  // Initialize priority queue with a comparator for node 'f' values
  let priorityQueue = new PriorityQueue({
    comparator: function(nodeA, nodeB) {
      return nodeA.node.f - nodeB.node.f;
    }
  });

  // Initialize all nodes with infinite 'g' and 'f' values
  grid.forEach(row => {
    row.forEach(node => {
      node.g = Infinity; // 'g' represents distance
      node.f = Infinity; // 'f' is the sum of 'g' and heuristic 'h'
      node.prevNode = null;
    });
  });

  // Set 'g' and 'f' values for the start node
  grid[startNode.row][startNode.column].g = 0;
  grid[startNode.row][startNode.column].f = calculateHeuristic(
    startNode.row,
    startNode.column,
    endNode
  );

  // Define directions for node traversal
  const directions = [
    [1, 0], // Right
    [0, 1], // Down
    [-1, 0], // Left
    [0, -1], // Up
    [-1, 1], // Diagonal Up-Left
    [1, 1], // Diagonal Down-Right
    [-1, -1], // Diagonal Up-Right
    [1, -1] // Diagonal Down-Left
  ];

  // Queue all nodes in the defined directions
  directions.forEach(direction => {
    priorityQueue.queue({ node: grid[startNode.row][startNode.column], dir: direction });
  });

  while (priorityQueue.length) {
    const currentNode = priorityQueue.dequeue();
    // If the node hasn't been visited yet, mark it as visited and add it to the visited nodes list
    if (!currentNode.node.isVisited) {
      currentNode.node.isVisited = true;
      visitedNodes.push(currentNode.node);
    }
    const scanResponse = scan(currentNode.node, currentNode.dir, grid, endNode, priorityQueue);
    if (scanResponse === "found") {
      break;
    }
  }

  shortestPath = getShortestPath(grid[endNode.row][endNode.column]);
  return { visitedNodes, shortestPath };
};

const scan = (node, dir, grid, endNode, pq) => {
  const x = dir[0];
  const y = dir[1];
  if (x !== 0 && y !== 0) {
    let r0 = node.row;
    let c0 = node.col;
    while (true) {
      let c1 = c0 + y;
      let r1 = r0 + x;
      if (!isNodeInGrid(r1, c1, grid)) return false;
      let g = grid[r1][c1];
      let ng = grid[r0][c0].g + 1;
      let nf = ng + calculateHeuristic(r1, c1, endNode);
      if (g.f <= nf) return false;
      g.g = ng;
      g.f = nf;
      if (g.row === endNode.row && g.col === endNode.column) {
        grid[r1][c1].prevNode = grid[r0][c0];
        return "found";
      }
      if (g.isWall) return false;
      grid[r1][c1].prevNode = grid[r0][c0];
      let c2 = c1 + y;
      let r2 = r1 + x;
      let jump = false;
      if (
        isNodeInGrid(r1, c0, grid) &&
        grid[r1][c0].isWall &&
        isNodeInGrid(r2, c0, grid) &&
        (!grid[r2][c0].isWall || (r2 === endNode.row && c0 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c1], dir: [x, -y] });
        jump = true;
      }
      if (
        isNodeInGrid(r0, c1, grid) &&
        grid[r0][c1].isWall &&
        isNodeInGrid(r0, c2, grid) &&
        (!grid[r0][c2].isWall || (r0 === endNode.row && c2 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c1], dir: [-x, y] });
        jump = true;
      }
      let hor = scan(grid[r1][c1], [0, y], grid, endNode, pq);
      let ver = scan(grid[r1][c1], [x, 0], grid, endNode, pq);
      if (hor === "found" || ver === "found") return "found";
      if (hor || ver) {
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r1][c1], dir: [x, y] });
        return true;
      }
      c0 = c1;
      r0 = r1;
    }
  } else if (x === 0) {
    let r0 = node.row;
    let c0 = node.col;
    while (true) {
      let c1 = c0 + y;
      if (!isNodeInGrid(r0, c1, grid)) return false;
      let g = grid[r0][c1];
      let ng = grid[r0][c0].g + 1;
      let nf = ng + calculateHeuristic(r0, c1, endNode);
      if (g.f <= nf) return false;
      g.g = ng;
      g.f = nf;
      if (g.row === endNode.row && g.col === endNode.column) {
        grid[r0][c1].prevNode = grid[r0][c0];
        return "found";
      }
      if (g.isWall) return false;
      grid[r0][c1].prevNode = grid[r0][c0];
      let c2 = c1 + y;
      let jump = false;
      if (
        isNodeInGrid(r0 - 1, c1, grid) &&
        grid[r0 - 1][c1].isWall &&
        isNodeInGrid(r0 - 1, c2, grid) &&
        (!grid[r0 - 1][c2].isWall ||
          (r0 - 1 === endNode.row && c2 === endNode.column))
      ) {
        pq.queue({ node: grid[r0][c1], dir: [-1, y] });
        jump = true;
      }
      if (
        isNodeInGrid(r0 + 1, c1, grid) &&
        grid[r0 + 1][c1].isWall &&
        isNodeInGrid(r0 + 1, c2, grid) &&
        (!grid[r0 + 1][c2].isWall ||
          (r0 + 1 === endNode.row && c2 === endNode.column))
      ) {
        pq.queue({ node: grid[r0][c1], dir: [1, y] });
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r0][c1], dir: [0, y] });
        return true;
      }
      c0 = c1;
    }
  } else if (y === 0) {
    let r0 = node.row;
    let c0 = node.col;
    while (true) {
      let r1 = r0 + x;
      if (!isNodeInGrid(r1, c0, grid)) return false;
      let g = grid[r1][c0];
      let ng = grid[r0][c0].g + 1;
      let nf = ng + calculateHeuristic(r1, c0, endNode);
      if (g.f <= nf) return false;
      g.g = ng;
      g.f = nf;
      if (g.row === endNode.row && g.col === endNode.column) {
        grid[r1][c0].prevNode = grid[r0][c0];
        return "found";
      }
      if (g.isWall) return false;
      grid[r1][c0].prevNode = grid[r0][c0];
      let r2 = r1 + x;
      let jump = false;
      if (
        isNodeInGrid(r1, c0 - 1, grid) &&
        grid[r1][c0 - 1].isWall &&
        isNodeInGrid(r2, c0 - 1, grid) &&
        (!grid[r2][c0 - 1].isWall ||
          (r2 === endNode.row && c0 - 1 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c0], dir: [x, -1] });
        jump = true;
      }
      if (
        isNodeInGrid(r1, c0 + 1, grid) &&
        grid[r1][c0 + 1].isWall &&
        isNodeInGrid(r2, c0 + 1, grid) &&
        (!grid[r2][c0 + 1].isWall ||
          (r2 === endNode.row && c0 + 1 === endNode.column))
      ) {
        pq.queue({ node: grid[r1][c0], dir: [x, 1] });
        jump = true;
      }
      if (jump) {
        pq.queue({ node: grid[r1][c0], dir: [x, y] });
        return true;
      }
      r0 = r1;
    }
  }
};

const isNodeInGrid = (row, col, grid) => {
  return grid[row] && grid[row][col];
};

// Calculate the heuristic value for a node
const calculateHeuristic = (row, col, endNode) => {
  const rowDifference = Math.abs(row - endNode.row);
  const columnDifference = Math.abs(col - endNode.column);
  const cost = 1;
  let heuristicValue = cost * Math.sqrt(rowDifference * rowDifference + columnDifference * columnDifference);
  return heuristicValue;
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

export default jumpPointSearch;
