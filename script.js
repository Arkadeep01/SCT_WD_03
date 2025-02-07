const board = document.getElementById("board");
let cells = [];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "";

function createboard() {
    board.innerHTML = "";
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", makeMove);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function makeMove(event) {
    if (!gameActive) return;
    const cell = event.target;

    if (cell.textContent !== "") return;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    if (checkWinner()) {
        document.getElementById("status").textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        document.getElementById("status").textContent = "It's a Draw";
        gameActive = false;
        return;
    }

    if (gameMode === "PvAI" && currentPlayer === "X") {
        setTimeout(aiPlayer, 500);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    updateStatus();
}

function updateStatus() {
    const status = document.getElementById("status");
    status.classList.add("fade");
    setTimeout(() => {
        status.classList.remove("fade");
        status.textContent = `Player ${currentPlayer}'s turn.`;
    }, 500);
}

function aiPlayer() {
    if (!gameActive) return;  

    const emptyCells = cells.filter(cell => cell.textContent === "");
    if (emptyCells.length === 0) return;

    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = "O";
    randomCell.classList.add("taken");

    if (checkWinner()) {
        document.getElementById("status").textContent = `Player O wins!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        document.getElementById("status").textContent = "It's a Draw";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    updateStatus();
}

function checkDraw() {
    return cells.every(cell => cell.textContent !== "");
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent) {
            drawWinLine(pattern);
            gameActive = false;
            return true;
        }
    }
    return false;
}

function drawWinLine(pattern) {
    const boardRect = board.getBoundingClientRect();
    const startCell = cells[pattern[0]].getBoundingClientRect();
    const endCell = cells[pattern[2]].getBoundingClientRect();
    
    const line = document.createElement("div");
    line.classList.add("win-line");
    
    const x1 = startCell.left + startCell.width / 2 - boardRect.left;
    const y1 = startCell.top + startCell.height / 2 - boardRect.top;
    const x2 = endCell.left + endCell.width / 2 - boardRect.left;
    const y2 = endCell.top + endCell.height / 2 - boardRect.top;
    
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    
    board.appendChild(line);
}

function resetGame() {
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("status").textContent = "Player X's turn.";
    document.querySelectorAll(".win-line").forEach(line => line.remove());
    createboard();
}

function StartGame(mode) {
    if (!["PvP", "Online", "PvAI"].includes(mode)) {
        console.error("Invalid Game Mode Selected:", mode);
        return;
    }
    gameMode = mode;
    document.getElementById("welcome_screen").style.display = "none";
    document.getElementById("game_container").style.display = "block";
    resetGame();
}

function goback() {
    document.getElementById("welcome_screen").style.display = "block";
    document.getElementById("game_container").style.display = "none";
    resetGame();
}

createboard();
