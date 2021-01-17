const rows = 5;
const columns = 5;
let board = [];
const mineCount = 7;
let minesFlagged = 0;
let flaggedNonMine = 0;
let boardSize = rows * columns - mineCount;

const gameEndOverlay = document.querySelector("div.game-end-overlay");
const endContent = document.querySelector("p.end-content");
const newGameBtnBtn = document.getElementById("new-game-btn");

newGameBtnBtn.onclick = resetGame;
document.getElementById("mLeft").innerHTML = `Mines on board: ${mineCount}`;

const images = new Map([
    [-1, "icons/mine.jpg"],
    [0, "icons/blank.jpg"],
    [1, "icons/num1.jpg"],
    [2, "icons/num2.jpg"],
    [3, "icons/num3.jpg"],
    [4, "icons/num4.jpg"],
    [5, "icons/num5.jpg"],
    [6, "icons/num6.jpg"],
    [7, "icons/num7.jpg"],
    [8, "icons/num8.jpg"]
]);

function genGrid () {
    board = [];
    const boardId = document.getElementById("board");
    const msTable = document.createElement("table");

    for (let y = 0; y < rows; y++) {
        const row = [];

        board.push(row);
        const tRows = document.createElement("tr");

        for (let x = 0; x < columns; x++) {

            const cell = {
                isOpen: false,
                value: null, // Value -1 represents a mine
                button: null,
                plantedF: false,
                isFlag: false
            };

            row.push(cell);

            const tData = document.createElement("td");
            const btn = document.createElement("button");
            const imges = document.createElement("img");

            imges.setAttribute("src", "icons/closed.jpg");
            tRows.appendChild(tData);
            tData.appendChild(btn);
            btn.appendChild(imges);
            cell.button = imges;

            imges.oncontextmenu = function (event) {
                event.preventDefault();
                plantFlag(this.x, this.y);
            }.bind({
                x,
                y
            });

            imges.onclick = function () {
                checkCell(this.x, this.y);
            }.bind({
                x,
                y
            });
        }
        msTable.appendChild(tRows);
    }
    boardId.appendChild(msTable);
    plantMines();
    traverse(function (x, y, cell) {
        if (cell.value !== -1) cell.value = countAroundMines(x, y);
    });
}

function plantMines () {
    let mPlanted = 0;

    while (mPlanted < mineCount) {
        const x = Math.floor(Math.random() * 5);
        const y = Math.floor(Math.random() * 5);

        if (board[y][x].value !== -1) {
            board[y][x].value = -1;
            mPlanted++;
        }
    }
}

// Counts how many mines are around the cell
function countAroundMines (x, y) {
    let count = 0;

    if (getCellValue(x + 1, y    ) === -1) count++;
    if (getCellValue(x - 1, y    ) === -1) count++;
    if (getCellValue(x    , y + 1) === -1) count++;
    if (getCellValue(x    , y - 1) === -1) count++;
    if (getCellValue(x - 1, y - 1) === -1) count++;
    if (getCellValue(x - 1, y + 1) === -1) count++;
    if (getCellValue(x + 1, y - 1) === -1) count++;
    if (getCellValue(x + 1, y + 1) === -1) count++;

    return count;
}

function inBounds (x, y) {
    return x >= 0 && x < columns && y >= 0 && y < rows;
}

function plantFlag (x, y) {
    const cell = board[y][x];

    if (cell.isOpen) return;

    if (cell.plantedF) {
        cell.button.setAttribute("src", "icons/closed.jpg"); // closed tile img
        cell.isFlag = false;
    } else {
        cell.button.setAttribute("src", "icons/flag.jpg"); // flag tile
        cell.isFlag = true;
    }
    cell.plantedF = !cell.plantedF;
}

function revealCell (x, y) {
    const cell = board[y][x];

    cell.isOpen = true;
    cell.button.setAttribute("src", images.get(cell.value));

    if (cell.value >= 0 && cell.isOpen === true) {
        boardSize--;
        console.log(boardSize);
    }
    console.log(boardSize);
    winLog();
}

function revealNei (x, y) {
    if (!inBounds(x, y)) return;

    const cell = board[y][x];

    if (cell.isOpen) return;
    if (cell.value > 0) {
        revealCell(x, y);
        return;
    }
    if (cell.value === 0) {
        revealCell(x, y);

        revealNei(x, y + 1);
        revealNei(x, y - 1);
        revealNei(x + 1, y + 1);
        revealNei(x + 1, y - 1);
        revealNei(x - 1, y - 1);
        revealNei(x - 1, y + 1);
        revealNei(x - 1, y);
        revealNei(x + 1, y);
    }
}

function checkCell (x, y) {
    if (!inBounds(x, y)) return;

    const cell = board[y][x];

    if (cell.isOpen) return;
    if (cell.value > 0) revealCell(x, y);
    if (cell.value === 0) {
        revealNei(x, y);
        return;
    }
    if (cell.value === -1) {
        cell.button.style = "background: red; padding: 2px; width: 48px";
        endContent.textContent = "You died !";
        revealCell(x, y);
        traverse(function (x, y, cell) {
            if (cell.value === -1) revealCell(x, y);
        });
        endContent.style = "background: red;";
        handleEnd();
    }
}

function getCellValue (x, y) {
    if (!inBounds(x, y)) return "";
    const cell = board[y][x];

    return cell.value;
}

function traverse (callBackF) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const cell = board[y][x];

            callBackF(x, y, cell);
        }
    }
}

function winLog () {
    if (boardSize === 0) {
        endContent.textContent = "You won! 😎";
        endContent.style.background = "gold";
        handleEnd();
    }
}

function handleEnd () {
    gameEndOverlay.style.display = "flex";
}


function resetGame () {
    const getEl = document.getElementById("board");

    gameEndOverlay.style.display = "none";

    while (getEl.hasChildNodes()) {
        getEl.removeChild(getEl.lastChild);
    }
    genGrid();
    boardSize = rows * columns - mineCount;
    console.log(board);
}

genGrid();
console.log(board);