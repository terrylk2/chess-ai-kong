'use strict';

var aiSearch = require('./search/alpha-beta');
var chessRules = require('chess-rules');

aiSearch.setStrategy('basic');
aiSearch.setDepth(2);

/**
 * Get the next move from the current status of the game.
 *
 * @param position The actual positions
 * @returns {*} the pgn move chosen by the AI
 */
function playPosition(position) {

    return aiSearch.getNextMove(position);
}

/**
 * Get the next move from the complete sequence of moves of the game.
 *
 * @param pgnMoves the complete sequence of moves since the beginning of the game
 */
function playMoves(pgnMoves) {

    var position = chessRules.getInitialPosition();

    pgnMoves.forEach(function (moveText) {
        var moveCoords = chessRules.pgnToMove(position, moveText);
        position = chessRules.applyMove(position, moveCoords);
    });

    return playPosition(position);
}

module.exports.play = playMoves;
module.exports.playPosition = playPosition;
