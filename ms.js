var rows = 5;
var columns = 5;
var board = [];
const mineCount = 7;
var minesFlagged = 0;
var boardSize = rows * columns - mineCount;

document.getElementById("mLeft").innerHTML = "Mines on board: " + mineCount;

var images = [
  ["https://user-images.githubusercontent.com/56004853/68697439-16d0f580-057f-11ea-8954-f47b9edb0ca9.jpg", //empty
    "https://user-images.githubusercontent.com/56004853/68697435-159fc880-057f-11ea-8f66-9258fbcc421a.jpg", //1
    "https://user-images.githubusercontent.com/56004853/68697441-16d0f580-057f-11ea-8be9-1768e3e616bc.jpg", //2
    "https://user-images.githubusercontent.com/56004853/68697442-16d0f580-057f-11ea-88c2-dd4f2b4065d5.jpg", //3
    "https://user-images.githubusercontent.com/56004853/68697443-16d0f580-057f-11ea-9ae4-c5b84ad30fa4.jpg", //4
    "https://user-images.githubusercontent.com/56004853/68697446-17698c00-057f-11ea-94f4-8618237a8f8e.jpg", //5
    "https://user-images.githubusercontent.com/56004853/68697448-18022280-057f-11ea-8421-fac10e7e7b2a.jpg", //6
    "https://user-images.githubusercontent.com/56004853/68697447-17698c00-057f-11ea-9d0e-9f0b85f7fc21.jpg", //7
    "https://user-images.githubusercontent.com/56004853/68697434-15073200-057f-11ea-9565-cd8daa5b2101.jpg" //8
  ],
  ["https://user-images.githubusercontent.com/56004853/68697437-159fc880-057f-11ea-93c3-fec5bbb29385.jpg"] //mineImg
];

function getImg(v, cV) {
  if (v == 0 && cV >= 1) {
    return images[0][cV];

  } else if (v == 0 && cV == 0) {
    return images[0][0];

  } else if (v == 1 && cV == 0) {
    return images[1][0];
  }
  return "";
}

function genGrid() {
  board = [];
  var boardId = document.getElementById("board");
  var msTable = document.createElement("table");

  for (var y = 0; y < rows; y++) {
    var row = [];
    board.push(row);
    var tRows = document.createElement("tr");

    for (var x = 0; x < columns; x++) {
  
      var cell = {

        isOpen: false,
        value: 0,        // value 1 represents a mine, value 0 is not a mine
        countVal: null, //neighbours count
        button: null,
        plantedF: false,
        isFlag: false,
      }

      row.push(cell);

      var tData = document.createElement("td");
      var btn = document.createElement("button");
      var imges = document.createElement("img");

      imges.setAttribute("src", "https://user-images.githubusercontent.com/56004853/68697433-15073200-057f-11ea-864a-9cb54fe0bfd8.jpg"); //closed tile img

      tRows.appendChild(tData);
      tData.appendChild(btn);
      btn.appendChild(imges);
      cell.button = imges;

      imges.oncontextmenu = function(event) {
        event.preventDefault();
        plantFlag(this.x, this.y)

      }.bind({
        x: x,
        y: y
      })

      imges.onclick = function() {
        checkCell(this.x, this.y)

      }.bind({
        x: x,
        y: y
      })
    }
    msTable.appendChild(tRows);
  }
  boardId.appendChild(msTable);
  plantMines();
  neibr();

}

function winLog(x, y) {
  var cell = board[y][x]
  if (cell.value == 0 && cell.isOpen == true) {
    boardSize--
    console.log(boardSize);
  }
  if (boardSize == 0) {
    alert("You won!");
    resetBoard();

  }
}

function plantFlag(x, y) {
  var cell = board[y][x];
  if (cell.isOpen) {
    return;
  }
  if (cell.plantedF) {
    cell.button.setAttribute("src", "https://user-images.githubusercontent.com/56004853/68697433-15073200-057f-11ea-864a-9cb54fe0bfd8.jpg") //closed tile img
    cell.isFlag = false
  } else {
    cell.button.setAttribute("src", "https://user-images.githubusercontent.com/56004853/68697436-159fc880-057f-11ea-887f-688e8868c9a3.jpg") //flag tile
    cell.isFlag = true;
  }
  cell.plantedF = !cell.plantedF;
  checkIfmine(x, y);
}

