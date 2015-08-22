'use strict';
var assert = require('assert');
var alphaBeta = require('../../src/evaluation/alpha-beta');
var chessRules = require('chess-rules');
var _ = require('underscore');

describe('alpha-beta search', function () {
    it('must provide a valid initial move as white', function () {

        var position = chessRules.getInitialPosition();

        var movetext = alphaBeta.getNextMove(position);
        var move = chessRules.pgnToMove(position, movetext);

        var availableMoves = chessRules.getAvailableMoves(position);

        var moveIsValid = false;
        availableMoves.forEach(function (v) {
            if (_.isMatch(v, move)) {
                moveIsValid = true;
            }
        });

        assert(moveIsValid, 'Move is valid');
    });

     it('must provide a valid move in reply to first white move', function () {

         this.timeout(5000);
         var position = chessRules.getInitialPosition();
         var moves = ['e4'];

         moves.forEach(function (move) {
            var m = chessRules.pgnToMove(position, move);
            position = chessRules.applyMove(position, m);
         });

         var movetext = alphaBeta.getNextMove(position);
         var move = chessRules.pgnToMove(position, movetext);
         var availableMoves = chessRules.getAvailableMoves(position);

         var moveIsValid = false;
         availableMoves.forEach(function (v) {
            if (_.isMatch(v, move)) {
                moveIsValid = true;
            }
         });

         assert(moveIsValid, 'Move is valid');
     });

});


describe('alpha-beta piece moves', function () {
    it('must provide the best move for a Pawn', function () {

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

        var movetext = alphaBeta.getNextMove(position);
        var move = chessRules.pgnToMove(position, movetext);

        var availableMoves = chessRules.getAvailableMoves(position);

        var moveIsValid = false;
        availableMoves.forEach(function (v) {
            if (_.isMatch(v, move)) {
                moveIsValid = true;
            }
        });

        assert(moveIsValid, 'Move is valid');
    });
});
