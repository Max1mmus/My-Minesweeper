const rows = 5;
const columns = 5;
let board = [];
const mineCount = 7;
let minesFlagged = 0;
let boardSize = rows * columns - mineCount;

document.getElementById("mLeft").innerHTML = `Mines on board: ${mineCount}`;

const images = [
    [
        "icons/blank.jpg",
        "icons/num1.jpg",
        "icons/num2.jpg",
        "icons/num3.jpg",
        "icons/num4.jpg",
        "icons/num5.jpg",
        "icons/num6.jpg",
        "icons/num7.jpg",
        "icons/num8.jpg"
    ],
    ["icons/mine.jpg"]
];

function getImg (v, cV) {
    if (v === 0 && cV >= 1) {
        return images[0][cV];

    } else if (v === 0 && cV === 0) {
        return images[0][0];

    } else if (v === 1 && cV === 0) {
        return images[1][0];
    }
    return "";
}

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
                value: 0,        // value 1 represents a mine, value 0 is not a mine
                countVal: null, // neighbours count
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
                x: x,
                y: y
            });

            imges.onclick = function () {
                checkCell(this.x, this.y);
            }.bind({
                x: x,
                y: y
            });
        }
        msTable.appendChild(tRows);
    }
    boardId.appendChild(msTable);
    plantMines();
    neibr();
}

function winLog (x, y) {
    const cell = board[y][x];
    if (cell.value === 0 && cell.isOpen === true) {
        boardSize--;
        console.log(boardSize);
    }
    if (boardSize === 0) {
        alert("You won!");
        resetBoard();
    }
}

function plantFlag (x, y) {
    const cell = board[y][x];
    if (cell.isOpen) {
        return;
    }
    if (cell.plantedF) {
        cell.button.setAttribute("src", "icons/closed.jpg"); // closed tile img
        cell.isFlag = false;
    } else {
        cell.button.setAttribute("src", "icons/flag.jpg"); // flag tile
        cell.isFlag = true;
    }
    cell.plantedF = !cell.plantedF;
    checkIfmine(x, y);
}

function checkIfmine (x, y) {
    const cell = board[y][x];
    for (let s = 0; s < 1; s++) {

        if (cell.value === 1) {
            if (cell.isFlag === true) minesFlagged++;
            if (cell.isFlag === false) minesFlagged--;
        }

        if (cell.value === 0) {
            return;
        }
        console.log(minesFlagged);

        if (minesFlagged === mineCount) {
            alert("You won !");
            resetBoard();
        }
    }
}

function plantMines () {
    let mPlanted = 0;

    while (mPlanted < mineCount) {
        const x = Math.floor(Math.random() * 5);
        const y = Math.floor(Math.random() * 5);

        if (board[y][x].value !== 1) {
            board[y][x].value = 1;
            mPlanted++;
        }
    }
}

function neibr () {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {

            let count = 0;
            // if the field is not a mine , how many mines are surrounding it
            if (board[i][j].value === 0) {
                if (i - 1 >= 0                                    && board[i - 1][j].value === 1) count++; // up
                if (i + 1 < board.length                          && board[i + 1][j].value === 1) count++; // down
                if (j - 1 >= 0                                    && board[i][j - 1].value === 1) count++; // left
                if (j + 1 < board.length                          && board[i][j + 1].value === 1) count++; // right
                if (i - 1 >= 0 && j - 1 >= 0                      && board[i - 1][j - 1].value === 1) count++; // up&left
                if (i - 1 >= 0 && j + 1 < board.length            && board[i - 1][j + 1].value === 1) count++; // up&right
                if (i + 1 < board.length && j + 1 < board.length  && board[i + 1][j + 1].value === 1) count++; // down&right
                if (i + 1 < board.length && j - 1 >= 0            && board[i + 1][j - 1].value === 1) count++; // down&left
            }
            board[i][j].countVal = count;
            // console.log(count)
        }
    }
}

function inBounds (x, y) {
    return x >= 0 && x < columns && y >= 0 && y < rows;
}

function revealCell (x, y) {
    const cell = board[y][x];
    cell.isOpen = true;
    cell.button.setAttribute("src", getImg(cell.value, cell.countVal));
    winLog(x, y);
}

function revealNei (x, y) {
    if (!inBounds(x, y)) return;

    const cell = board[y][x];

    if (cell.isOpen) return;

    if (cell.value === 0 && cell.countVal > 0) {
        revealCell(x, y);
        return;
    }

    if (cell.value === 0 && cell.countVal === 0) {
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

    if (cell.value === 0 && cell.countVal > 0) {
        revealCell(x, y);
    }

    if (cell.value === 0 && cell.countVal === 0) {
        revealNei(x, y);
        return;
    }
    if (cell.value === 1) {
        cell.button.style = "background: red; padding: 2px; width: 48px";
        revealCell(x, y);
        traverse();
        alert("Game Over!");
        resetBoard();
        minesFlagged = 0;
    }
}

function traverse () {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const cell = board[y][x];
            if (cell.value === 1) {
                revealCell(x, y);
            }
        }
    }
}

function resetBoard () {

    const conf = confirm("Reset game?");
    if (conf === true) {
        const getEl = document.getElementById("board");
        while (getEl.hasChildNodes()) {
            getEl.removeChild(getEl.lastChild);
        }

        genGrid();
        minesFlagged = 0;
        boardSize = rows * columns - mineCount;
        console.log(board);
    }
}

function manualReset () {
    const getEl = document.getElementById("board");

    while (getEl.hasChildNodes()) {
        getEl.removeChild(getEl.lastChild);
    }
    genGrid();
    minesFlagged = 0;
    boardSize = rows * columns - mineCount;
    console.log(board);
}

const elMano = document.getElementById("manualR");
elMano.onclick = manualReset;
genGrid();
console.log(board);