function checkIfmine(x, y) {
  var cell = board[y][x];

  for (var s = 0; s < 1; s++) {
    if (cell.value == 1) {
      if (cell.isFlag == true)
        minesFlagged++
      if (cell.isFlag == false)
        minesFlagged--
    }
    if (cell.value == 0) {
      return;
    }

    console.log(minesFlagged);

    if (minesFlagged == mineCount) {
      alert("You won !");
      resetBoard();
    }
  }
}

function plantMines() {
  var mPlanted = 0;

  while (mPlanted < mineCount) {
    var x = Math.floor(Math.random() * 5);
    var y = Math.floor(Math.random() * 5);
    //console.log(x + " x " + y)
    if (board[y][x].value != 1) {

      board[y][x].value = 1;
      mPlanted++;
    }
  }
}
/* if its not a mine look for field that is not a mine and plant a mine & increase planted count + 1 */

function neibr() {

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {

      var count = 0;

      if (board[i][j].value == 0) //if the field is not a mine , how many mines are surrounding it
      {
        if (i - 1 >= 0                                    && board[i - 1][j].value == 1) count++; //up 
        if (i + 1 < board.length                          && board[i + 1][j].value == 1) count++; //down
        if (j - 1 >= 0                                    && board[i][j - 1].value == 1) count++; //left
        if (j + 1 < board.length                          && board[i][j + 1].value == 1) count++; //right
        if (i - 1 >= 0 && j - 1 >= 0                      && board[i - 1][j - 1].value == 1) count++; //up&left
        if (i - 1 >= 0 && j + 1 < board.length            && board[i - 1][j + 1].value == 1) count++; //up&right
        if (i + 1 < board.length && j + 1 < board.length  && board[i + 1][j + 1].value == 1) count++; //down&right
        if (i + 1 < board.length && j - 1 >= 0            && board[i + 1][j - 1].value == 1) count++; //down&left

      }
      board[i][j].countVal = count;
      //console.log(count) 
    }
  }
}

function inBounds(x, y) {
  return x >= 0 && x < columns &&
    y >= 0 && y < rows
}

function revealCell(x, y) {
  var cell = board[y][x];
  cell.isOpen = true;
  cell.button.setAttribute("src", getImg(cell.value, cell.countVal));
  winLog(x, y);
}

function revealNei(x, y) {
  if (!inBounds(x, y))
    return;

  var cell = board[y][x];
  if (cell.isOpen)
    return;

  if (cell.value == 0 && cell.countVal > 0) {
    revealCell(x, y)
    return;
  }

  if (cell.value == 0 && cell.countVal == 0) {
    revealCell(x, y)

    revealNei(x, y + 1)
    revealNei(x, y - 1)
    revealNei(x + 1, y + 1)
    revealNei(x + 1, y - 1)
    revealNei(x - 1, y - 1)
    revealNei(x - 1, y + 1)
    revealNei(x - 1, y)
    revealNei(x + 1, y)
  }
}

function checkCell(x, y) {
  if (!inBounds(x, y))
    return;

  var cell = board[y][x];
  if (cell.isOpen)
    return;

  if (cell.value == 0 && cell.countVal > 0) {
    revealCell(x, y);

  }

  if (cell.value == 0 && cell.countVal == 0) {
    revealNei(x, y)
    return;
  }
  if (cell.value == 1) {
    cell.button.style = 'background: red; padding: 4px';
    revealCell(x, y);
    traverse();
    alert("Game Over!");
    resetBoard();
    minesFlagged = 0;
  }
}

function traverse() {
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns; x++) {
      var cell = board[y][x];
      if (cell.value == 1) {
        revealCell(x, y);
      }
    }
  }
}

function resetBoard() {

  var conf = confirm("Reset game?");
  if (conf === true) {
    var getEl = document.getElementById("board")
    while (getEl.hasChildNodes()) {
      getEl.removeChild(getEl.lastChild)
    }

    genGrid();
    minesFlagged = 0;
    boardSize = rows * columns - mineCount;
    console.log(board);
  }
}

function manualReset() {
  var getEl = document.getElementById("board")

  while (getEl.hasChildNodes()) {
    getEl.removeChild(getEl.lastChild)
  }
  genGrid();
  minesFlagged = 0;
  boardSize = rows * columns - mineCount;
  console.log(board);
}

var elMano = document.getElementById("manualR");
elMano.onclick = manualReset;
genGrid();
console.log(board)
