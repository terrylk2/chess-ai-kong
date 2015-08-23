'use strict';

var aiSearch = require('./evaluation/alpha-beta');

/**
 * Get the next move from the current status of the game.
 *
 * @param position The actual positions
 * @returns {*} the pgn move chosen by the AI
 */
function play(position) {

    //AI Search configuration
    aiSearch.setStrategy('basic');
    aiSearch.setDepth(2);

    var aiMove = aiSearch.getNextMove(position);

    console.log('Replied move: ' + aiMove);

    return aiMove;
}

/**
 *
 * @param pgnMoves
 */
/*
function play(pgnMoves) {
    var position = chessRules.getInitialPosition();

    pgnMoves.forEach(function (movetext) {
        var moveCoords = chessRules.pgnToMove(position, movetext);
        position = chessRules.applyMove(position, moveCoords);
    });

    var availableMoves = chessRules.getAvailableMoves(position);
    var selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    var movetext = chessRules.moveToPgn(position, selectedMove);

    return movetext;
}
*/

module.exports.play = play;
