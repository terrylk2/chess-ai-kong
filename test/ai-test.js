'use strict';
var assert = require('assert');
var aiPlayer = require('../src/');
var chessRules = require('chess-rules');
var _ = require('underscore');

beforeEach(function() {
    aiPlayer.setOptions({
        depth: 3,
        monitor: false,
        strategy: 'basic',
        timeout: 10000
    });
});

//describe('AI computer challenge', function () {
//    it('must provide a valid initial move as white', function () {
//        var plys = 20;
//        this.timeout(plys*100000);
//        var position = chessRules.getInitialPosition();
//        for (var i=0; i<plys; i++) {
//            console.log(chessRules.positionToString(position, true));
//            var moveText = aiPlayer.playPosition(position);
//            var move = chessRules.pgnToMove(position, moveText);
//            position = chessRules.applyMove(position, move);
//        }
//    });
//});

describe('ai-test', function () {
    describe('#playPosition', function() {
        it('must provide a valid initial move as white', function () {
            this.timeout(10000);
            var position = chessRules.getInitialPosition();

            var moveText = aiPlayer.playPosition(position);
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

            var moveText = aiPlayer.playPosition(position);
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

    describe('#play', function() {
        it('must provide a valid initial move as white', function () {
            this.timeout(10000);
            var position = chessRules.getInitialPosition();
            var availableMoves = chessRules.getAvailableMoves(position);

            var moves = [];
            var moveText = aiPlayer.play(moves);
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
            var moveText = aiPlayer.play(moves);

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

    describe('#setOptions', function() {
        it('must provide a move according to settings', function () {
            var options = {
                depth : 4,
                monitor : false,
                strategy: 'random',
                timeout: 500
            };
            aiPlayer.setOptions(options);
            var before = new Date().getTime();
            var move = aiPlayer.play([]);
            var after = new Date().getTime() - before;

            assert(move !== null, 'Wrong move!');
            //With an error of 200 ms
            assert(after <= 700, 'Wrong timeout option!');
        });
    });
});
