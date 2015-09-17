'use strict';
var assert = require('assert');
var alphaBeta = require('../../src/search/alpha-beta');
var evaluatorBoard = require('../../src/evaluation/evaluator-board');
var chessRules = require('chess-rules');
var _monitor = require('../../src/monitoring/monitoring');
_monitor.setEnabled(false);

describe('alpha-beta-basic drive position', function () {

    /**
     * Position the piece in a bad position and assert that the algorithm make them reach a better position.
     */
    function testPieceBetterPosition(position, pieceName) {
        var depth = 2;
        alphaBeta.setDepth(depth);
        var initialScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
        var moveText = alphaBeta.getNextMove(position);
        var move = chessRules.pgnToMove(position, moveText);
        var tmpPosition = chessRules.applyMove(position,  move);
        tmpPosition.turn = position.turn;
        var moveScore = evaluatorBoard.evaluateBoard(tmpPosition, 0, 'basic');
        assert(initialScore <= moveScore, 'Not a good ' + pieceName + ' Pawn move (depth = ' + depth + ')!');
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

        position.turn = 'W';
        testPieceBetterPosition(position, 'Pawn');
        position.turn = 'B';
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

        position.turn = 'W';
        testPieceBetterPosition(position, 'Knight');
        position.turn = 'B';
        testPieceBetterPosition(position, 'Knoght');
    });

    it('must provide the best move (position) for a Rook', function () {
        this.timeout(10000);
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

        position.turn = 'W';
        testPieceBetterPosition(position, 'Rook');
        position.turn = 'B';
        testPieceBetterPosition(position, 'Rook');
    });

    it('must provide the best move (position) for a Bishop', function () {
        this.timeout(10000);
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

        position.turn = 'W';
        testPieceBetterPosition(position, 'Bishop');
        position.turn = 'B';
        testPieceBetterPosition(position, 'Bishop');
    });

    it('must provide the best move (position) for a Queen', function () {
        this.timeout(100000);
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

        position.turn = 'W';
        testPieceBetterPosition(position, 'Queen');
        position.turn = 'B';
        testPieceBetterPosition(position, 'Queen');
    });

    it('must provide the best move (position) for a King', function () {

        var kinW = {type: 'K', side: 'W'};
        var kinB = {type: 'K', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.castlingFlags = {
            'W': {'K': false, 'Q': false},
            'B': {'K': false, 'Q': false}
        };
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

        position.turn = 'W';
        testPieceBetterPosition(position, 'King');
        position.turn = 'B';
        testPieceBetterPosition(position, 'King');
    });
});

describe('alpha-beta-basic depth', function () {

    it('must provide a better white move with depth 1', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'W';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, pwnW, null, null, null,
            null, null, null, pwnB, null, pwnB, null, null,
            null, null, pwnB, null, null, null, null, null,
            null, null, null, null, pwnB, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 1, any capture seems to be the best move
        alphaBeta.setDepth(1);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "exd3" || moveText === "exf3");
    });

    it('must provide a better white move with depth 2', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'W';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, pwnW, null, null, null,
            null, null, null, pwnB, null, pwnB, null, null,
            null, null, pwnB, null, null, null, null, null,
            null, null, null, null, pwnB, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 2, the capture of f3 seems to be safer (because black can retaliate in d3)
        alphaBeta.setDepth(2);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "exf3");
    });

    it('must provide a better white move with depth 3', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'W';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, pwnW, null, null, null,
            null, null, null, pwnB, null, pwnB, null, null,
            null, null, pwnB, null, null, null, null, null,
            null, null, null, null, pwnB, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 3, the capture of f3 still seems to be safer as white can progress with his pawn
        alphaBeta.setDepth(3);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "exf3");
    });

    it('must provide a better white move with depth 4', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'W';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, pwnW, null, null, null,
            null, null, null, pwnB, null, pwnB, null, null,
            null, null, pwnB, null, null, null, null, null,
            null, null, null, null, pwnB, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 4, white know that black will end up capturing his pawn in the f column. The best move is to
        //not get your pawn captured in e4
        alphaBeta.setDepth(4);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "e4");
    });

    it('must provide a better black move with depth 1', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'B';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, pwnW, null, null, null, null,
            null, null, null, null, null, pwnW, null, null,
            null, null, pwnW, null, pwnW, null, null, null,
            null, null, null, pwnB, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 1, any capture seems to be the best move
        alphaBeta.setDepth(1);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "dxc6" || moveText === "dxe6");
    });

    it('must provide a better black move with depth 2', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'B';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, pwnW, null, null, null, null,
            null, null, null, null, null, pwnW, null, null,
            null, null, pwnW, null, pwnW, null, null, null,
            null, null, null, pwnB, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 2, the capture of c6 seems to be safer (because white can retaliate in e6)
        alphaBeta.setDepth(2);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "dxc6");
    });

    it('must provide a better black move with depth 3', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'B';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, pwnW, null, null, null, null,
            null, null, null, null, null, pwnW, null, null,
            null, null, pwnW, null, pwnW, null, null, null,
            null, null, null, pwnB, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 3, the capture of c6 still seems to be safer as black can progress with his pawn
        alphaBeta.setDepth(3);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "dxc6");
    });

    it('must provide a better black move with depth 4', function () {

        var pwnW = {type: 'P', side: 'W'};
        var pwnB = {type: 'P', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'B';
        position.board = [
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, pwnW, null, null, null, null,
            null, null, null, null, null, pwnW, null, null,
            null, null, pwnW, null, pwnW, null, null, null,
            null, null, null, pwnB, null, null, null, null,
            null, null, null, null, null, null, null, null
        ];

        //With depth 4, white know that black will end up capturing his pawn in the c column. The best move is to
        //not get your pawn captured in d5
        alphaBeta.setDepth(4);
        var moveText = alphaBeta.getNextMove(position);
        assert(moveText === "d5");
    });
});

