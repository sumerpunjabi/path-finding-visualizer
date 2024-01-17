const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";

let addedWalls = [];
let removedWalls = [];

const recursiveDivision = (grid, rows, columns) => {
  addedWalls = [];
  removedWalls = [];

  for (let i = 0; i < rows; i++) {
    grid[i][0].isWall = true;
    grid[rows - i - 1][columns - 1].isWall = true;
    addedWalls.push(grid[i][0], grid[rows - i - 1][columns - 1]);
  }

  for (let j = 0; j < columns; j++) {
    grid[0][columns - j - 1].isWall = true;
    grid[rows - 1][j].isWall = true;
    addedWalls.push(grid[0][columns - j - 1], grid[rows - 1][j]);
  }

   divide(grid, 0, 0, columns, rows, chooseOrientation(columns, rows));

  return { addedWalls, removedWalls, animAddedWalls: true };
};

const divide = (grid, startX, startY, areaWidth, areaHeight, orientation) => {
  // Base case: if the area is too small, stop the recursion
  if (areaHeight < 2 && areaWidth < 2) return;

  const isHorizontal = orientation === HORIZONTAL;

  // Calculate the starting coordinates of the wall
  let wallX = startX + (isHorizontal ? generateEvenNumber(areaHeight - 2) : 0);
  let wallY = startY + (isHorizontal ? 0 : generateEvenNumber(areaWidth - 2));

  // Calculate the coordinates of the passage
  const passageX = wallX + (isHorizontal ? 0 : generateOddNumber(areaHeight));
  const passageY = wallY + (isHorizontal ? generateOddNumber(areaWidth) : 0);

  // Determine the direction of the wall
  const directionX = isHorizontal ? 0 : 1;
  const directionY = isHorizontal ? 1 : 0;

  // Create the wall and add it to the addedWalls array
  do {
    if (wallX !== passageX || wallY !== passageY) {
      grid[wallX][wallY].isWall = true;
      addedWalls.push(grid[wallX][wallY]);
    }
    wallX += directionX;
    wallY += directionY;
  } while (grid[wallX][wallY].isWall !== true);

  // Calculate the dimensions of the first sub-area
  let nextStartX = startX;
  let nextStartY = startY;
  let nextWidth = isHorizontal ? areaWidth : wallY - startY;
  let nextHeight = isHorizontal ? wallX - startX : areaHeight;

  // Recursively divide the first sub-area
  divide(grid, nextStartX, nextStartY, nextWidth, nextHeight, chooseOrientation(nextWidth, nextHeight));

  // Calculate the dimensions of the second sub-area
  nextStartY = isHorizontal ? startY : wallY;
  nextStartX = isHorizontal ? wallX : startX;
  nextWidth = isHorizontal ? areaWidth : startY + areaWidth - wallY - 1;
  nextHeight = isHorizontal ? startX + areaHeight - wallX - 1 : areaHeight;

  // Recursively divide the second sub-area
  divide(grid, nextStartX, nextStartY, nextWidth, nextHeight, chooseOrientation(nextWidth, nextHeight));
};

// Chooses the orientation of the dividing wall based on the dimensions of the area
const chooseOrientation = (areaWidth, areaHeight) => {
  if (areaWidth < areaHeight) return HORIZONTAL;
  else if (areaWidth > areaHeight) return VERTICAL;
  // If the area is a square, choose a random orientation
  return Math.random() >= 0.5 ? HORIZONTAL : VERTICAL;
};

const generateEvenNumber = limit => {
  return Math.floor(generateRandomNumber(limit, 2) / 2) * 2;
};

const generateOddNumber = limit => {
  return Math.floor(Math.random() * (limit / 2)) * 2 + 1;
};

const generateRandomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default recursiveDivision;
