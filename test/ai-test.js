//'use strict';
//var assert = require('assert');
//var chessAI = require('../src/');
//var chessRules = require('chess-rules');
//var _ = require('underscore');
//
//describe('AI computer challenge', function () {
//    it('must provide a valid initial move as white', function () {
//        this.timeout(150000);
//        var position = chessRules.getInitialPosition();
//        for (var i=0; i<10; i++) {
//            console.log(chessRules.positionToString(position, true));
//
//            var movetext = chessAI.play(position);
//
//            var availableMoves = chessRules.getAvailableMoves(position);
//            var move = chessRules.pgnToMove(position, movetext);
//
//            var moveIsValid = false;
//            availableMoves.forEach(function (v) {
//                if (_.isMatch(v, move)) {
//                    moveIsValid = true;
//                }
//            });
//
//            assert(moveIsValid, 'Move is valid');
//
//            position = chessRules.applyMove(position, move);
//        }
//    });
//});
