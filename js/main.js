const MINE = '💣'
const BOARD_BTN = '⬜'
// const BOARD_BTN_IMG = '<img src="img/button.JPG" class="BOARD_BTN"/>'

var gBoard;  // A Matrix containing cell objects
var gLevel = [
    { Level: 1, SIZE: 4, MINES: 2 },
    { Level: 2, SIZE: 8, MINES: 12 },
    { Level: 3, SIZE: 12, MINES: 30 }
]

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
    gBoard = buildBoard()
    console.log(gBoard)
    renderBoard(gBoard)
}

// Builds the board Set mines at random locations Call setMinesNegsCount() 
// Return the created board
function buildBoard() {
    var SIZE = gLevel[0].SIZE;
    var board = createMat(SIZE, SIZE);

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: true,
                type: BOARD_BTN
            }
            board[i][j] = cell;

        }
      board[0][1].isShown===true;
      board[1][2].isShown===true;
    } return board;
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {

}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            
            // var className = (board[i][j].type===BOARD_BTN) ? ' blank ' : ' mine';
            strHTML += `<td data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j})">${board[i][j].type}</td>`
            // class="${className}">${board[i][j].type}</td>`
        }
        strHTML += '</tr>\n';     
    }
        
    var elBoard = document.querySelector('.board tbody');
    elBoard.innerHTML = strHTML;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown===true){
        gBoard[i][j].type = MINE;
        elCell.innerText = MINE;
    }
    renderBoard(gBoard)
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






// function setLevel(level) {
//     if (gGameInterval) clearInterval(gGameInterval);
//     gGameInterval = null;
//     gStartTimer = 0;
//     gBoardSize = level;
//     init();
// }

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

function getRandomInteger(min, max) {
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