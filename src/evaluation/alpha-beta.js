'use strict';

var chessRules = require('chess-rules');
var strategy = require('./strategy');
var evalDepth = 2;

var currentStrategy = 'basic';

//monitoring variables
var alphaCutoffs = [];
var betaCutoffs = [];
var consoleTree = [];

/**
 * Set the strategy to use in the evaluation.
 * @param strategyName The strategy name ('basic', 'random')
 */
function setStrategy(strategyName) {
    currentStrategy = strategyName;
}

/**
 * Get the AI next move for the position passed in, this method follow the alpha beta max algorithm.
 * @param position The position and AI turn
 * @returns {*} The move
 */
function getNextMove(position) {

    //monitoring initialization
    alphaCutoffs.splice(0, alphaCutoffs.length);
    betaCutoffs.splice(0, alphaCutoffs.length);
    consoleTree.splice(0, alphaCutoffs.length);

    //console.log('getNextMove ['+ position.turn + ']');
    var alpha = -32767;
    var beta = 32767;
    var bestMove = null;

    var availableMoves = chessRules.getAvailableMoves(position);
    availableMoves.some(function (move) {
        var tmpPosition = chessRules.applyMove(position, move);
        //console.log('-ROOT MOVE: ' + chessRules.moveToPgn(position, move));
        var score = alphaBetaMin(tmpPosition, alpha, beta, evalDepth - 1, chessRules.moveToPgn(position, move));
        //consoleTree.push({
        //        path: chessRules.moveToPgn(position, move),
        //        type: 'max',
        //        alpha: alpha,
        //        beta: beta,
        //        depth: evalDepth-1,
        //        score: score}
        //);

        //Use of alpha-beta max for the first step
        if(score >= beta) {
            //Cut-off
            //betaCutoffs.push({depth:0, move: chessRules.moveToPgn(position, move)});
            //console.log('Big cutoff!!!!!!!!');
            return true;
        }

        if(score > alpha) {
            //we have found a better best move (a new max)
            alpha = score;
            bestMove = move;
            //console.log('New root best move: ' + chessRules.moveToPgn(position, bestMove));
        }
        return false;
    });

    //dumpLogs();
    return chessRules.moveToPgn(position, bestMove);
}

function dumpLogs() {
    var strings = ['--ALPHA CUTOFFS--'];
    alphaCutoffs.forEach(function (cutoff) {
        strings.push('\n');
        strings.push('{'
            + 'path: ' + cutoff.path
            + ',alpha: ' + cutoff.alpha
            + ',beta: ' + cutoff.beta
            + ',score: ' + cutoff.score
            + '}');
    });
    console.log(strings.join(''));

    strings = ['--BEAT CUTOFFS--'];
    betaCutoffs.forEach(function (cutoff) {
        strings.push('\n');
        strings.push('{'
            + 'path: ' + cutoff.path
            + ',alpha: ' + cutoff.alpha
            + ',beta: ' + cutoff.beta
            + ',score: ' + cutoff.score
            + '}');
    });
    console.log(strings.join(''));

    strings = ['--TREE--'];
    consoleTree.forEach(function (node) {
        strings.push('\n');
        strings.push('{'
            + 'path: ' + node.path
            + ',type: ' + node.type
            + ',alpha: ' + node.alpha
            + ',beta: ' + node.beta
            + ',depth: ' + node.depth
            + ',score: ' + node.score
            + '}');
    });
    console.log(strings.join(''));
}

/**
 * Evaluate the current position for the current player (turn).
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

///**
// * Single alpha-beta algorithm.
// *
// * @param position
// * @param alpha
// * @param beta
// * @param depth
// * @returns {*}
// */
//function alphaBeta( position, alpha, beta, depth) {
//
//    if(depth == 0) {
//        /**
//         * TODO: Enhance with Quiescence algorithm.
//         */
//        return evaluatePosition(position);
//    }
//
//    var availableMoves = chessRules.getAvailableMoves(position);
//
//    /**
//     * TODO: Sort/Order moves (best first) to enhance the algorithm.
//     */
//
//    availableMoves.forEach(function (m) {
//
//        var tmpPosition = chessRules.applyMove(position, m);
//        var score = -alphaBeta( tmpPosition, -beta, -alpha, depth - 1 );
//
//        //Cut off
//        if (score >= beta) {
//            return beta;
//        }
//
//        //we have found a better best move
//        if(score > alpha) {
//            alpha = score;
//        }
//    });
//
//    return alpha;
//}

/**
 * Alpha-Beta maximizing algorithm. Search for the AI best move.
 * @param position The current position
 * @param alpha The current best score
 * @param beta The current worst score
 * @param depth The depth
 * @returns {number} The score evaluated
 */
function alphaBetaMax(position, alpha, beta, depth, path) {

    if(depth == 0) {
        /**
         * TODO: Enhance with Quiescence algorithm.
         */
        var value = evaluatePosition(position);
        return value;
    }

    var availableMoves = chessRules.getAvailableMoves(position);

    /**
     * TODO: Sort/Order moves (best first) to enhance the algorithm.
     */
    availableMoves.forEach(function (move) {
        var tmpPosition = chessRules.applyMove(position, move);
        var newPath = path + '-' + chessRules.moveToPgn(position, move);
        var score = alphaBetaMin( tmpPosition, alpha, beta, depth - 1, newPath);
        //consoleTree.push({
        //        path: newPath,
        //        type: 'min',
        //        alpha: alpha,
        //        beta: beta,
        //        depth: depth-1,
        //        score: score}
        //);
        //Cut off
        if (score >= beta) {
            //betaCutoffs.push({
            //    path: newPath,
            //    score: score,
            //    alpha: alpha,
            //    beta: beta,
            //    move: chessRules.moveToPgn(tmpPosition, move)
            //});
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
 * Alpha-Beta minimizing algorithm. Search for the opponent's best move.
 * @param position The current position
 * @param alpha The current worst score
 * @param beta The current best score
 * @param depth The depth
 * @returns {number} The score evaluated
 */
function alphaBetaMin(position, alpha, beta, depth, path) {

    if(depth == 0) {
        /**
         * TODO: Enhance with Quiescence algorithm.
         */
        var value = -evaluatePosition(position);
        return value;
    }

    var availableMoves = chessRules.getAvailableMoves(position);

    /**
     * TODO: Sort/Order moves (best first) to enhance the algorithm.
     */

    availableMoves.forEach(function (move) {
        var tmpPosition = chessRules.applyMove(position, move);
        var newPath = path + '-' + chessRules.moveToPgn(position, move);
        var score = alphaBetaMax( tmpPosition, alpha, beta, depth - 1, newPath);
        //consoleTree.push({
        //    path: newPath,
        //    type: 'max',
        //    alpha: alpha,
        //    beta: beta,
        //    depth: depth-1,
        //    score: score}
        //);
        //cut off
        if (score <= alpha) {
            //alphaCutoffs.push({
            //    path: newPath,
            //    score: score,
            //    alpha: alpha,
            //    beta: beta,
            //    move: chessRules.moveToPgn(tmpPosition, move)}
            //);
            return alpha;
        }

        //opponent has found a better worse move
        if(score < beta) {
            beta = score;
        }
    });
    return beta;
}

module.exports.setStrategy = setStrategy;
module.exports.getNextMove = getNextMove;