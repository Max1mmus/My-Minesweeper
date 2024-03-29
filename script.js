const rows = 5;
const columns = 5;
const mineCount = 7;
let board = [];
let boardSize = rows * columns - mineCount;

const minesOnBoard = document.getElementById("mines-on-board");
const gameEndOverlay = document.querySelector("div.game-end-overlay");
const endContent = document.querySelector("p.end-content");
const newGameBtnBtn = document.getElementById("new-game-btn");

newGameBtnBtn.onclick = resetGame;
minesOnBoard.textContent = `Mines on board: ${mineCount}`;

const images = new Map([
    [-1, "icons/mine.png"],
    [0, "icons/blank.png"],
    [1, "icons/num1.png"],
    [2, "icons/num2.png"],
    [3, "icons/num3.png"],
    [4, "icons/num4.png"],
    [5, "icons/num5.png"],
    [6, "icons/num6.png"],
    [7, "icons/num7.png"],
    [8, "icons/num8.png"]
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
                plantedF: false
            };

            row.push(cell);

            const tData = document.createElement("td");
            const cellImg = document.createElement("img");

            cellImg.classList.add("cell-img");
            cellImg.classList.add("closed-cell");
            tRows.appendChild(tData);
            tData.appendChild(cellImg);
            cell.button = cellImg;

            cellImg.oncontextmenu = function (event) {
                event.preventDefault();
                plantFlag(this.x, this.y);
            }.bind({
                x,
                y
            });

            cellImg.onclick = function () {
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
    cell.plantedF = !cell.plantedF;
    cell.plantedF ? cell.button.setAttribute("src", "icons/flag.png") : cell.button.removeAttribute("src");
}

function revealCell (x, y) {
    const cell = board[y][x];

    cell.isOpen = true;
    cell.button.classList.add("open-cell");
    cell.button.classList.remove("closed-cell");
    cell.button.setAttribute("src", images.get(cell.value));

    if (cell.value >= 0 && cell.isOpen === true) {
        boardSize--;
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
        cell.button.style = "background: red;";
        minesOnBoard.style.visibility = "hidden";
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
        minesOnBoard.style.visibility = "hidden";
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
    minesOnBoard.style.visibility = "visible";
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