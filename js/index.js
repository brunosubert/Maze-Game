function brightnessChange(factor, sprite) {
  let virtualCanvas = document.createElement("canvas");
  virtualCanvas.width = 500;
  virtualCanvas.height = 500;
  let context = virtualCanvas.getContext("2d");
  context.drawImage(sprite, 0, 0, 500, 500);

  var imageData = context.getImageData(0, 0, 500, 500);

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = imageData.data[i] * factor;
    imageData.data[i + 1] = imageData.data[i + 1] * factor;
    imageData.data[i + 2] = imageData.data[i + 2] * factor;
  }
  context.putImageData(imageData, 0, 0);

  var spriteOutput = new Image();
  spriteOutput.src = virtualCanvas.toDataURL();
  virtualCanvas.remove();
  return spriteOutput;
}

function showWinMessage(moves) {
  document.getElementById("moves").innerHTML = "It took you " + moves + " steps to finish.";
  toggleVisibility("message-section");  
}

function toggleVisibility(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function randomized(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;

}

function defMaze(Width, Height) {
  var createMap;
  var startingCoordinates, endingCoordinates;
  var width = Width;
  var height = Height;
  var dirs = ["north", "south", "east", "west"];
  var modDir = {
    north: { y: -1, x: 0, o: "south" },
    south: { y: 1, x: 0, o: "north" },
    east: { y: 0, x: 1, o: "west" },
    west: { y: 0, x: -1, o: "east" }
  };

  this.map = function() {
    return createMap;
  };
  this.startingCoordinates = function() {
    return startingCoordinates;
  };
  this.endingCoordinates = function() {
    return endingCoordinates;
  };

  function generateMap() {
    createMap = new Array(height);
    for (y = 0; y < height; y++) {
      createMap[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        createMap[y][x] = {
          north: false,
          south: false,
          east: false,
          west: false,
          visited: false,
          priorPos: null
        };
      }
    }
  }

  function defineMaze() {
    var isCompleted = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = { x: 0, y: 0 };
    var numCells = width * height;
    while (!isCompleted) {
      move = false;
      createMap[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        randomized(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          //Check if the tile is already visited
          if (!createMap[nx][ny].visited) {
            //Carve through walls from this tile to next
            createMap[pos.x][pos.y][direction] = true;
            createMap[nx][ny][modDir[direction].o] = true;

            //Set Currentcell as next cells Prior visited
            createMap[nx][ny].priorPos = pos;
            //Update Cell position to newly visited location
            pos = {
              x: nx,
              y: ny
            };
            cellsVisited++;
            //Recursively call this method on the next tile
            move = true;
            break;
          }
        }
      }

      if (!move) {
        //  If it failed to find a direction,
        //  move the current position back to the prior cell and Recall the method.
        pos = createMap[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isCompleted = true;
      }
    }
  }

  function defineStartEnd() {
    switch (rand(4)) {
      case 0:
        startingCoordinates = {
          x: 0,
          y: 0
        };
        endingCoordinates = {
          x: height - 1,
          y: width - 1
        };
        break;
      case 1:
        startingCoordinates = {
          x: 0,
          y: width - 1
        };
        endingCoordinates = {
          x: height - 1,
          y: 0
        };
        break;
      case 2:
        startingCoordinates = {
          x: height - 1,
          y: 0
        };
        endingCoordinates = {
          x: 0,
          y: width - 1
        };
        break;
      case 3:
        startingCoordinates = {
          x: height - 1,
          y: width - 1
        };
        endingCoordinates = {
          x: 0,
          y: 0
        };
        break;
    }
  }

  generateMap();
  defineStartEnd();
  defineMaze();
}

function DrawMaze(defMaze, ctx, cellsize, endSprite = null) {
  var map = defMaze.map();
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 50;

  this.redrawMaze = function(size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    makeMap();
    drawEndMethod();
  };

  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize;
    var y = yCord * cellSize;

    if (cell.north == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.south === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.east === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.west === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }

  function makeMap() {
    for (i = 0; i < map.length; i++) {
      for (j = 0; j < map[i].length; j++) {
        drawCell(i, j, map[i][j]);
      }
    }
  }

  function drawEndFlag() {
    var coordinates = defMaze.endingCoordinates();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coordinates.x * cellSize + x * fraction + 4.5,
          coordinates.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 1)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coordinates = defMaze.endingCoordinates();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coordinates.x * cellSize + offsetLeft,
      coordinates.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  clear();
  makeMap();
  drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  drawSprite = drawSpriteCircle;
  if (sprite != null) {
    drawSprite = drawSpriteImage;
  }
  var player = this;
  var map = maze.map();
  var cellCoords = {
    x: maze.startingCoordinates().x,
    y: maze.startingCoordinates().y
  };
  var cellSize = _cellsize;
  var halfCellSize = cellSize / 2;

  this.redrawPlayer = function(_cellsize) {
    cellSize = _cellsize;
    drawSpriteImage(cellCoords);
  };

  function drawSpriteCircle(coordinates) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coordinates.x + 1) * cellSize - halfCellSize,
      (coordinates.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coordinates.x === maze.endingCoordinates().x && coordinates.y === maze.endingCoordinates().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawSpriteImage(coordinates) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coordinates.x * cellSize + offsetLeft,
      coordinates.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    if (coordinates.x === maze.endingCoordinates().x && coordinates.y === maze.endingCoordinates().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function removeSprite(coordinates) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
      coordinates.x * cellSize + offsetLeft,
      coordinates.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: // west
        if (cell.west == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x - 1,
            y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 87:
      case 38: // north
        if (cell.north == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y - 1
          };
          drawSprite(cellCoords);
        }
        break;
      case 68:
      case 39: // east
        if (cell.east == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x + 1,
            y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 83:
      case 40: // south
        if (cell.south == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y + 1
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }

  this.bindKeyDown = function() {
    window.addEventListener("keydown", check, false);

    $("#view").swipe({
      swipe: function(
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
      ) {
        console.log(direction);
        switch (direction) {
          case "up":
            check({
              keyCode: 38
            });
            break;
          case "down":
            check({
              keyCode: 40
            });
            break;
          case "left":
            check({
              keyCode: 37
            });
            break;
          case "right":
            check({
              keyCode: 39
            });
            break;
        }
      },
      threshold: 0
    });
  };

  this.unbindKeyDown = function() {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
  };

  drawSprite(maze.startingCoordinates());

  this.bindKeyDown();
}

var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");
var sprite;
var finishedSprite;
var maze;
var draw;
var player;
var cellSize;
var difficulty;

window.onload = function() {
  let vWidth = $("#view").width();
  let vHeight = $("#view").height();
  if (vHeight < vWidth) {
    ctx.canvas.width = vHeight - vHeight / 100;
    ctx.canvas.height = vHeight - vHeight / 100;
  } else {
    ctx.canvas.width = vWidth - vWidth / 100;
    ctx.canvas.height = vWidth - vWidth / 100;
  }

  //Load and edit sprites
  var firstComplete = false;
  var secondComplete = false;
  var isComplete = () => {
    if(firstComplete === true && secondComplete === true)
       {
         console.log("Runs");
         setTimeout(function(){
           newMaze();
         }, 500);         
       }
  };
  sprite = new Image();
  sprite.src =
    "https://i.imgur.com/VhqG0ig.png" +
    "?" +
    new Date().getTime();
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function() {
    sprite = brightnessChange(1.2, sprite);
    firstComplete = true;
    console.log(firstComplete);
    isComplete();
  };

  finishedSprite = new Image();
  finishedSprite.src = "https://i.imgur.com/dH21IpF.png"+
  "?" +
  new Date().getTime();
  finishedSprite.setAttribute("crossOrigin", " ");
  finishedSprite.onload = function() {
    finishedSprite = brightnessChange(1.1, finishedSprite);
    secondComplete = true;
    console.log(secondComplete);
    isComplete();
  };
  
};

function newMaze() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var e = document.getElementById("difficulty-selection");
  difficulty = e.options[e.selectedIndex].value;
  cellSize = gameCanvas.width / difficulty;
  maze = new defMaze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishedSprite);
  player = new Player(maze, gameCanvas, cellSize, showWinMessage, sprite);
  if (document.getElementById("gameContainer").style.opacity < "100") {
    document.getElementById("gameContainer").style.opacity = "100";
  }
}