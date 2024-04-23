// Set FIELD SIZE 
const FIELD_SIZE = 3;


// Other settings
const FIELD_ID = 'field';
const PLAY_AGAIN_ID = 'play-again';
const SYMBOLS = { O: '0', X: 'X' };
const FIELD = { rows: null, cols: null, cellsClass: 'cell' };
const DISPLAY = { playerNameId: 'player-name', playerSymbolId: 'player-symbol' };
const player1 = { name: 'Sam', symbol: null };
const player2 = { name: 'Dean', symbol: null };
let CURRENT_PLAYER;
let WINNER;


function setGameFieldSize() {
    FIELD.rows = FIELD_SIZE;
    FIELD.cols = FIELD_SIZE;
    const cellNum = FIELD_SIZE * FIELD_SIZE;
    const field = document.querySelector('#' + FIELD_ID);
    // Set styles
    const cellSize = (100 / FIELD_SIZE).toFixed(2);
    const cellSizesStyle = [...Array(FIELD_SIZE).keys()]
        .map(el => cellSize + '%').join(' ');
    field.style.gridTemplateColumns = cellSizesStyle;
    field.style.gridTemplateRows = cellSizesStyle;
    // Add cells
    for (let i = 0; i < cellNum; i++) {
        const cell = document.createElement('div');
        cell.className = FIELD.cellsClass;
        field.appendChild(cell);
    }
}

function isCell(cellDomEl) {
    return cellDomEl.className === FIELD.cellsClass;
}

function testCell(cellDomEl, symbol) {
    return cellDomEl.textContent === symbol;
}

function setCellSymbol(cellObj, symbol) {
    cellObj.textContent = symbol;
}

function isCellEmpty(cellDomEl) {
    return !testCell(cellDomEl, SYMBOLS.X) && !testCell(cellDomEl, SYMBOLS.O);
}

function getAllCells(className) {
    return [...document.querySelectorAll('.' + className)];
}

function checkForWinningByRow(cells, xy, symbol) { // Iterate through whole row
    for (let i = 0; i < FIELD.cols; i++)
        if (!testCell(cells[calcArrayIndexByXY(i, xy.y)], symbol)) return false;
    return true;
}

function checkForWinningByCol(cells, xy, symbol) { // Iterate through whole column
    for (let i = 0; i < FIELD.rows; i++)
        if (!testCell(cells[calcArrayIndexByXY(xy.x, i)], symbol)) return false;
    return true;
}

function checkForWinningByDiagonal(formX0Y0, cells, symbol) {
    for (let i = 0; i < FIELD.cols; i++) {
        const x = i, y = formX0Y0 ? i : (FIELD.rows - 1) - i;
        if (!testCell(cells[calcArrayIndexByXY(x, y)], symbol)) return false;
    }
    return true;
}

// We are checking only needed rows, cols, etc., but not whole field
function checkForWinning(symbol, cellDomEl) {
    const cells = getAllCells(FIELD.cellsClass);
    const xy = getCellXY(cells, cellDomEl);
    if (checkForWinningByRow(cells, xy, symbol)) return true;
    if (checkForWinningByCol(cells, xy, symbol)) return true;
    if (checkForWinningByDiagonal(true, cells, symbol)) return true;
    if (checkForWinningByDiagonal(false, cells, symbol)) return true;
    return false;
}

// We have the array of all cells, but we need to find out x,y positions
// Example: X - has position x2,y1, 0 - x1,y2
//   x0 x1 x2
// y0 - -  - 
// y1 - -  X 
// y2 - 0  -
function calcXYbyArrayIndex(index) {
    const rowLength = FIELD.cols;
    const colIndex = index % rowLength;
    const rowIndex = Math.floor(index / rowLength);
    return { x: colIndex, y: rowIndex };
}

function calcArrayIndexByXY(x, y) {
    return x + y * FIELD.cols;
}

function getCellXY(cells, cellDomEl) {
    const index = cells.findIndex(el => el === cellDomEl);
    return calcXYbyArrayIndex(index);
}

function setPlayerOnDisplay(playerObj) {
    const playerNameEl = document.querySelector('#' + DISPLAY.playerNameId);
    const playerSymbolEl = document.querySelector('#' + DISPLAY.playerSymbolId);
    playerNameEl.textContent = playerObj.name;
    playerSymbolEl.textContent = `--> ${playerObj.symbol}`;
}

function clearField() {
    const cells = getAllCells(FIELD.cellsClass);
    cells.forEach(cell => setCellSymbol(cell, ''));
}

function startGame() {
    WINNER = null;
    // Random X or 0 for players
    const getRandomBool = () => Math.floor(Math.random() * 1.99) === 1;
    if (getRandomBool()) { player1.symbol = SYMBOLS.X; player2.symbol = SYMBOLS.O; }
    else { player1.symbol = SYMBOLS.O; player2.symbol = SYMBOLS.X; }
    // Random current players
    CURRENT_PLAYER = getRandomBool() ? player1 : player2;
    // Set current player name and symbol to display
    setPlayerOnDisplay(CURRENT_PLAYER);
    clearField();
}


const field = document.querySelector('#' + FIELD_ID);
field.addEventListener('click', (event) => {
    if (WINNER) return;
    const cell = event.target;
    if (!isCell(cell)) return;
    if (!isCellEmpty(cell)) return;

    // Change cell content to current player's symbol
    setCellSymbol(cell, CURRENT_PLAYER.symbol);

    // Check if current player wins
    const isWinner = checkForWinning(CURRENT_PLAYER.symbol, cell);
    if (isWinner) {
        WINNER = CURRENT_PLAYER.name;
        // End game if player won
        console.log('WON!');
        alert(`${CURRENT_PLAYER.name} WON!`);
    } else {
        // Switch player
        CURRENT_PLAYER = CURRENT_PLAYER === player1 ? player2 : player1;
        // Set current player name and symbol to display
        setPlayerOnDisplay(CURRENT_PLAYER);
    }
});

document.querySelector('#' + PLAY_AGAIN_ID).onclick = () => {
    startGame();
};


setGameFieldSize();

startGame();
