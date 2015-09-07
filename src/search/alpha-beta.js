'use strict';

var chessRules = require('chess-rules');
var evaluator = require('./../evaluation/evaluator');
var sorter = require('./quick-sort');
var _monitor = require('./../monitoring/monitoring');

var aiDepth = 2;
var aiTimeout = 10000;
var aiStrategy = 'basic';

/**
 * Set the timeout around which the search shall return a move.
 *
 * @param timeout The timeout in millisecond
 */
function setTimeout(timeout) {
    aiTimeout = timeout;
}

/**
 * Set the strategy to use in the evaluation.
 * @param strategyName The strategy name ('basic' by default, 'random')
 */
function setStrategy(strategyName) {
    aiStrategy = strategyName;
}

/**
 * Set the depth of the alpha-beta algorithm.
 * @param depth The depth (2 by default)
 */
function setDepth(depth) {
    aiDepth = depth;
}

/**
 * Evaluate each move based on the current position and depth.
 *
 * @param moves The array of available moves
 * @param position The current position
 * @param depth The current search depth
 * @returns {Array} The array of evaluated moves (pgn, move, value)
 */
function evaluateMoves(moves, position, depth) {

    _monitor.startWatch('evaluateMoves');
    var evaluatedMoves = new Array(moves.length);

    var i;
    for (i = 0; i < moves.length; i++) {
        var move = moves[i];
        _monitor.startWatch('evaluateMoves-applyMove');
        var tmpPosition = chessRules.applyMove(position, move);
        _monitor.stopWatch('evaluateMoves-applyMove');
        /**
         * TODO: Fix the moves.length as it should be the number of available moves for the new position.
         */
        var value = evaluator.evaluateBoard(tmpPosition, moves.length, depth, aiStrategy);
        evaluatedMoves[i] = {
            pgn: chessRules.moveToPgn(position, move),
            move: move,
            value: value
        };
    }

    _monitor.stopWatch('evaluateMoves');
    return evaluatedMoves;
}

/**
 * Get the AI next move for the position passed in, this method follow the alpha beta max algorithm.
 * @param position The position and AI turn
 * @returns {*} The move
 */
function getNextMove(position) {
    //console.log('getNextMove ['+ position.turn + ']');
    _monitor.clear();
    _monitor.startWatch('getNextMove');
    _monitor.startWatch('setup');

    var alpha = -1000000;
    var beta = 1000000;
    var bestMove = null;

    //Initialize the data for AlphaBeta Search
    var alphaBetaData = {
        lastMove: null,
        moves: null,
        path: 'root',
        startTime: new Date().getTime()
    };
    _monitor.stopWatch('setup');

    //Get the available moves
    _monitor.startWatch('availableMoves');
    var availableMoves = chessRules.getAvailableMoves(position);
    _monitor.stopWatch('availableMoves');

    //Evaluate the moves
    var evaluatedMoves = evaluateMoves(availableMoves, position, aiDepth-1);

    //Order moves to enhance pruning
    alphaBetaData.moves = sorter.sortMoves(evaluatedMoves);

    alphaBetaData.moves.some(function (move) {

        _monitor.startWatch('applyMove');
        var nextPosition = chessRules.applyMove(position, move.move);
        _monitor.stopWatch('applyMove');
        alphaBetaData.lastMove = move;
        alphaBetaData.path = move.pgn;

        //console.log('-ROOT MOVE: ' + chessRules.moveToPgn(position, move));
        //var score = alphaBetaMin(nextPosition, alpha, beta, aiDepth - 1, alphaBetaData);
        var score = -alphaBeta(nextPosition, -beta, -alpha, aiDepth - 1, alphaBetaData);
        _monitor.addSearchNode(move.pgn, alpha, beta, 0, score);

        //Use of alpha-beta max for the first step
        if(score >= beta) {
            //Cut-off
            _monitor.addCutoffNode(alphaBetaData.path, alpha, beta, 0, score);
            alpha = beta;
            _monitor.stopWatch('return');
            return true;
        }

        if(score > alpha) {
            //we have found a better best move (a new max)
            alpha = score;
            bestMove = move;
            //console.log('New root best move: ' + bestMove.pgn);
        }
        _monitor.stopWatch('return');
        return false;
    });

    _monitor.stopWatch('getNextMove');
    _monitor.dumpLogs(true);
    return bestMove == null ? null : bestMove.pgn;
}

function isTerminal(position) {
    return chessRules.getGameStatus(position) !== 'OPEN';
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

    if(depth == 0
        || new Date().getTime() - alphaBetaData.startTime > aiTimeout*0.98-200
        || isTerminal(position)) {

        /**
         * TODO: Enhance with Quiescence algorithm.
         */
        _monitor.startWatch('return');
        //Move has already been evaluated by the sort algorithm in the previous run
        return alphaBetaData.lastMove.value;
    }

    //Get the available moves
    _monitor.startWatch('availableMoves');
    var availableMoves = chessRules.getAvailableMoves(position);
    _monitor.stopWatch('availableMoves');

    //Evaluate the moves
    var evaluatedMoves = evaluateMoves(availableMoves, position, depth);

    //Order moves to enhance pruning
    alphaBetaData.moves = sorter.sortMoves(evaluatedMoves);

    alphaBetaData.moves.some(function (move) {

        _monitor.startWatch('applyMove');
        var nextPosition = chessRules.applyMove(position, move.move);
        _monitor.stopWatch('applyMove');

        //Update alphaBeta data to pass on
        alphaBetaData.lastMove = move;
        alphaBetaData.path = path + '-' + move.pgn;

        var score = -alphaBeta(nextPosition, -beta, -alpha, depth - 1, alphaBetaData);
        _monitor.addSearchNode(path + '-' + move.pgn, alpha, beta, aiDepth-depth, score);

        //Cut off
        if (score >= beta) {
            _monitor.addCutoffNode(path + '-' + move.pgn, alpha, beta, aiDepth-depth, score);
            alpha = beta;
            _monitor.stopWatch('return');
            return true;
        }

        //we have found a better best move
        if(score > alpha) {
            alpha = score;
        }
        _monitor.stopWatch('return');
        return false;
    });

    return alpha;
}

module.exports.setDepth = setDepth;
module.exports.setStrategy = setStrategy;
module.exports.setTimeout = setTimeout;
module.exports.getNextMove = getNextMove;