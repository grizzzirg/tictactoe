const PLAYER_X = "X";
const PLAYER_O = "O";
let currentPlayer = PLAYER_X;
let globalBoard = Array(9).fill(null).map(() => Array(9).fill(null));
let boardStatus = Array(9).fill(null);
let currentBoard = null;

const gameBoardElement = document.getElementById("game-board");
const gameStatusElement = document.getElementById("game-status");
const restartButton = document.getElementById("restart-button");

// Initialize the game board
function initializeGame() {
    gameBoardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const boardDiv = document.createElement("div");
        boardDiv.classList.add("board");
        boardDiv.dataset.index = i;

        for (let j = 0; j < 9; j++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.board = i;
            cellDiv.dataset.cell = j;
            cellDiv.addEventListener("click", handleCellClick);
            boardDiv.appendChild(cellDiv);
        }

        gameBoardElement.appendChild(boardDiv);
    }

    currentPlayer = PLAYER_X;
    currentBoard = null;
    globalBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    boardStatus = Array(9).fill(null);
    updateStatus();
}

// Handle cell click
function handleCellClick(event) {
    const boardIndex = event.target.dataset.board;
    const cellIndex = event.target.dataset.cell;

    if (currentBoard !== null && currentBoard !== parseInt(boardIndex)) {
        // If the player tries to play in the wrong board
        return;
    }

    if (globalBoard[boardIndex][cellIndex] !== null || boardStatus[boardIndex] !== null) {
        // If the cell or board is already won
        return;
    }

    globalBoard[boardIndex][cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin(globalBoard[boardIndex])) {
        markBoardWon(boardIndex);
    }

    currentBoard = parseInt(cellIndex);
    if (boardStatus[currentBoard] !== null) {
        currentBoard = null; // Free choice
    }

    if (checkWin(boardStatus)) {
        gameStatusElement.textContent = `${currentPlayer} wins the game!`;
        disableAllCells();
    } else {
        switchPlayer();
        updateStatus();
    }
}

// Check if a player has won a small or large board
function checkWin(board) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winConditions.some(combination => 
        combination.every(index => board[index] === currentPlayer)
    );
}

// Mark a small board as won
function markBoardWon(boardIndex) {
    boardStatus[boardIndex] = currentPlayer;
    const boardDiv = gameBoardElement.children[boardIndex];
    boardDiv.classList.add("won");
    const cells = boardDiv.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.classList.add("won");
        cell.removeEventListener("click", handleCellClick);
    });
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
}

// Update game status
function updateStatus() {
    if (currentBoard === null) {
        gameStatusElement.textContent = `${currentPlayer}'s turn. Free choice of board.`;
    } else {
        gameStatusElement.textContent = `${currentPlayer}'s turn. Play in board ${currentBoard + 1}.`;
    }
}

// Disable all cells once the game is won
function disableAllCells() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.removeEventListener("click", handleCellClick));
}

// Restart game
restartButton.addEventListener("click", initializeGame);

// Initialize the game on page load
initializeGame();
