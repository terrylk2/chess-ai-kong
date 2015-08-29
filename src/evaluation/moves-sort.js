'use strict';

var chessRules = require('chess-rules');
var evaluator = require('./evaluator');

var currentStrategy = 'basic';

function sortMoves(moves, position) {

    var fullMoves = new Array(moves.length);

    var i;
    for(i=0; i<moves.length; i++) {
        var move = moves[i];
        fullMoves[i] = {
            pgn: chessRules.moveToPgn(position, move),
            move: move
        };
    }

    //Keep the rated moves in a array to not re-evaluate them many times during the sort
    var ratedMoves = new Array(moves.length);
    quickSort(position, fullMoves, 0, fullMoves.length-1, ratedMoves);

    //var strings = ['-sorted moves = ['];
    var sortedMoves = new Array(moves.length);
    for(i=0; i<moves.length; i++) {
        //strings.push('{'+ fullMoves[i].pgn+ ',' + ratedMoves[fullMoves[i].pgn]+ '} ');
        sortedMoves[i] = fullMoves[i].move;
    }
    //strings.push(']');
    //console.log(strings.join(''));

    return sortedMoves;
}

function quickSort(position, fullMoves, lowInd, highInd, ratedMoves) {

    var i = lowInd;
    var j = highInd;
    var pivot = rateMove(fullMoves[lowInd + Math.floor((highInd - lowInd) / 2)], position, ratedMoves);

    while (i <= j) {
        while (rateMove(fullMoves[i], position, ratedMoves) < pivot) {
            i++;
        }
        while (rateMove(fullMoves[j], position, ratedMoves) > pivot) {
            j--;
        }
        if (i <= j) {
            swapMoves(fullMoves, i, j);
            i++;
            j--;
        }
    }

    if (lowInd < j) {
        quickSort(position, fullMoves, lowInd, j, ratedMoves);
    }
    if (i < highInd) {
        quickSort(position, fullMoves, i, highInd, ratedMoves);
    }
    return fullMoves;
}

function swapMoves(moves, indA, indB) {
    var temp = moves[indA];
    moves[indA] = moves[indB];
    moves[indB] = temp;
}

function rateMove(move, position, ratedMoves) {
    var rate = ratedMoves[move.pgn];

    if(!rate) {
        var tmpPosition = chessRules.applyMove(position, move.move);
        rate = evaluator.evaluateBoard(tmpPosition, currentStrategy);
        ratedMoves[move.pgn]=rate;
    }

    return rate;
}

module.exports.sortMoves = sortMoves;