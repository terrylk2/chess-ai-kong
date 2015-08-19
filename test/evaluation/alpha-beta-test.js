'use strict';
var assert = require('assert');
var alphaBetaSearch = require('../../src/evaluation/alpha-beta');
var chessRules = require('chess-rules');
var _ = require('underscore');

describe('Alpha Beta search', function () {
    it('must provide a valid initial move as white', function () {

        var position = chessRules.getInitialPosition();

        console.log(chessRules.positionToString(position, true));

        var movetext = alphaBetaSearch.getNextMove(position);
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

         var position = chessRules.getInitialPosition();
         var moves = ['e4'];

         moves.forEach(function (move) {
            var m = chessRules.pgnToMove(position, move);
            position = chessRules.applyMove(position, m);
         });

         var movetext = alphaBetaSearch.getNextMove(position);
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
