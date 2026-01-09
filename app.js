// Chess Bot Master - Enhanced Version
let board = null;
let game = new Chess();
let stockfish = null;
let playerColor = 'white';
let moveCount = 0;
let captureCount = 0;
let isPlayerTurn = true;
let botThinkStartTime = 0;

// Piece values for material count
const pieceValues = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
};

const capturedWhite = [];
const capturedBlack = [];

// Initialize board configuration
const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

// Initialize everything on load
window.addEventListener('DOMContentLoaded', () => {
    initBoard();
    initStockfish();
    setupEventListeners();
    updateStatus();
});

function initBoard() {
    board = Chessboard('board', config);
    window.addEventListener('resize', () => board.resize());
}

function initStockfish() {
    stockfish = new Worker('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');
    
    stockfish.addEventListener('message', function(e) {
        if (typeof e.data === 'string') {
            if (e.data.startsWith('bestmove')) {
                const botThinkTime = Date.now() - botThinkStartTime;
                document.getElementById('think-time').textContent = `${(botThinkTime / 1000).toFixed(2)}s`;
                
                const bestMove = e.data.split(' ')[1];
                const move = game.move({
                    from: bestMove.substring(0, 2),
                    to: bestMove.substring(2, 4),
                    promotion: bestMove.length > 4 ? bestMove.substring(4, 5) : 'q'
                });
                
                if (move) {
                    if (move.captured) {
                        handleCapture(move);
                    }
                    board.position(game.fen());
                    updateGameState();
                    isPlayerTurn = true;
                    hideBotThinking();
                }
            }
        }
    });
}

function setupEventListeners() {
    document.getElementById('new-game').addEventListener('click', newGame);
    document.getElementById('undo-move').addEventListener('click', undoMove);
    document.getElementById('hint-btn').addEventListener('click', getHint);
    document.getElementById('player-color').addEventListener('change', handleColorChange);
}

function handleColorChange() {
    newGame();
}

function newGame() {
    game.reset();
    board.start();
    moveCount = 0;
    captureCount = 0;
    capturedWhite.length = 0;
    capturedBlack.length = 0;
    playerColor = document.getElementById('player-color').value;
    isPlayerTurn = (playerColor === 'white');
    
    board.orientation(playerColor);
    updateGameState();
    document.getElementById('hint-card').classList.add('hidden');
    
    if (playerColor === 'black') {
        setTimeout(() => makeBotMove(), 500);
    }
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if (!isPlayerTurn) return false;
    
    if ((playerColor === 'white' && piece.search(/^b/) !== -1) ||
        (playerColor === 'black' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    if (move.captured) {
        handleCapture(move);
    }

    updateGameState();
    
    if (!game.game_over()) {
        isPlayerTurn = false;
        setTimeout(() => makeBotMove(), 250);
    }
}

function onSnapEnd() {
    board.position(game.fen());
}

function handleCapture(move) {
    captureCount++;
    const capturedPiece = pieceValues[move.captured];
    
    if (move.color === 'w') {
        capturedBlack.push(capturedPiece);
        updateCapturedDisplay('black-captured', capturedBlack);
    } else {
        capturedWhite.push(capturedPiece);
        updateCapturedDisplay('white-captured', capturedWhite);
    }
}

function updateCapturedDisplay(elementId, pieces) {
    const container = document.getElementById(elementId);
    container.innerHTML = pieces.map(p => `<span class="captured-piece">${p}</span>`).join('');
}

function makeBotMove() {
    if (game.game_over()) return;
    
    showBotThinking();
    botThinkStartTime = Date.now();
    
    const depth = document.getElementById('difficulty').value;
    stockfish.postMessage('position fen ' + game.fen());
    stockfish.postMessage('go depth ' + depth);
}

function undoMove() {
    if (moveCount === 0) return;
    
    // Undo bot move
    const botMove = game.undo();
    if (botMove && botMove.captured) {
        removeCapturedPiece(botMove);
    }
    
    // Undo player move
    const playerMove = game.undo();
    if (playerMove && playerMove.captured) {
        removeCapturedPiece(playerMove);
    }
    
    board.position(game.fen());
    updateGameState();
    isPlayerTurn = true;
    document.getElementById('hint-card').classList.add('hidden');
}

function removeCapturedPiece(move) {
    captureCount--;
    const capturedPiece = pieceValues[move.captured];
    
    if (move.color === 'w') {
        const index = capturedBlack.lastIndexOf(capturedPiece);
        if (index > -1) capturedBlack.splice(index, 1);
        updateCapturedDisplay('black-captured', capturedBlack);
    } else {
        const index = capturedWhite.lastIndexOf(capturedPiece);
        if (index > -1) capturedWhite.splice(index, 1);
        updateCapturedDisplay('white-captured', capturedWhite);
    }
}

function getHint() {
    if (game.game_over() || !isPlayerTurn) return;
    
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return;
    
    // Simple hint: suggest a random legal move
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    const hintText = `Try moving from ${randomMove.from} to ${randomMove.to}`;
    
    document.getElementById('hint-text').textContent = hintText;
    document.getElementById('hint-card').classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('hint-card').classList.add('hidden');
    }, 5000);
}

function updateGameState() {
    updateStatus();
    updateMoveHistory();
    updateStats();
}

function updateStatus() {
    let status = '';
    const moveColor = game.turn() === 'w' ? 'White' : 'Black';

    if (game.in_checkmate()) {
        status = `🏆 Game Over - ${moveColor === 'White' ? 'Black' : 'White'} wins by checkmate!`;
    } else if (game.in_draw()) {
        status = '🤝 Game Over - Draw';
    } else if (game.in_stalemate()) {
        status = '🤝 Game Over - Stalemate';
    } else if (game.in_threefold_repetition()) {
        status = '🤝 Game Over - Draw by repetition';
    } else {
        status = `${moveColor} to move`;
        if (game.in_check()) {
            status += ' ⚠️ Check!';
        }
    }

    document.getElementById('game-status').textContent = status;
}

function updateMoveHistory() {
    const history = game.history();
    const moveHistory = document.getElementById('move-history');
    moveHistory.innerHTML = '';
    
    moveCount = Math.ceil(history.length / 2);
    
    for (let i = 0; i < history.length; i += 2) {
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        
        const moveNumber = document.createElement('span');
        moveNumber.className = 'move-number';
        moveNumber.textContent = `${Math.floor(i / 2) + 1}.`;
        
        const whiteMove = document.createElement('span');
        whiteMove.className = 'move-notation';
        whiteMove.textContent = history[i];
        
        const blackMove = document.createElement('span');
        blackMove.className = 'move-notation';
        blackMove.textContent = history[i + 1] || '';
        
        moveItem.appendChild(moveNumber);
        moveItem.appendChild(whiteMove);
        moveItem.appendChild(blackMove);
        moveHistory.appendChild(moveItem);
    }
    
    moveHistory.scrollTop = moveHistory.scrollHeight;
}

function updateStats() {
    document.getElementById('move-count').textContent = moveCount;
    document.getElementById('capture-count').textContent = captureCount;
}

function showBotThinking() {
    document.getElementById('bot-thinking').classList.remove('hidden');
    document.getElementById('game-status').classList.add('hidden');
}

function hideBotThinking() {
    document.getElementById('bot-thinking').classList.add('hidden');
    document.getElementById('game-status').classList.remove('hidden');
}