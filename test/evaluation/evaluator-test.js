'use strict';
var assert = require('assert');
var evaluator = require('../../src/evaluation/evaluator');
var chessRules = require('chess-rules');

describe('evaluator-basic', function () {

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

    it('must provide a better score after pawn move to center', function () {

        var position = chessRules.getInitialPosition();
        var initialScore = evaluator.evaluatePosition(position, 'basic');

        var move = chessRules.pgnToMove(position, 'e4');
        position = chessRules.applyMove(position, move);

        var blackScore = evaluator.evaluatePosition(position, 'basic');
        position.turn = 'W';
        var whiteScore = evaluator.evaluatePosition(position, 'basic');

        assert(initialScore < whiteScore);
        assert(initialScore > blackScore);
    });

    it('must provide a better score after capture', function () {

        var kniW = {type: 'N', side: 'W'};
        var kniB = {type: 'N', side: 'B'};
        var position = {
            turn: 'W',
            castlingFlags: {
                'W': {'K': true, 'Q': true},
                'B': {'K': true, 'Q': true}
                },
            lastPawnMoveColumn: null,
            check: false,
            board: [
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, kniW, null, null, null, null, null,
                kniB, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null
            ]
        };
        var beforeCapture = evaluator.evaluatePosition(position, 'basic');

        //Capture the White Knight
        position.turn = 'W';
        var move = chessRules.pgnToMove(position, 'Na4');
        var capturePosition = chessRules.applyMove(position, move);

        var blackAfterCapture = evaluator.evaluatePosition(capturePosition, 'basic');
        capturePosition.turn = 'W';
        var whiteAfterCapture = evaluator.evaluatePosition(capturePosition, 'basic');

        assert(beforeCapture < whiteAfterCapture);
        assert(beforeCapture > blackAfterCapture);

        //Capture the White Knight
        position.turn = 'B';
        move = chessRules.pgnToMove(position, 'Nc3');
        capturePosition = chessRules.applyMove(position, move);

        whiteAfterCapture = evaluator.evaluatePosition(capturePosition, 'basic');
        capturePosition.turn = 'B';
        blackAfterCapture = evaluator.evaluatePosition(capturePosition, 'basic');

        assert(beforeCapture < blackAfterCapture);
        assert(beforeCapture > whiteAfterCapture);
    });

    it('must provide a better score after king side castling', function () {

        var kinW = {type: 'K', side: 'W'};
        var kinB = {type: 'K', side: 'B'};
        var rooW = {type: 'R', side: 'W'};
        var rooB = {type: 'R', side: 'B'};
        var position = {
            turn: 'W',
            castlingFlags: {
                'W': {'K': true, 'Q': true},
                'B': {'K': true, 'Q': true}
            },
            lastPawnMoveColumn: null,
            check: false,
            board: [
                rooW, null, null, null, kinW, null, null, rooW,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                rooB, null, null, null, kinB, null, null, rooB
            ]
        };
        var beforeCastling = evaluator.evaluatePosition(position, 'basic');

        //White King-side castling
        position.turn = 'W';
        var move = chessRules.pgnToMove(position, 'O-O');
        var castlingPosition = chessRules.applyMove(position, move);

        var blackAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');
        castlingPosition.turn = 'W';
        var whiteAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');

        assert(beforeCastling < whiteAfterCastling);
        assert(beforeCastling > blackAfterCastling);

        beforeCastling = evaluator.evaluatePosition(position, 'basic');

        //Black King-side castling
        position.turn = 'B';
        move = chessRules.pgnToMove(position, 'O-O');
        castlingPosition = chessRules.applyMove(position, move);

        whiteAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');
        castlingPosition.turn = 'B';
        blackAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');

        assert(beforeCastling < blackAfterCastling);
        assert(beforeCastling > whiteAfterCastling);
    });

    it('must provide a better score after queen side castling', function () {

        var kinW = {type: 'K', side: 'W'};
        var kinB = {type: 'K', side: 'B'};
        var rooW = {type: 'R', side: 'W'};
        var rooB = {type: 'R', side: 'B'};
        var position = {
            turn: 'W',
            castlingFlags: {
                'W': {'K': true, 'Q': true},
                'B': {'K': true, 'Q': true}
            },
            lastPawnMoveColumn: null,
            check: false,
            board: [
                rooW, null, null, null, kinW, null, null, rooW,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                rooB, null, null, null, kinB, null, null, rooB
            ]
        };
        var beforeCastling = evaluator.evaluatePosition(position, 'basic');

        //White Queen-side castling
        position.turn = 'W';
        var move = chessRules.pgnToMove(position, 'O-O-O');
        var castlingPosition = chessRules.applyMove(position, move);

        var blackAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');
        castlingPosition.turn = 'W';
        var whiteAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');

        assert(beforeCastling < whiteAfterCastling);
        assert(beforeCastling > blackAfterCastling);

        beforeCastling = evaluator.evaluatePosition(position, 'basic');

        //Black Queen-side castling
        position.turn = 'B';
        move = chessRules.pgnToMove(position, 'O-O-O');
        castlingPosition = chessRules.applyMove(position, move);

        whiteAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');
        castlingPosition.turn = 'B';
        blackAfterCastling = evaluator.evaluatePosition(castlingPosition, 'basic');

        assert(beforeCastling < blackAfterCastling);
        assert(beforeCastling > whiteAfterCastling);
    });

    it('must provide a better score after check', function () {
        var kinW = {type: 'K', side: 'W'};
        var kinB = {type: 'K', side: 'B'};
        var rooW = {type: 'R', side: 'W'};
        var rooB = {type: 'R', side: 'B'};
        var position = {
            turn: 'W',
            castlingFlags: {
                'W': {'K': true, 'Q': true},
                'B': {'K': true, 'Q': true}
            },
            lastPawnMoveColumn: null,
            check: false,
            board: [
                null, null, null, kinW, null, null, null, rooW,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                rooB, null, null, null, kinB, null, null, null
            ]
        };
        var beforeMate = evaluator.evaluatePosition(position, 'basic');

        //Black mate
        position.turn = 'W';
        var move = chessRules.pgnToMove(position, 'Re1');
        var matePosition = chessRules.applyMove(position, move);

        var blackAfterMate = evaluator.evaluatePosition(matePosition, 'basic');

        assert(beforeMate > blackAfterMate);

        //White mate
        position.turn = 'B';
        move = chessRules.pgnToMove(position, 'Rd8');
        matePosition = chessRules.applyMove(position, move);

        var whiteAfterMate = evaluator.evaluatePosition(matePosition, 'basic');

        assert(beforeMate > whiteAfterMate);
    });
});