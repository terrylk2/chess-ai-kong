'use strict';

var chessRules = require('chess-rules');
var strategy = require('./strategy');
var evaluator = require('./evaluator');

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

    fullMoves = quickSort(position, fullMoves, 0, fullMoves.length-1);

    var sortedMoves = new Array(moves.length);
    for(i=0; i<moves.length; i++) {
        sortedMoves[i] = fullMoves[i].move;
    };

    return sortedMoves;
}

function quickSort(position, fullMoves, lowInd, highInd) {

    var i = lowInd;
    var j = highInd;
    var pivot = rateMove(fullMoves[lowInd + Math.floor((highInd - lowInd) / 2)], position);

    while (i <= j) {
        while (rateMove(fullMoves[i], position) < pivot) {
            i++;
        }
        while (rateMove(fullMoves[j], position) > pivot) {
            j--;
        }
        if (i <= j) {
            swapMoves(fullMoves, i, j);
            i++;
            j--;
        }
    }

    if (lowInd < j) {
        fullMoves = quickSort(position, fullMoves, lowInd, j);
    }
    if (i < highInd) {
        fullMoves = quickSort(position, fullMoves, i, highInd);
    }
    return fullMoves;
}

function swapMoves(moves, indA, indB) {
    var temp = moves[indA];
    moves[indA] = moves[indB];
    moves[indB] = temp;
}

function rateAttack(move) {

    var moveRate = 0;
    if(move.pgn.indexOf('-')) {
        //castling
        moveRate += 40;
    } else {
        if(move.pgn.indexOf('x')) {
            //capture
            moveRate += 100;
        }

        if(move.pgn.indexOf('=')) {
            //promotion
            moveRate += 200;
        }
    }

    if(move.pgn.indexOf('+')) {
        //check
        moveRate += 500;
    }

    return moveRate;
}

function ratePosition(move, position) {
    var currentPiece = position.board[move.move.src];
    if (currentPiece == null) {
        return 0;
    } else {
        return strategy.getPositionScore(
            currentPiece,
            move.move.dst,
            'basic'
        );
    }
}

function ratePiece(move, position) {
    var currentPiece = position.board[move.move.src];
    return strategy.getPieceScore(
        currentPiece,
        'basic'
    );
}

function rateMove(move, position) {
    //Negate to sort from the best to the worst
    return -(rateAttack(move) + ratePosition(move, position) + ratePiece(move, position));
}

module.exports.sortMoves = sortMoves;