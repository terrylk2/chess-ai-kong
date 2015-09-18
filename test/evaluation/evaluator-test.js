//'use strict';
//var assert = require('assert');
//var evaluatorBoard = require('../../src/evaluation/evaluator-board');
//var chessRules = require('chess-rules');
//
//describe('evaluator-board', function () {
//
//    describe('#initial', function() {
//        it('must provide a 0 score on initial board', function () {
//
//            var position = chessRules.getInitialPosition();
//            assert(evaluatorBoard.evaluateBoard(position, 0, 'basic') === 0);
//        });
//
//        it('must provide logical score by central symmetry', function () {
//
//            var position = chessRules.getInitialPosition();
//
//            position.turn = 'W';
//            var whiteScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
//            position.turn = 'B';
//            var blackScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
//
//            assert(whiteScore === blackScore);
//        });
//    });
//
//    describe('#ratePieces', function() {
//
//        it('must provide a better score after capture', function () {
//
//            var kniW = {type: 'N', side: 'W'};
//            var kniB = {type: 'N', side: 'B'};
//            var position = {
//                turn: 'W',
//                castlingFlags: {
//                    'W': {'K': true, 'Q': true},
//                    'B': {'K': true, 'Q': true}
//                },
//                lastPawnMoveColumn: null,
//                check: false,
//                board: [
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, kniW, null, null, null, null, null,
//                    kniB, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null
//                ]
//            };
//            var beforeCapture = evaluatorBoard.evaluateBoard(position, 0, 'basic');
//
//            //Capture the White Knight
//            position.turn = 'W';
//            var move = chessRules.pgnToMove(position, 'Na4');
//            var capturePosition = chessRules.applyMove( position, move);
//
//            var blackAfterCapture = evaluatorBoard.evaluateBoard(capturePosition, 0, 'basic');
//            capturePosition.turn = 'W';
//            var whiteAfterCapture = evaluatorBoard.evaluateBoard(capturePosition, 0, 'basic');
//
//            assert(beforeCapture < whiteAfterCapture);
//            assert(beforeCapture > blackAfterCapture);
//
//            //Capture the White Knight
//            position.turn = 'B';
//            move = chessRules.pgnToMove(position, 'Nc3');
//            capturePosition = chessRules.applyMove(position, move);
//
//            whiteAfterCapture = evaluatorBoard.evaluateBoard(capturePosition, 0, 'basic');
//            capturePosition.turn = 'B';
//            blackAfterCapture = evaluatorBoard.evaluateBoard(capturePosition, 0, 'basic');
//
//            assert(beforeCapture < blackAfterCapture);
//            assert(beforeCapture > whiteAfterCapture);
//        });
//    });
//
//    describe('#ratePositions', function() {
//
//        it('must provide a better score after pawn move to center', function () {
//
//            var position = chessRules.getInitialPosition();
//            var initialScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
//
//            var move = chessRules.pgnToMove(position, 'e4');
//            position = chessRules.applyMove(position, move);
//
//            var blackScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
//            position.turn = 'W';
//            var whiteScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
//
//            assert(initialScore < whiteScore);
//            assert(initialScore > blackScore);
//        });
//    });
//
//    /**
//     * TODO: castled flags to score castled King are needed to rate defense.
//     */
//    describe('#rateDefense', function() {
//        //it('must provide a better score after king side castling', function () {
//        //
//        //    var kinW = {type: 'K', side: 'W'};
//        //    var kinB = {type: 'K', side: 'B'};
//        //    var rooW = {type: 'R', side: 'W'};
//        //    var rooB = {type: 'R', side: 'B'};
//        //    var position = {
//        //        turn: 'W',
//        //        castlingFlags: {
//        //            'W': {'K': true, 'Q': true},
//        //            'B': {'K': true, 'Q': true}
//        //        },
//        //        lastPawnMoveColumn: null,
//        //        check: false,
//        //        board: [
//        //            rooW, null, null, null, kinW, null, null, rooW,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            rooB, null, null, null, kinB, null, null, rooB
//        //        ]
//        //    };
//        //    var beforeCastling = evaluatorBoard.evaluateBoard( position, 0, 'basic');
//        //
//        //    //White King-side castling
//        //    position.turn = 'W';
//        //    var move = chessRules.pgnToMove(position, 'O-O');
//        //    var castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    var blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //    castlingPosition.turn = 'W';
//        //    var whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //
//        //    assert(beforeCastling < whiteAfterCastling);
//        //    assert(beforeCastling > blackAfterCastling);
//        //
//        //    beforeCastling = evaluatorBoard.evaluateBoard( position, 0, 'basic');
//        //
//        //    //Black King-side castling
//        //    position.turn = 'B';
//        //    move = chessRules.pgnToMove(position, 'O-O');
//        //    castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition,0, 'basic');
//        //    castlingPosition.turn = 'B';
//        //    blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition,0, 'basic');
//        //
//        //    assert(beforeCastling < blackAfterCastling);
//        //    assert(beforeCastling > whiteAfterCastling);
//        //});
//        //
//        //it('must provide a better score after queen side castling', function () {
//        //
//        //    var kinW = {type: 'K', side: 'W'};
//        //    var kinB = {type: 'K', side: 'B'};
//        //    var rooW = {type: 'R', side: 'W'};
//        //    var rooB = {type: 'R', side: 'B'};
//        //    var position = {
//        //        turn: 'W',
//        //        castlingFlags: {
//        //            'W': {'K': true, 'Q': true},
//        //            'B': {'K': true, 'Q': true}
//        //        },
//        //        lastPawnMoveColumn: null,
//        //        check: false,
//        //        board: [
//        //            rooW, null, null, null, kinW, null, null, rooW,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            rooB, null, null, null, kinB, null, null, rooB
//        //        ]
//        //    };
//        //    var beforeCastling = evaluatorBoard.evaluateBoard( position, 0,  'basic');
//        //
//        //    //White Queen-side castling
//        //    position.turn = 'W';
//        //    var move = chessRules.pgnToMove(position, 'O-O-O');
//        //    var castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    var blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //    castlingPosition.turn = 'W';
//        //    var whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //
//        //    assert(beforeCastling < whiteAfterCastling);
//        //    assert(beforeCastling > blackAfterCastling);
//        //
//        //    beforeCastling = evaluatorBoard.evaluateBoard( position, 0,  'basic');
//        //
//        //    //Black Queen-side castling
//        //    position.turn = 'B';
//        //    move = chessRules.pgnToMove(position, 'O-O-O');
//        //    castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //    castlingPosition.turn = 'B';
//        //    blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //
//        //    assert(beforeCastling < blackAfterCastling);
//        //    assert(beforeCastling > whiteAfterCastling);
//        //});
//        //
//        //
//        //it('must provide a reduced score after king side castling not possible', function () {
//        //
//        //    var kinW = {type: 'K', side: 'W'};
//        //    var kinB = {type: 'K', side: 'B'};
//        //    var rooW = {type: 'R', side: 'W'};
//        //    var rooB = {type: 'R', side: 'B'};
//        //    var position = {
//        //        turn: 'W',
//        //        castlingFlags: {
//        //            'W': {'K': true, 'Q': true},
//        //            'B': {'K': true, 'Q': true}
//        //        },
//        //        lastPawnMoveColumn: null,
//        //        check: false,
//        //        board: [
//        //            rooW, null, null, null, kinW, null, null, rooW,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            rooB, null, null, null, kinB, null, null, rooB
//        //        ]
//        //    };
//        //    var beforeCastling = evaluatorBoard.evaluateBoard( position, 0, 'basic');
//        //
//        //    //White King-side castling
//        //    position.turn = 'W';
//        //    var move = chessRules.pgnToMove(position, 'O-O');
//        //    var castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    var blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //    castlingPosition.turn = 'W';
//        //    var whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //
//        //    assert(beforeCastling < whiteAfterCastling);
//        //    assert(beforeCastling > blackAfterCastling);
//        //
//        //    beforeCastling = evaluatorBoard.evaluateBoard( position, 0, 'basic');
//        //
//        //    //Black King-side castling
//        //    position.turn = 'B';
//        //    move = chessRules.pgnToMove(position, 'O-O');
//        //    castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition,0, 'basic');
//        //    castlingPosition.turn = 'B';
//        //    blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition,0, 'basic');
//        //
//        //    assert(beforeCastling < blackAfterCastling);
//        //    assert(beforeCastling > whiteAfterCastling);
//        //});
//        //
//        //it('must provide a reduced score after queen side castling not possible', function () {
//        //
//        //    var kinW = {type: 'K', side: 'W'};
//        //    var kinB = {type: 'K', side: 'B'};
//        //    var rooW = {type: 'R', side: 'W'};
//        //    var rooB = {type: 'R', side: 'B'};
//        //    var position = {
//        //        turn: 'W',
//        //        castlingFlags: {
//        //            'W': {'K': true, 'Q': true},
//        //            'B': {'K': true, 'Q': true}
//        //        },
//        //        lastPawnMoveColumn: null,
//        //        check: false,
//        //        board: [
//        //            rooW, null, null, null, kinW, null, null, rooW,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            null, null, null, null, null, null, null, null,
//        //            rooB, null, null, null, kinB, null, null, rooB
//        //        ]
//        //    };
//        //    var beforeCastling = evaluatorBoard.evaluateBoard( position, 0,  'basic');
//        //
//        //    //White Queen-side castling
//        //    position.turn = 'W';
//        //    var move = chessRules.pgnToMove(position, 'Kf1');
//        //    var castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    var blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //    castlingPosition.turn = 'W';
//        //    var whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //
//        //    assert(beforeCastling > whiteAfterCastling);
//        //    assert(beforeCastling < blackAfterCastling);
//        //
//        //    beforeCastling = evaluatorBoard.evaluateBoard( position, 0,  'basic');
//        //
//        //    //Black Queen-side castling
//        //    position.turn = 'B';
//        //    move = chessRules.pgnToMove(position, 'Kf8');
//        //    castlingPosition = chessRules.applyMove(position, move);
//        //
//        //    whiteAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //    castlingPosition.turn = 'B';
//        //    blackAfterCastling = evaluatorBoard.evaluateBoard(castlingPosition, 0, 'basic');
//        //
//        //    assert(beforeCastling > blackAfterCastling);
//        //    assert(beforeCastling < whiteAfterCastling);
//        //});
//    });
//
//    describe('#rateMovability', function() {
//
//        it('must provide a better score after check', function () {
//            var kinW = {type: 'K', side: 'W'};
//            var kinB = {type: 'K', side: 'B'};
//            var rooW = {type: 'R', side: 'W'};
//            var rooB = {type: 'R', side: 'B'};
//            var position = {
//                turn: 'W',
//                castlingFlags: {
//                    'W': {'K': true, 'Q': true},
//                    'B': {'K': true, 'Q': true}
//                },
//                lastPawnMoveColumn: null,
//                check: false,
//                board: [
//                    null, null, null, kinW, null, null, null, rooW,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null,
//                    rooB, null, null, null, kinB, null, null, null
//                ]
//            };
//            var beforeMate = evaluatorBoard.evaluateBoard( position, 0, 'basic');
//
//            //Black mate
//            position.turn = 'W';
//            var move = chessRules.pgnToMove(position, 'Re1');
//            var matePosition = chessRules.applyMove(position, move);
//
//            var blackAfterMate = evaluatorBoard.evaluateBoard(matePosition, 0, 'basic');
//
//            assert(beforeMate > blackAfterMate);
//
//            //White mate
//            position.turn = 'B';
//            move = chessRules.pgnToMove(position, 'Rd8');
//            matePosition = chessRules.applyMove(position, move);
//
//            var whiteAfterMate = evaluatorBoard.evaluateBoard(matePosition, 0, 'basic');
//
//            assert(beforeMate > whiteAfterMate);
//        });
//    });
//});