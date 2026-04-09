// Initialize Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

let selectedCell = null;
let mistakes = 0;

// The Puzzle (0 is empty)
const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// The Solution (To check mistakes)
const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

function createGrid() {
    const gridDiv = document.getElementById('grid');
    gridDiv.innerHTML = ''; // Clear grid

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (puzzle[r][c] !== 0) {
                cell.innerText = puzzle[r][c];
                cell.classList.add('fixed');
            } else {
                cell.onclick = () => selectCell(cell);
            }
            gridDiv.appendChild(cell);
        }
    }
}

function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    selectedCell.classList.add('selected');
}

function inputValue(num) {
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;

    const r = selectedCell.dataset.row;
    const c = selectedCell.dataset.col;

    if (solution[r][c] === num) {
        selectedCell.innerText = num;
        selectedCell.classList.remove('error');
        checkWin();
    } else {
        mistakes++;
        document.getElementById('mistake-count').innerText = mistakes;
        selectedCell.innerText = num;
        selectedCell.classList.add('error');

        if (mistakes >= 3) {
            alert("Game Over! Too many mistakes.");
            location.reload();
        }
    }
}

function checkWin() {
    const cells = document.querySelectorAll('.cell');
    const filled = Array.from(cells).every(cell => cell.innerText !== '');
    if (filled) alert("Congratulations! You solved the Pi Sudoku!");
}

async function buyHint() {
    try {
        const payment = await Pi.createPayment({
            amount: 0.1,
            memo: "Sudoku Hint",
            metadata: { type: "hint" },
        }, {
            onReadyForServerApproval: (paymentId) => { /* Verify on server later */ },
            onReadyForServerCompletion: (paymentId, txid) => { 
                alert("Hint: Look at the top left empty cell!"); 
            },
            onCancel: (paymentId) => { },
            onError: (error, payment) => { },
        });
    } catch (err) {
        alert("Hints are only available in the Pi Browser.");
    }
}

createGrid();