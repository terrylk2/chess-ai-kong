'use strict';

var chessRules = require('chess-rules');
var strategy = require('./strategy');
var evalDepth = 2;

var currentStrategy = 'basic';

/**
 * Get the AI next move for the position passed in.
 * @param position The position and AI turn
 * @returns {*} The move
 */
function getNextMove(position) {

    //console.log('getNextMove ['+ position.turn + ']');
    var bestMove = null;
    var alpha = -32767;
    var beta = 32767;

    var availableMoves = chessRules.getAvailableMoves(position);
    availableMoves.some(function (move) {
        var tmpPosition = chessRules.applyMove(position, move);
        var score = alphaBetaMin(tmpPosition, alpha, beta, evalDepth - 1);
        //console.log('[alpha=' + alpha + ', beta=' + beta + ']');
        //console.log('[rootMove:' + chessRules.moveToPgn(position, move) + ', score=' + score + ']');

        //Use of alpha-beta max for the first step
        if(score >= beta) {
            //Cut-off
            return true;
        }

        if(score > alpha) {
            //we have found a better best move
            alpha = score;
            bestMove = move;
        }
        return false;
    });

    return chessRules.moveToPgn(position, bestMove);
}

/**
 * Set the strategy to use in the evaluation.
 * @param strategyName The strategy name ('basic', 'random')
 */
function setStrategy(strategyName) {
    currentStrategy = strategyName;
}

/**
 * Evaluate the current position.
 * @param position The current position and turn
 * @returns {number} The score (regarding the strategy currently set)
 */
function evaluatePosition(position) {

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
                if(currentPiece.side = currentTurn) {
                    score += strategy.getPieceScore(currentPiece);
                } else {
                    score -= strategy.getPieceScore(currentPiece);
                }
                score += strategy.getPositionScore(
                    currentPiece,
                    position.turn,
                    row * 8 + col,
                    currentStrategy
                );
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
    if(position.castlingFlags[position.turn].K || position.castlingFlags[position.turn].Q) {
        score += 500;
    }

    return score;
}

function alphaBeta( position, alpha, beta, depth) {

    //console.log('alphaBeta [move:' + move + ', alpha:' + alpha + ', beta:' + beta + ', depth:' + depth + '}');
    //console.log(chessRules.positionToString(position));
    if(depth == 0) {
        /**
         * TODO: Enhance with Quiescence algorithm.
         */
        return evaluatePosition(position);
    }

    var availableMoves = chessRules.getAvailableMoves(position);

    /**
     * TODO: Sort/Order moves (best first) to enhance the algorithm.
     */

    availableMoves.forEach(function (m) {

        /**
         * TODO: Apply move here. (might be better than cloning)
         */
        var tmpPosition = chessRules.applyMove(position, m);
        var score = -alphaBeta( tmpPosition, -beta, -alpha, depth - 1 );

        /**
         * TODO: Revert move here. (might be better than cloning)
         */

        //Cut off
        if (score >= beta) {
            return beta;
        }

        //we have found a better best move
        if(score > alpha) {
            alpha = score;
        }
    });

    return alpha;
}

/**
 * Alpha-Beta maximizing algorithm. Search for the AI best move.
 * @param position The current position
 * @param alpha The current best score
 * @param beta The current worst score
 * @param depth The depth
 * @returns {number} The score evaluated
 */
function alphaBetaMax(position, alpha, beta, depth) {
    //console.log('alphaBetaMax(turn' + position.turn
    //    + ', move:'+ chessRules.moveToPgn(position, move)
    //    + ', alpha' + alpha
    //    + ', beta' + beta
    //    + ', depth' + depth
    //);
    var value = 0;

    if(depth == 0) {
        return evaluatePosition(position);
    }

    var availableMoves = chessRules.getAvailableMoves(position);

    availableMoves.some(function (move) {
        var tmpPosition = chessRules.applyMove(position, move);
        var score = alphaBetaMin( tmpPosition, alpha, beta, depth - 1 );
        //Cut off
        if (score >= beta) {
            value = beta;
            return true;
        }

        //we have found a better best move
        if(score > alpha) {
            alpha = score;
            value = alpha;
        }
        return false;
    });
    return value;
}

/**
 * Alpha-Beta minimizing algorithm. Search for the opponent's best move.
 * @param position The current position
 * @param alpha The current worst score
 * @param beta The current best score
 * @param depth The depth
 * @returns {number} The score evaluated
 */
function alphaBetaMin(position, alpha, beta, depth) {
    //console.log('alphaBetaMin(turn' + position.turn
    //    + ', move:'+ chessRules.moveToPgn(position, move)
    //    + ', alpha' + alpha
    //    + ', beta' + beta
    //    + ', depth' + depth
    //);
    var value = 0;

    if(depth == 0) {
        return -evaluatePosition(position);
    }

    var availableMoves = chessRules.getAvailableMoves(position);

    availableMoves.some(function (move) {
        var tmpPosition = chessRules.applyMove(position, move);
        var score = alphaBetaMax( tmpPosition ,alpha, beta, depth - 1 );
        //cut off
        if (score <= alpha) {
            value = alpha;
            return true;
        }

        //opponent has found a better worse move
        if(score < beta) {
            beta = score;
            value = beta;
        }
        return false;
    });
    return value;
}


module.exports.setStrategy = setStrategy;
module.exports.getNextMove = getNextMove;