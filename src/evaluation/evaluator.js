'use-strict';

var strategy = require('./strategy');

/**
 * Evaluate the current position for the current player (turn).
 *
 * @param position The current position and turn
 * @param strategyName The name of the strategy to use
 * @returns {number} The score (regarding the strategy currently set)
 */
function ratePositionAndPieces(position, strategyName) {

    var score = 0;
    var player = position.turn;

    var ind;
    for (ind = 0; ind < position.board.length; ind++) {
        var currentPiece = position.board[ind];
        if (currentPiece != null) {
            if (currentPiece.side == player) {
                score += strategy.getPieceScore(currentPiece, strategyName);
                score += strategy.getPositionScore(currentPiece, ind, strategyName);
            } else {
                score -= strategy.getPieceScore(currentPiece, strategyName);
                score -= strategy.getPositionScore(currentPiece, ind, strategyName);
            }
        }
    }
    return score;
}

/**
 * Rate the attack (checks and castlings).
 *
 * @param position The current position and turn
 * @returns {number} The score (regarding the strategy currently set)
 */
function rateAttack(position) {

    var score = 0;
    var player = position.turn;
    var opponent = position.turn === 'W' ? 'B' : 'W';

    //Checks
    if(position.check) {
        score -= 500;
    }

    //Castlings
    if(!position.castlingFlags[player].K || !position.castlingFlags[player].Q) {
        score += 100;
    }
    if(!position.castlingFlags[opponent].K || !position.castlingFlags[opponent].Q) {
        score -= 100;
    }

    return score;
}

/**
 * Evaluate the board for the current player (turn).
 *
 * @param currentPosition The current position and turn
 * @param strategyName The name of the strategy to use
 * @returns {number} The score (regarding the strategy currently set)
 */
function evaluateBoard(currentPosition, strategyName) {
    return ratePositionAndPieces(currentPosition, strategyName) + rateAttack(currentPosition);
}

module.exports.evaluateBoard = evaluateBoard;