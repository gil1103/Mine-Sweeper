const MINE = '💣'
const BOARD_BTN = '⬜'
const FLAG = '⛳'
const LEFT = 0;
const RIGHT = 2;
const NORMAL = '😀'
const LOSE = '🤯'
const WIN = '😎'

var gBoard;  // A Matrix containing cell objects
var gBoardSize = 4;
var gStartTimer;
var gGameInterval = null;
var gCellClicked;
var gMouseClicks = 0;
var gElLives = document.querySelector('.lives');
var gElSmiley = document.querySelector('.Smiley');

var gGame =                      //update the current game state:
{
    status: 0,                  //  0 - active, 1 - endedWin, 2 - endedLose
    firstClick: true,
    shownCount: 0,              //How many cells are shown
    markedCount: 0,             //How many cells are marked (with a flag)
    secsPassed: 0,              //How many seconds passed
    livesCount: 2
}

function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    gGame.status = 0;
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gGame.firstClick = true;
    gElSmiley.innerHTML = NORMAL
    if (gGameInterval) clearInterval(gGameInterval);
    gGameInterval = null;
    document.querySelector('.timer').innerText = 'Timer'
}

function startGame(row, col) {
    gGame.status = 0;
    randomizeMines(gBoard, row, col);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
}

// Builds the board Set mines at random locations Call setMinesNegsCount() 
// Return the created board
function buildBoard() {
    var size = gBoardSize;
    var board = createMat(size, size);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                type: BOARD_BTN
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function randomizeMines(board, forbidenRow, forbidenCol) {
    var allocatedMines = 0;
    var minesCount = minesAlocation(board);
    while (allocatedMines < minesCount) {
        var Idx = getRandomInt(1, gBoardSize);
        var Jdx = getRandomInt(1, gBoardSize);
        if (board[Idx][Jdx].isMine || (Idx === forbidenRow && Jdx === forbidenCol)) continue;
        board[Idx][Jdx].isMine = true;
        allocatedMines++;
    }
}

function minesAlocation(board) {
    switch (board.length) {
        case 4:
            minesCount = 2;
            break;
        case 8:
            minesCount = 12;
            break;
        case 12:
            minesCount = 30;
            break;
    }return minesCount;
}

// Count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
        }
    } return board
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '<div class="inner level' + gBoardSize + '"><table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td data-i="${i}" data-j="${j}"
            onmousedown="mouseDown(event,this,${i},${j});"><span class="cell">${board[i][j].type}<span></td>`
        }
        strHTML += '</tr>\n';
    }
    strHTML += '</tbody></table></div>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    // checkVictory();
}

function mouseDown(event, elCell, row, col) {
    if (gGame.status > 0) return;
    if (gGame.firstClick) {
        startGame(row, col);
        gGame.firstClick = false;
        startTimer();
    }
    switch (event.button) {
        case LEFT:
            cellClicked(elCell, row, col);
            break;
        case RIGHT:
            cellMarked(elCell, row, col);
            break;
    }
    if (checkVictory()) {
        gGame.status = 1;
        gElSmiley.innerHTML = WIN;
        gameOver()
    }
}

// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    else gBoard[i][j].isShown = true;
    if (gBoard[i][j].isMine) {
        gGame.livesCount--;
        gElSmiley.innerHTML = LOSE;
        gBoard[i][j].type = MINE;
        elCell.innerText = MINE;
        gElLives.innerHTML = `<div class="lives"> ${gGame.livesCount} LIVES LEFT </div>`
        if (gGame.livesCount === 0) {
            unCoverAllMines(elCell);
            gGame.status = 2;
            gameOver();
        }
    }
    else if (gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].type = `${gBoard[i][j].minesAroundCount}`;
        elCell.innerText = `${gBoard[i][j].minesAroundCount}`;
        gGame.shownCount++;
    }
    else if (gBoard[i][j].minesAroundCount === 0) {
        unCoverCellWithoutNegs(i, j, elCell)
    }
    renderBoard(gBoard);
}

function unCoverCellWithoutNegs(cellI, cellJ, elCell) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoardSize) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoardSize) continue;
            gBoard[i][j].type = `${gBoard[i][j].minesAroundCount}`;
            elCell.innerText = `${gBoard[i][j].minesAroundCount}`;
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
            }
        }
    } gGame.shownCount++
}

function unCoverAllMines(elCell) {
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].type = MINE;
                elCell.innerText = MINE;
            }
        }
    }
}

// Called on right click to mark a cell (suspected to be a mine) Search
// the web (and implement) how to hide the context menu on right click
function cellMarked(elCell, row, col) {
    if (gBoard[row][col].isMarked) {
        gBoard[row][col].isMarked = !gBoard[row][col].isMarked;
        gGame.markedCount--;
    }
    else {
        gBoard[row][col].isMarked = !gBoard[row][col].isMarked;
        gGame.markedCount++;
    }
    gBoard[row][col].type = (gBoard[row][col].isMarked) ? FLAG : BOARD_BTN;
    elCell.innerText = (gBoard[row][col].isMarked) ? FLAG : BOARD_BTN;
}

// Game ends when all mines are marked, and all the other cells are shown
function checkVictory() {
    var minesCount = minesAlocation(gBoard);
    if (((gGame.markedCount + gGame.shownCount) === gBoardSize ** 2) && (minesCount === gGame.markedCount)) {
        return true;
    } return false;
}

function setLevel(level) {
    if (gGameInterval) clearInterval(gGameInterval);
    gGameInterval = null;
    gStartTimer = 0;
    gBoardSize = level;
    initGame();
}

function gameOver() {
    clearInterval(gGameInterval);
    gGameInterval = null;
    var currTime = Date.now();
    var finalTime = currTime - gStartTimer;
    var finalSeconds = (finalTime / 1000).toFixed(3);
    if (gGame.status === 2) {
        var str = 'Lose in ' + finalSeconds + ' seconds!';
    }
    else if (gGame.status === 1) {
        var str = 'You win in ' + finalSeconds + ' seconds!';
    }
    document.querySelector('h1').innerText = str;
}

//TIME FUNCTIONS:

function startTimer() {
    gStartTimer = Date.now();
    gGameInterval = setInterval(timeCounter, 30);
    var elTimeLog = document.querySelector('.timer');
    elTimeLog.style.fontSize = '25px';
}

function timeCounter() {
    var currTime = Date.now();
    var elTimeCounter = document.querySelector('.timer');
    var timePassed = currTime - gStartTimer;
    var secondsPassed = (timePassed / 1000).toFixed(3);
    elTimeCounter.innerText = `${secondsPassed}`;
}

//UTILS:

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}