'use strict';
var assert = require('assert');
var chessAI = require('../src/');
var chessRules = require('chess-rules');
var _ = require('underscore');

//describe('AI computer challenge', function () {
//    it('must provide a valid initial move as white', function () {
//        var plys = 20;
//        this.timeout(plys*100000);
//        var position = chessRules.getInitialPosition();
//        for (var i=0; i<plys; i++) {
//            console.log(chessRules.positionToString(position, true));
//            var moveText = chessAI.playPosition(position);
//            var move = chessRules.pgnToMove(position, moveText);
//            position = chessRules.applyMove(position, move);
//        }
//    });
//});

describe('ai-test-basic playPosition', function () {
    it('must provide a valid initial move as white', function () {
        this.timeout(10000);
        var position = chessRules.getInitialPosition();

        var moveText = chessAI.playPosition(position);
        var move = chessRules.pgnToMove(position, moveText);

        var availableMoves = chessRules.getAvailableMoves(position);

        var moveIsValid = false;
        availableMoves.some(function (v) {
            if (_.isMatch(v, move)) {
                moveIsValid = true;
                return true;
            }
            return false;
        });

        assert(moveIsValid, 'Move is valid');
    });

     it('must provide a valid move in reply to first white move', function () {
         this.timeout(10000);
         var position = chessRules.getInitialPosition();
         var moves = ['e4'];

         moves.forEach(function (move) {
            var m = chessRules.pgnToMove(position, move);
            position = chessRules.applyMove(position, m);
         });

         var moveText = chessAI.playPosition(position);
         var move = chessRules.pgnToMove(position, moveText);
         var availableMoves = chessRules.getAvailableMoves(position);

         var moveIsValid = false;
         availableMoves.forEach(function (v) {
             if (_.isMatch(v, move)) {
                 moveIsValid = true;
                 return true;
             }
             return false;
         });

         assert(moveIsValid, 'Move is valid');
     });
});

describe('ai-test-basic play', function () {
    it('must provide a valid initial move as white', function () {
        this.timeout(10000);
        var position = chessRules.getInitialPosition();
        var availableMoves = chessRules.getAvailableMoves(position);

        var moves = [];
        var moveText = chessAI.play(moves);
        var move = chessRules.pgnToMove(position, moveText);

        var moveIsValid = false;
        availableMoves.forEach(function (v) {
            if (_.isMatch(v, move)) {
                moveIsValid = true;
                return true;
            }
            return false;
        });

        assert(moveIsValid, 'Move is valid');
    });

    it('must provide a valid move in reply to first white move', function () {
        this.timeout(10000);
        var moves = ['e4'];
        var moveText = chessAI.play(moves);

        var position = chessRules.getInitialPosition();
        moves.forEach(function (mt) {
            var m = chessRules.pgnToMove(position, mt);
            position = chessRules.applyMove(position, m);
        });

        var availableMoves = chessRules.getAvailableMoves(position);
        var move = chessRules.pgnToMove(position, moveText);

        var moveIsValid = false;
        availableMoves.forEach(function (v) {
            if (_.isMatch(v, move)) {
                moveIsValid = true;
                return true;
            }
            return false;
        });

        assert(moveIsValid, 'Move is valid');
    });
});

