'use-strict';

var strategy = require('./strategy');
var _monitor = require('./../monitoring/monitoring');

var castlingRate = 100;
var checkRate = 75;
var checkMateRate = 200000;
var staleMateRate = 150000;
var movabilityRate = 5;

/**
 * Evaluate the current position for the current player (turn).
 *
 * @param position The current position and turn
 * @param strategyName The name of the strategy to use
 * @returns {number} The score (regarding the strategy currently set)
 */
function ratePositionAndPieces(position, strategyName) {

    var score = 0;

    var ind;
    for (ind = 0; ind < position.board.length; ind++) {
        var currentPiece = position.board[ind];
        if (currentPiece != null && currentPiece.side == position.turn) {
            score += strategy.getPieceScore(currentPiece, strategyName);
            score += strategy.getPositionScore(currentPiece, ind, strategyName);
        }
    }
    return score;
}

/**
 * Rate the defense (castlings).
 *
 * @param position The current position and turn
 * @returns {number} The score (regarding the strategy currently set)
 */
function rateDefense(position) {

    var score = 0;
    var player = position.turn;
    var opponent = position.turn === 'W' ? 'B' : 'W';

    //Castlings
    if(!position.castlingFlags[player].K || !position.castlingFlags[player].Q) {
        score += castlingRate;
    }
    if(!position.castlingFlags[opponent].K || !position.castlingFlags[opponent].Q) {
        score -= castlingRate;
    }

    return score;
}

/**
 * Rate the Movability including checks and stale situations.
 *
 * @param position The current position and turn
 * @param movesLength The number of available moves
 * @param depth The depth in the search algorithm
 * @param playerTurn True if the function is called to rate the player's turn, false if opponent
 * @returns {number} The score (regarding the strategy currently set)
 */
function rateMovability(position, movesLength, depth, playerTurn) {

    var score = 0;

    score += movesLength*movabilityRate;
    if(playerTurn) {
        if (movesLength == 0) {
            if (position.check) {
                score -= checkMateRate * depth;
            } else {
                score -= staleMateRate * depth;
            }
        } else if (position.check) {
            score -= checkRate * depth;
        }
    }

    return score;
}

/**
 * Evaluate the board for the current player (turn).
 *
 * @param moveLength The number of moves
 * @param currentPosition The current position and turn
 * @param depth the depth in the search algorithm
 * @param strategyName The name of the strategy to use
 * @returns {number} The score (regarding the strategy currently set)
 */
function evaluateBoard(currentPosition, moveLength, depth, strategyName) {
    _monitor.startWatch('evaluateBoard');
    var score = ratePositionAndPieces(currentPosition, strategyName);
    score += rateDefense(currentPosition);
    score += rateMovability(currentPosition, moveLength, depth, true);
    currentPosition.turn = currentPosition.turn === 'W' ? 'B' : 'W';
    score -= ratePositionAndPieces(currentPosition, strategyName);
    score -= rateDefense(currentPosition);
    score -= rateMovability(currentPosition, moveLength, depth, false);
    currentPosition.turn = currentPosition.turn === 'W' ? 'B' : 'W';
    _monitor.stopWatch('evaluateBoard');
    return score;
}

module.exports.evaluateBoard = evaluateBoard;