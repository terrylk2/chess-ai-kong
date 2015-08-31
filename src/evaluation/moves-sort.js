'use strict';

var chessRules = require('chess-rules');
var evaluator = require('./evaluator');

var currentStrategy = 'basic';
var currentDepth = 0;
var currentMovesLength = -1;

function sortMoves(moves, position, depth, strategyName) {

    currentDepth = depth;
    currentMovesLength = moves.length;
    currentStrategy = strategyName;

    var evaluatedMoves = new Array(moves.length);

    var i;
    for(i=0; i<moves.length; i++) {
        var move = moves[i];
        evaluatedMoves[i] = {
            pgn: chessRules.moveToPgn(position, move),
            move: move,
            //Value is updated by quick sort
            value: null
        };
    }

    //Moves are evaluated during the sort
    return quickSort(position, evaluatedMoves, 0, evaluatedMoves.length-1);
}

function quickSort(position, fullMoves, lowInd, highInd) {

    var i = lowInd;
    var j = highInd;
    var pivot = rateMove(fullMoves[lowInd + Math.floor((highInd - lowInd) / 2)], position);

    while (i <= j) {
        while(rateMove(fullMoves[i], position) < pivot) {
            i++;
        }

        while(rateMove(fullMoves[j], position) > pivot) {
            j--;
        }

        if (i <= j) {
            swapMoves(fullMoves, i, j);
            i++;
            j--;
        }
    }

    if (lowInd < j) {
        quickSort(position, fullMoves, lowInd, j);
    }
    if (i < highInd) {
        quickSort(position, fullMoves, i, highInd);
    }
    return fullMoves;
}

function swapMoves(moves, indA, indB) {
    var temp = moves[indA];
    moves[indA] = moves[indB];
    moves[indB] = temp;
}

/**
 * Fill the value field of the move passed in if it does not exist and return the evaluated value.
 *
 * @param move The move to rate
 * @param position The actual position
 * @returns {*|number} The move evaluation
 */
function rateMove(move, position) {

    if(!move.value) {
        var tmpPosition = chessRules.applyMove(position, move.move);
        move.value = evaluator.evaluateBoard(tmpPosition, currentMovesLength, currentDepth, currentStrategy);
    }

    return move.value;
}

module.exports.sortMoves = sortMoves;