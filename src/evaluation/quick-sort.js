'use strict';

/**
 * Sort the list of evaluated moves passed in.
 *
 * @param evaluatedMoves The array of evaluated moves
 * @returns {*} The list of evaluated moves sorted
 */
function sortMoves(evaluatedMoves) {

    return quickSort(evaluatedMoves, 0, evaluatedMoves.length-1);
}

function quickSort(fullMoves, lowInd, highInd) {

    var i = lowInd;
    var j = highInd;
    var pivot = fullMoves[lowInd + Math.floor((highInd - lowInd) / 2)].value;

    while (i <= j) {
        while(fullMoves[i].value < pivot) {
            i++;
        }

        while(fullMoves[j].value > pivot) {
            j--;
        }

        if (i <= j) {
            swapMoves(fullMoves, i, j);
            i++;
            j--;
        }
    }

    if (lowInd < j) {
        quickSort(fullMoves, lowInd, j);
    }
    if (i < highInd) {
        quickSort(fullMoves, i, highInd);
    }
    return fullMoves;
}

function swapMoves(moves, indA, indB) {
    var temp = moves[indA];
    moves[indA] = moves[indB];
    moves[indB] = temp;
}

module.exports.sortMoves = sortMoves;