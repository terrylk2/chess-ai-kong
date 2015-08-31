'use strict';

var chessRules = require('chess-rules');
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

    //Initialize the data for AlphaBeta Search
    var alphaBetaData = {
        lastMove: null,
        moves: null,
        path : 'root',
    };

    //Get the available moves
    var availableMoves = chessRules.getAvailableMoves(position);
    //Evaluate the moves and order them to enhance pruning
    alphaBetaData.moves = sorter.sortMoves(availableMoves, position, searchDepth-1, currentStrategy);

    alphaBetaData.moves.some(function (move) {
        nbNodeSearched++;

        var nextPosition = chessRules.applyMove(position, move.move);
        alphaBetaData.lastMove = move;
        alphaBetaData.path = move.pgn;

        //console.log('-ROOT MOVE: ' + chessRules.moveToPgn(position, move));
        var score = -alphaBeta(nextPosition, -beta, -alpha, searchDepth - 1, alphaBetaData);
        //consoleTree.push({
        //        path: alphaBetaData.path,
        //        alpha: alpha,
        //        beta: beta,
        //        depth: searchDepth-1,
        //        score: score}
        //);

        //Use of alpha-beta max for the first step
        if(score >= beta) {
            //Cut-off
            //cutoffs.push({
            //    path: alphaBetaData.path,
            //    score: score,
            //    alpha: alpha,
            //    beta: beta,
            //    move: move.pgn
            //});
            //console.log('Big cutoff!!!!!!!!');
            nbCutoffs++;
            return true;
        }

        if(score > alpha) {
            //we have found a better best move (a new max)
            alpha = score;
            bestMove = move;
            //console.log('New root best move: ' + bestMove.pgn);
        }
        return false;
    });

    //dumpLogs();
    return bestMove == null ? null : bestMove.pgn;
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
                + ',type: ' + (node.depth%2 === 1 ? 'min' : 'max')
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
 * @param alphaBetaData Data gathered at recursion depth+1
 * @returns {number} The score evaluated
 */
function alphaBeta(position, alpha, beta, depth, alphaBetaData) {

    var path = alphaBetaData.path;
    nbNodeSearched++;

    if(depth == 0  || chessRules.getGameStatus(position) !== 'OPEN') {
        /**
         * TODO: Enhance with Quiescence algorithm.
         */
        //Move has already been evaluated by the sort algorithm in the previous run
        return alphaBetaData.lastMove.value;
    }

    //Get the available moves
    var availableMoves = chessRules.getAvailableMoves(position);
    //Evaluate the moves and order them to enhance pruning
    alphaBetaData.moves = sorter.sortMoves(availableMoves, position, depth-1, currentStrategy);

    alphaBetaData.moves.some(function (move) {

        var nextPosition = chessRules.applyMove(position, move.move);
        //Update alphaBeta data to pass on
        alphaBetaData.lastMove = move;
        alphaBetaData.path = path + '-' + move.pgn;

        var score = -alphaBeta(nextPosition, -beta, -alpha, depth - 1, alphaBetaData);
        //consoleTree.push({
        //        path: alphaBetaData.path,
        //        alpha: alpha,
        //        beta: beta,
        //        depth: depth - 1,
        //        score: score}
        //);

        //Cut off
        if (score >= beta) {
            //Cut-off
            //cutoffs.push({
            //    path: alphaBetaData.path,
            //    score: score,
            //    alpha: alpha,
            //    beta: beta,
            //    move: move.pgn
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