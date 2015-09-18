//'use strict';
//var assert = require('assert');
//var quickSort = require('../../src/search/quick-sort');
//
//describe('quick-sort', function () {
//
//    var createNumbersArray = function(length) {
//        var moves = [];
//        var i;
//        for (i = 0; i < length; i++) {
//            moves.push({'value': Math.random() * length - Math.floor(length / 2)});
//        }
//        return moves;
//    };
//
//    var createCharsArray = function() {
//        var moves = [];
//        moves.push({'value': 'd'});
//        moves.push({'value': 'h'});
//        moves.push({'value': 'd'});
//        moves.push({'value': 'x'});
//        moves.push({'value': 't'});
//        moves.push({'value': ' '});
//        moves.push({'value': '-'});
//        moves.push({'value': 'n'});
//        moves.push({'value': 'f'});
//        moves.push({'value': 'a'});
//        moves.push({'value': 'p'});
//        return moves;
//    };
//
//    describe('#sort', function() {
//        it('must sort a list of number', function () {
//
//            var moves = createNumbersArray(10);
//            var evaluatedMoves = quickSort.sortMoves(moves);
//
//            var i;
//            for (i = 0; i < moves.length - 1; i++) {
//                assert(evaluatedMoves[i].value >= evaluatedMoves[i + 1].value);
//            }
//        });
//
//        it('must sort a list of chars', function () {
//
//            var moves = createCharsArray();
//            var evaluatedMoves = quickSort.sortMoves(moves);
//
//            var i;
//            for (i = 0; i < moves.length - 1; i++) {
//                assert(evaluatedMoves[i].value >= evaluatedMoves[i + 1].value);
//            }
//        });
//    });
//
//    describe('#consistency', function() {
//        it('must detect undefined values', function () {
//            var moves = createNumbersArray(10);
//            moves.push({'values': 20});
//
//            assert.throws(function() {
//                    quickSort.sortMoves(moves);
//                }, "Undefined not detected"
//            );
//        });
//
//        it('must detect null values', function () {
//            var moves = createNumbersArray(10);
//            moves.push({'value': null});
//
//            assert.throws(function() {
//                    quickSort.sortMoves(moves);
//                }, "Null not detected"
//            );
//        });
//    });
//});