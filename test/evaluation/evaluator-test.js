'use strict';
var assert = require('assert');
var evaluator = require('../../src/evaluation/evaluator');
var chessRules = require('chess-rules');

describe('evaluator', function () {
    it('must provide a 0 score on initial board', function () {

        var position = chessRules.getInitialPosition();

        assert(evaluator.evaluatePosition(position, 'basic') === 0);
    });

    it('must provide logical score by central symmetry', function () {

        var position = chessRules.getInitialPosition();

        position.turn = 'W';
        var whiteScore = evaluator.evaluatePosition(position, 'basic');
        position.turn = 'B';
        var blackScore = evaluator.evaluatePosition(position, 'basic');

        assert(whiteScore === blackScore);
    });


    it('must provide a better score when pawn move to center', function () {

        //White move
        var position = chessRules.getInitialPosition();
        var move = chessRules.pgnToMove(position, 'e4');

        var initialScore = evaluator.evaluatePosition(position, 'basic');

        position = chessRules.applyMove(position, move);

        var blackScore = evaluator.evaluatePosition(position, 'basic');
        position.turn = 'W';
        var whiteScore = evaluator.evaluatePosition(position, 'basic');

        assert(initialScore < whiteScore);
        assert(initialScore > blackScore);
    });
});