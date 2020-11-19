const MINE = '💣'
const BOARD_BTN = '⬜'
// const BOARD_BTN_IMG = '<img src="img/button.JPG" class="BOARD_BTN"/>'

var gBoard;  // A Matrix containing cell objects
var gBoardSize = 4;
var gStartTimer;
var gGameInterval = null;
var gCellClicked;
var gMouseClicks=0;
// var gLevel = [
//     { Level: 1, size: 4, MINES: 2 },
//     { Level: 2, size: 8, MINES: 12 },
//     { Level: 3, size: 12, MINES: 30 }
// ]

//This is an object by which the board 
// size is set (in this case: 4x4 board 
// and how many mines to put)
var gGame =                         //update the current game state:
{
    isOn: false,                //when true we let the user play
    shownCount: 0,              //How many cells are shown
    markedCount: 0,             //How many cells are marked (with a flag)
    secsPassed: 0               //How many seconds passed
}

function initGame() {
    gBoard = buildBoard();
    randomizeMines(gBoard);
    setMinesNegsCount(gBoard)
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
                isMarked: true,
                type: BOARD_BTN
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function randomizeMines(board) {
    var minesCount;
    switch (board.length) {
        case 4:
            minesCount = 2;
            break;
        case 8:
            minesCount = 12;
            break;
        case 8:
            minesCount = 30;
            break;
    }
    for (var i = 0; i < minesCount; i++) {
        var Idx = getRandomInt(1, gBoardSize);
        var Jdx = getRandomInt(1, gBoardSize);
        (board[Idx][Jdx].isMine) ? i-- : board[Idx][Jdx].isMine = true
    }
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
    var strHTML = '<div class="level4"><table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j});"><span class="cell">${board[i][j].type}<span></td>`
        }
        strHTML += '</tr>\n';
    }
    strHTML += '</tbody></table></div>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true;
    if (gBoard[i][j].isMine) {
        gBoard[i][j].type = MINE;
        elCell.innerText = MINE;
    }
    else if (gBoard[i][j].minesAroundCount >= 0) {
        gBoard[i][j].type = `${gBoard[i][j].minesAroundCount}`;
        elCell.innerText = `${gBoard[i][j].minesAroundCount}`;
    }
    renderBoard(gBoard)
}


function mouseDown(event) { 
    switch (event.button) {
        case 0:              //left
            gMouseClicks++;
            console.log('left')
            break;
        // case 1:                //middle
        // 	moveTo(i, j + 1);
        // 	break;
        case 2:               //right
            gMouseClicks++;
            console.log('right')
            break;
    }if (gMouseClicks === 1) startTimer();
}

// Called on right click to mark a cell (suspected to be a mine) Search
// the web (and implement) how to hide the context menu on right click
function cellMarked(elCell) {

}

// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {

}

// When user clicks a cell with no mines around, we need to open not only
// that cell, but also its neighbors. NOTE: start with a basic 
// implementation that only opens the non-mine 1st degree neighbors
function expandShown(board, elCell, i, j) {

}

function setLevel(level) {
    if (gGameInterval) clearInterval(gGameInterval);
    gGameInterval = null;
    gStartTimer = 0;
    gBoardSize = level;
    init();
}






function gameOver() {
    clearInterval(gGameInterval);
    gGameInterval = null;
    var currTime = Date.now();
    var finalTime = currTime - gStartTimer;
    var finalSeconds = (finalTime / 1000).toFixed(3);
    var str = 'You won! Your new best time is ' + finalSeconds + ' seconds!';
    document.querySelector(h1).innerText = str;
}

function restartGame() {
    if (gGameInterval) clearInterval(gGameInterval);
    gGameInterval = null;
    document.querySelector('.timer').innerText = 'Timer'
    init();
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