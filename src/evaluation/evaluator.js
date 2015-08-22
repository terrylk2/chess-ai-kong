'use-strict';

//var chessRules = require('chess-rules');
var strategy = require('./strategy');

/**
 * Evaluate the current position for the current player (turn).
 * @param position The current position and turn
 * @returns {number} The score (regarding the strategy currently set)
 */
function evaluatePosition(position, strategyName) {

    /**
     * TODO: optimization.
     * @type {number}
     */

    var score = 0;
    var currentTurn = position.turn;

    var row;
    var col;
    for (row = 7; row >= 0; row--) {
        for (col = 0; col < 8; col++) {
            var currentPiece = position.board[row * 8 + col];
            if (currentPiece == null) {
                continue;
            } else {
                if(currentPiece.side == currentTurn) {
                    score += strategy.getPieceScore(currentPiece, strategyName);
                    score += strategy.getPositionScore(
                        currentPiece,
                        row * 8 + col,
                        strategyName
                    );
                } else {
                    score -= strategy.getPieceScore(currentPiece, strategyName);
                    score -= strategy.getPositionScore(
                        currentPiece,
                        row * 8 + col,
                        strategyName
                    );
                }
            }
        }
    }

    /**
     * TODO Evaluate mobility (number of moves).
     */

    /**
     * TODO Evaluate captures.
     */

    /**
     * TODO: Evaluate checks.
     */
    if(position.check) {
        score -= 500;
    }

    /**
     * TODO Evaluate castlings.
     */
    //if(position.castlingFlags[position.turn].K || position.castlingFlags[position.turn].Q) {
    //    score += 500;
    //}

    return score;
}

module.exports.evaluatePosition = evaluatePosition;