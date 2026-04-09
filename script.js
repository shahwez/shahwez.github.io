// Initialize Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true }); // Set sandbox: false when ready for production

let selectedCell = null;

// Simple Sudoku Puzzle (0 = empty)
const board = [
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

function createGrid() {
    const gridDiv = document.getElementById('grid');
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[r][c] !== 0) {
                cell.innerText = board[r][c];
                cell.classList.add('fixed');
            } else {
                cell.onclick = () => {
                    if (selectedCell) selectedCell.classList.remove('selected');
                    selectedCell = cell;
                    cell.classList.add('selected');
                };
            }
            gridDiv.appendChild(cell);
        }
    }
}

function inputValue(num) {
    if (selectedCell && !selectedCell.classList.contains('fixed')) {
        selectedCell.innerText = num;
    }
}

// PI NETWORK MONETIZATION
async function buyHint() {
    try {
        const payment = await Pi.createPayment({
            amount: 0.1,
            memo: "Buy a hint for Sudoku",
            metadata: { type: "hint" },
        }, {
            onReadyForServerApproval: (paymentId) => { /* Handle on your server */ },
            onReadyForServerCompletion: (paymentId, txid) => { alert("Payment Complete! Here is your hint: The cell at (1,3) is 4"); },
            onCancel: (paymentId) => { console.log("Cancelled"); },
            onError: (error, payment) => { console.error(error); },
        });
    } catch (err) {
        alert("Please open this in the Pi Browser to pay with Pi.");
    }
}

createGrid();