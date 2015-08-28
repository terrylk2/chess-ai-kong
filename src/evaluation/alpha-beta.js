'use strict';

var chessRules = require('chess-rules');
var evaluator = require('./evaluator');
var sorter = require('./moves-sort');

var searchDepth = 2;
var currentStrategy = 'basic';

//monitoring variables
var cutoffs = [];
var consoleTree = [];
var nbNodeSearched = 0;
var nbCutoffs = 0;

/**
 * Set the strategy to use in the evaluation.
 * @param strategyName The strategy name ('basic' by default, 'random')
 */
function setStrategy(strategyName) {
    currentStrategy = strategyName;
}

/**
 * Set the depth of the alpha-beta algorithm.
 * @param depth The depth (2 by default)
 */
function setDepth(depth) {
    searchDepth = depth;
}

/**
 * Get the AI next move for the position passed in, this method follow the alpha beta max algorithm.
 * @param position The position and AI turn
 * @returns {*} The move
 */
function getNextMove(position) {
    //console.log('getNextMove ['+ position.turn + ']');

    //monitoring initialization
    cutoffs.splice(0, cutoffs.length);
    consoleTree.splice(0, consoleTree.length);
    nbNodeSearched = 0;
    nbCutoffs = 0;

    var alpha = -1000000;
    var beta = 1000000;
    var bestMove = null;

    var availableMoves = chessRules.getAvailableMoves(position);
    availableMoves = sorter.sortMoves(availableMoves, position);
    availableMoves.some(function (move) {
        nbNodeSearched++;
        var tmpPosition = chessRules.applyMove(position, move);
        var pgnMove = chessRules.moveToPgn(position, move);
        //console.log('-ROOT MOVE: ' + chessRules.moveToPgn(position, move));
        var score = -alphaBeta(tmpPosition, -beta, -alpha, searchDepth - 1, pgnMove);
        //consoleTree.push({
        //        path: pgnMove,
        //        type: 'min',
        //        alpha: alpha,
        //        beta: beta,
        //        depth: searchDepth-1,
        //        score: score}
        //);

        //Use of alpha-beta max for the first step
        if(score >= beta) {
            //Cut-off
            //cutoffs.push({
            //    path: pgnMove,
            //    score: score,
            //    alpha: alpha,
            //    beta: beta,
            //    move: pgnMove
            //});
            //console.log('Big cutoff!!!!!!!!');
            nbCutoffs++;
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
    return bestMove == null ? null : chessRules.moveToPgn(position, bestMove);
}

function dumpLogs() {

    console.log(nbNodeSearched + ' node searched');
    console.log(nbCutoffs + ' cut-offs');
    var strings;
    if(cutoffs.length > 0) {
        strings = ['--CUTOFFS--'];
        cutoffs.forEach(function (cutoff) {
            strings.push('\n');
            strings.push('{'
                + 'path: ' + cutoff.path
                + ',alpha: ' + cutoff.alpha
                + ',beta: ' + cutoff.beta
                + ',score: ' + cutoff.score
                + '}');
        });
        console.log(strings.join(''));
    }

    if(consoleTree.length > 0) {
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
}

/**
 * Single alpha-beta algorithm (Negamax).
 *
 * @param position The current position
 * @param alpha The current best score
 * @param beta The current worst score
 * @param depth The depth
 * @param path The path (succession of moves) of the recursive algorithm
 * @returns {number} The score evaluated
 */
function alphaBeta( position, alpha, beta, depth, path) {

    nbNodeSearched++;

    if(depth == 0  || chessRules.getGameStatus(position) !== 'OPEN') {
        /**
         * TODO: Enhance with Quiescence algorithm.
         */
        return evaluator.evaluatePosition(position, currentStrategy);
    }

    var availableMoves = chessRules.getAvailableMoves(position);
    availableMoves = sorter.sortMoves(availableMoves, position);

    availableMoves.some(function (move) {

        var tmpPosition = chessRules.applyMove(position, move);
        var pgnMove = chessRules.moveToPgn(position, move);
        var score = -alphaBeta( tmpPosition, -beta, -alpha, depth - 1, path + '-' + pgnMove);

        //Cut off
        if (score >= beta) {
            //Cut-off
            //cutoffs.push({
            //    path: pgnMove,
            //    score: score,
            //    alpha: alpha,
            //    beta: beta,
            //    move: pgnMove
            //});
            nbCutoffs++;
            alpha = beta;
            return true;
        }

        //we have found a better best move
        if(score > alpha) {
            alpha = score;
        }
        return false;
    });

    return alpha;
}

module.exports.setDepth = setDepth;
module.exports.setStrategy = setStrategy;
module.exports.getNextMove = getNextMove;