describe('alpha-beta-basic end', function () {

    it('must provide a finishing black move', function () {

        var kinW = {type: 'K', side: 'W'};
        var kinB = {type: 'K', side: 'B'};
        var queB = {type: 'Q', side: 'B'};
        var rooB = {type: 'R', side: 'B'};
        var position = chessRules.getInitialPosition();
        position.turn = 'B';
        position.board = [
            kinW, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, rooB, null, kinB, queB, null, null, null
        ];
        //Qa4 is the move that will make the white player check mate

        alphaBeta.setDepth(2);
        var initialScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
        var moveText = alphaBeta.getNextMove(position);
        var move = chessRules.pgnToMove(position, moveText);
        position = chessRules.applyMove(position,  move);
        var moveScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
        assert(initialScore >= moveScore, 'Not a good move move!');
        assert(moveText === "Qa4+", 'Not the best move!');
        assert(chessRules.getGameStatus(position) === 'BLACKWON', 'Not the best move!');
    });

    it('must provide a finishing white move', function () {

        var kinB = {type: 'K', side: 'B'};
        var kinW = {type: 'K', side: 'W'};
        var queW = {type: 'Q', side: 'W'};
        var rooW = {type: 'R', side: 'W'};
        var position = chessRules.getInitialPosition();
        position.turn = 'W';
        position.board = [
            null, rooW, null, kinW, queW, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            kinB, null, null, null, null, null, null, null
        ];
        //Qa5 is the move that will make the white player check mate

        var initialScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');

        alphaBeta.setDepth(2);
        position.turn = 'W';
        var moveText = alphaBeta.getNextMove(position);
        var move = chessRules.pgnToMove(position, moveText);
        position = chessRules.applyMove(position,  move);
        var moveScore = evaluatorBoard.evaluateBoard(position, 0, 'basic');
        assert(initialScore >= moveScore, 'Not a good move move!');
        assert(moveText === "Qa5+", 'Not the best move!');
        assert(chessRules.getGameStatus(position) === 'WHITEWON', 'Not the best move!');
    });
});

describe('alpha-beta-basic timeout', function () {

    it('must provide a move with a timeout', function () {
        this.timeout(11000);
        alphaBeta.setTimeout(10000);
        alphaBeta.setDepth(9);

        var position = chessRules.getInitialPosition();

        var before = new Date().getTime();
        var moveText = alphaBeta.getNextMove(position);
        var getNextMoveTime = new Date().getTime() - before;
        console.log('getNextMoveTime: ' + getNextMoveTime);

        assert(moveText !== null);
        assert(getNextMoveTime <= 10500);
        assert(getNextMoveTime >= 9500);
    });
});
