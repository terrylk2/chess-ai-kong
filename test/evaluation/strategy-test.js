'use strict';
var assert = require('assert');
var strategy = require('../../src/evaluation/strategy');

describe('strategy-basic', function () {

    it('must provide a score for a pawn', function () {
        var whiteValue = strategy.getPieceScore({type: 'P', side:'W'}, 'basic');
        var blackValue = strategy.getPieceScore({type: 'P', side:'B'}, 'basic');
        assert(whiteValue === 100, 'Wrong value');
        assert(whiteValue === blackValue, 'Not symmetric');
    });

    it('must provide a score for a knight', function () {
        var whiteValue = strategy.getPieceScore({type: 'N', side:'W'}, 'basic');
        var blackValue = strategy.getPieceScore({type: 'N', side:'B'}, 'basic');
        assert(whiteValue === 300, 'Wrong value');
        assert(whiteValue === blackValue, 'Not symmetric');
    });

    it('must provide a score for a bishop', function () {
        var whiteValue = strategy.getPieceScore({type: 'B', side:'W'}, 'basic');
        var blackValue = strategy.getPieceScore({type: 'B', side:'B'}, 'basic');
        assert(whiteValue === 325, 'Wrong value');
        assert(whiteValue === blackValue, 'Not symmetric');
    });

    it('must provide a score for a rook', function () {
        var whiteValue = strategy.getPieceScore({type: 'R', side:'W'}, 'basic');
        var blackValue = strategy.getPieceScore({type: 'R', side:'B'}, 'basic');
        assert(whiteValue === 500, 'Wrong value');
        assert(whiteValue === blackValue, 'Not symmetric');
    });

    it('must provide a score for a queen', function () {
        var whiteValue = strategy.getPieceScore({type: 'Q', side:'W'}, 'basic');
        var blackValue = strategy.getPieceScore({type: 'Q', side:'B'}, 'basic');
        assert(whiteValue === 900, 'Wrong value');
        assert(whiteValue === blackValue, 'Not symmetric');
    });

    it('must provide a score for a king', function () {
        var whiteValue = strategy.getPieceScore({type: 'K', side:'W'}, 'basic');
        var blackValue = strategy.getPieceScore({type: 'K', side:'B'}, 'basic');
        assert(whiteValue === 32767, 'Wrong value');
        assert(whiteValue === blackValue, 'Not symmetric');
    });

    it('must provide a score for each pawn position', function () {
        var index;
        for (index = 0; index < 64; index++) {
            var whiteValue = strategy.getPositionScore({type: 'P', side:'W'}, index, 'basic');
            var blackValue = strategy.getPositionScore({type: 'P', side:'B'}, 63-index, 'basic');
            assert(whiteValue === blackValue, 'Not symmetric');
        }
    });

    it('must provide a score for each knight position', function () {
        var index;
        for (index = 0; index < 64; index++) {
            var whiteValue = strategy.getPositionScore({type: 'N', side:'W'}, index, 'basic');
            var blackValue = strategy.getPositionScore({type: 'N', side:'B'}, 63-index, 'basic');
            assert(whiteValue === blackValue, 'Not symmetric');
        }
    });

    it('must provide a score for each bishop position', function () {
        var index;
        for (index = 0; index < 64; index++) {
            var whiteValue = strategy.getPositionScore({type: 'B', side:'W'}, index, 'basic');
            var blackValue = strategy.getPositionScore({type: 'B', side:'B'}, 63-index, 'basic');
            assert(whiteValue === blackValue, 'Not symmetric');
        }
    });

    it('must provide a score for each rook position', function () {
        var index;
        for (index = 0; index < 64; index++) {
            var whiteValue = strategy.getPositionScore({type: 'R', side:'W'}, index, 'basic');
            var blackValue = strategy.getPositionScore({type: 'R', side:'B'}, 63-index, 'basic');
            assert(whiteValue === blackValue, 'Not symmetric');
        }
    });

    it('must provide a score for each queen position', function () {
        var index;
        for (index = 0; index < 64; index++) {
            var whiteValue = strategy.getPositionScore({type: 'Q', side:'W'}, index, 'basic');
            var blackValue = strategy.getPositionScore({type: 'Q', side:'B'}, 63-index, 'basic');
            assert(whiteValue === blackValue, 'Not symmetric');
        }
    });

    it('must provide a score for each king position', function () {
        var index;
        for (index = 0; index < 64; index++) {
            var whiteValue = strategy.getPositionScore({type: 'K', side:'W'}, index, 'basic');
            var blackValue = strategy.getPositionScore({type: 'K', side:'B'}, 63-index, 'basic');
            assert(whiteValue === blackValue, 'Not symmetric');
        }
    });
});
