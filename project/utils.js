chessModule = require("chess.js");
constants = require("./constants.js");
const text = "present";
function getPieceValue(posObj, x, y) {
    let posVal = constants.evalRepo[posObj.color][posObj.type][x][y];
    return posVal;
}

function minimaxRoot(chess, depth, isMaximisingPlayer) {
    // console.log(text)
    let newGameMoves = chess.moves();
    // console.log(newGameMoves)
    let bestMove = -9999;
    let bestMoveFound;

    for(let i = 0; i < newGameMoves.length; i++) {
        let newGameMove = newGameMoves[i]
        chess.move(newGameMove);
        let value = minimax(chess, depth - 1, -100000, 100000, !isMaximisingPlayer);
        if (chess.isThreefoldRepetition() | chess.isStalemate() | chess.isDraw()) {
            value -= 3000;
        }
        chess.undo();
        if (value === null) {
            break;
        }
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

function minimax(chess, depth, alpha, beta, isMaximisingPlayer) {
    // console.log(text)
    if (depth === 0) {
        return -evaluateBoard(chess.board());
    }

    let newGameMoves = chess.moves();
    if (newGameMoves !== []) {
        let bestMove = null;
        if (isMaximisingPlayer) {
            bestMove = -99999;
            for (let i = 0; i < newGameMoves.length; i++) {
                chess.move(newGameMoves[i]);
                bestMove = Math.max(bestMove, minimax(chess, depth - 1, alpha, beta, !isMaximisingPlayer));
                if (chess.isThreefoldRepetition() | chess.isStalemate() | chess.isDraw()) {
                    bestMove -= 3000;
                }
                chess.undo();
                alpha = Math.max(alpha, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            bestMove = 99999;
            for (let i = 0; i < newGameMoves.length; i++) {
                chess.move(newGameMoves[i]);
                bestMove = Math.min(bestMove, minimax(chess, depth - 1, alpha, beta, !isMaximisingPlayer));
                if (chess.isThreefoldRepetition() | chess.isStalemate() | chess.isDraw()) {
                    bestMove -= 3000;
                }
                chess.undo();
                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    }
    
    else {
        return null;
    }
};

function getBestMove (fen, depth) {    
    // let depth = DEPTH;
    chess = new chessModule.Chess();
    chess.load(fen);
    // console.log(constants.K)
    // console.log(chess.moves());
    let bestMove = minimaxRoot(chess, depth, true);

    return bestMove;
};

function evaluateBoard(board) {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

function getPieceValue(piece, x, y) {
    if (piece === null) {
        return 0;
    }
    function getAbsoluteValue(piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return constants.P + ( isWhite ? constants.pawnEvalWhite[y][x] : constants.pawnEvalBlack[y][x] );
        }
        else if (piece.type === 'r') {
            return constants.R + ( isWhite ? constants.rookEvalWhite[y][x] : constants.rookEvalBlack[y][x] );
        }
        else if (piece.type === 'n') {
            return constants.N + constants.knightEvalNeutral[y][x];
        }
        else if (piece.type === 'b') {
            return constants.B + ( isWhite ? constants.bishopEvalWhite[y][x] : constants.bishopEvalBlack[y][x] );
        }
        else if (piece.type === 'q') {
            return constants.Q + constants.queenEvalNeutral[y][x];
        }
        else if (piece.type === 'k') {
            return constants.K + ( isWhite ? constants.kingEvalWhite[y][x] : constants.kingEvalBlack[y][x] );
        }
    }

    let absoluteValue = getAbsoluteValue(piece, (piece.color === 'w'), x ,y);
    return (piece.color === 'w')? absoluteValue : -absoluteValue;
}

module.exports.getBestMove = getBestMove;
module.exports.minimaxRoot = minimaxRoot;
module.exports.minimax = minimax;
