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
 * Get the score of the piece for the current turn, index and strategy.
 * @param piece The chess piece
 * @param index The position index
 * @param strategy The strategy name
 * @returns {number} The score
 */
function getPositionScore(piece, index, strategy) {
    var score = 0;
    var strategyTables = getStrategyPositionTable(strategy);
    if('B' === piece.side) {
        //The table are defined for White player, so Black scores can be found by negating the index
        var blackIndex = 63 - index;
        score = strategyTables[piece.type][blackIndex];
    } else {
        score = strategyTables[piece.type][index];
    }
    //console.log('getScore(piece:' + piece.type
    //    + ',turn:' + piece.side
    //    + ',index:' + index
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
    //console.log('getPieceScore(piece:' + piece.type + ') = ' + score);
    return score;
}

module.exports.getPositionScore = getPositionScore;
module.exports.getPieceScore = getPieceScore;