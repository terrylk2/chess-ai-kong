'use strict';

var basic = require('./strategies/basic');
var random = require('./strategies/random');

/**
 * Get the strategy table with the scores per piece positions.
 * @param name The name of the strategy
 * @returns {*} The table
 */
function getStrategyPositionTable(name) {
    var strategy = null;
    if ('basic' === name) {
        strategy = basic.getStrategyPositionTable();
    } else {
        strategy = random.getStrategyPositionTable();
    }
    return strategy;
}

/**
 * Get the strategy table with the scores for each piece.
 * @param name The name of the strategy
 * @returns {*} The table
 */
function getStrategyPiecesTable(name) {
    var strategy = null;
    if ('basic' === name) {
        strategy = basic.getStrategyPiecesTable();
    } else {
        strategy = random.getStrategyPiecesTable();
    }
    return strategy;
}

/**
 * Get the score of the piece for the current turn, position and strategy.
 * @param piece The chess piece
 * @param turn The turn (Black or Chite)
 * @param position The position index
 * @param strategy The strategy name
 * @returns {number} The score
 */
function getPositionScore(piece, turn, position, strategy) {
    var score = 0;
    var strategyTables = getStrategyPositionTable(strategy);
    if('B' === turn) {
        //The table are defined for White player, so Black scores can be found by negating the position
        var index = 63 - position;
        score = strategyTables[piece.type][index];
    } else {
        score = strategyTables[piece.type][position];
    }
    //console.log('getScore(piece:' + piece.type
    //    + ',turn:' + turn
    //    + ',position:' + position
    //    + ') = ' + score
    //);
    return score;
}

/**
 * Get the score of the piece with the strategy passed in.
 * @param piece The chess piece
 * @param strategy The strategy name
 * @returns {number} The score
 */
function getPieceScore(piece, strategy) {
    var piecesWeigh = getStrategyPiecesTable(strategy);
    var score = piecesWeigh[piece.type];
    //console.log('getPieceWeigh(piece:' + piece.type + ') = ' + score);
    return score;
}

module.exports.getPositionScore = getPositionScore;
module.exports.getPieceScore = getPieceScore;