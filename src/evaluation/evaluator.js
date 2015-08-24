'use-strict';

//var chessRules = require('chess-rules');
var strategy = require('./strategy');

/**
 * Evaluate the current position for the current player (turn).
 * @param position The current position and turn
 * @param strategyName The name of the strategy to use
 * @returns {number} The score (regarding the strategy currently set)
 */
function evaluatePosition(position, strategyName) {

    var score = 0;
    var player = position.turn;
    var opponent = position.turn === 'W' ? 'B' : 'W';

    var row;
    var col;
    for (row = 7; row >= 0; row--) {
        for (col = 0; col < 8; col++) {
            var currentPiece = position.board[row * 8 + col];
            if (currentPiece == null) {
                continue;
            } else {
                if(currentPiece.side == player) {
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

module.exports.evaluatePosition = evaluatePosition;