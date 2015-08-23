'use strict';
var assert = require('assert');
var alphaBeta = require('../../src/evaluation/alpha-beta');
var evaluator = require('../../src/evaluation/evaluator');
var chessRules = require('chess-rules');

//describe('alpha-beta search', function () {
//    it('must provide a valid initial move as white', function () {
//
//        var position = chessRules.getInitialPosition();
//
//        var moveText = alphaBeta.getNextMove(position);
//        var move = chessRules.pgnToMove(position, moveText);
//
//        var availableMoves = chessRules.getAvailableMoves(position);
//
//        var moveIsValid = false;
//        availableMoves.forEach(function (v) {
//            if (_.isMatch(v, move)) {
//                moveIsValid = true;
//            }
//        });
//
//        assert(moveIsValid, 'Move is valid');
//    });
//
//     it('must provide a valid move in reply to first white move', function () {
//
//         var position = chessRules.getInitialPosition();
//         var moves = ['e4'];
//
//         moves.forEach(function (move) {
//            var m = chessRules.pgnToMove(position, move);
//            position = chessRules.applyMove(position, m);
//         });
//
//         var moveText = alphaBeta.getNextMove(position);
//         var move = chessRules.pgnToMove(position, moveText);
//         var availableMoves = chessRules.getAvailableMoves(position);
//
//         var moveIsValid = false;
//         availableMoves.forEach(function (v) {
//            if (_.isMatch(v, move)) {
//                moveIsValid = true;
//            }
//         });
//
//         assert(moveIsValid, 'Move is valid');
//     });
//
//});


describe('alpha-beta drive position', function () {

    /**
     * Position the piece in a bad position and assert that the algorithm make them reach a better position.
     */

    function testPieceBetterPosition(position, pieceName) {
        var initialScore = evaluator.evaluatePosition(position, 'basic');

        position.turn = 'W';
        var moveText = alphaBeta.getNextMove(position);
        var move = chessRules.pgnToMove(position, moveText);
        var tmpPosition = chessRules.applyMove(position,  move);
        tmpPosition.turn = 'W';
        var moveScore = evaluator.evaluatePosition(tmpPosition, 'basic');
        assert(initialScore <= moveScore, 'Not the best White Pawn move!');

        position.turn = 'B';
        moveText = alphaBeta.getNextMove(position);
        move = chessRules.pgnToMove(position, moveText);
        tmpPosition = chessRules.applyMove(position,  move);
        tmpPosition.turn = 'B';
        moveScore = evaluator.evaluatePosition(tmpPosition, 'basic');
        assert(initialScore <= moveScore, 'Not the best Black ' + pieceName + ' move!');
    }
    it('must provide the best move (position) for a Pawn', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'W';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, pwnW, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, pwnB, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        testPieceBetterPosition(position, 'Pawn');
    });

    it('must provide the best move (position) for a Knight', function () {

        var kniW = {type: 'N', side: 'W'};
        var kniB = {type: 'N', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.board = [
            kniW, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, kniB
        ];

        testPieceBetterPosition(position, 'Knight');
    });

    it('must provide the best move (position) for a Rook', function () {

        var rooW = {type: 'R', side: 'W'};
        var rooB = {type: 'R', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, rooW, null, null, null, null,
            null, null, null, null, rooB, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        testPieceBetterPosition(position, 'Rook');
    });

    it('must provide the best move (position) for a Bishop', function () {

        var bisW = {type: 'B', side: 'W'};
        var bisB = {type: 'B', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.board = [
            null, null, bisW, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, bisB, null, null, null, null, null
        ];

        testPieceBetterPosition(position, 'Bishop');
    });

    it('must provide the best move (position) for a Queen', function () {

        var queW = {type: 'Q', side: 'W'};
        var queB = {type: 'Q', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, queW, null, null, null, null, null,
            null, null, null, null, null, queB, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        testPieceBetterPosition(position, 'Queen');
    });

    it('must provide the best move (position) for a King', function () {

        var kinW = {type: 'K', side: 'W'};
        var kinB = {type: 'K', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, kinW, null, null, null, null, null,
            null, null, null, null, null, kinB, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        testPieceBetterPosition(position, 'King');
    });
});
