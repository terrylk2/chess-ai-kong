'use strict';
var assert = require('assert');
var watches = require('../../src/monitoring/watches');

describe('watches', function () {

    it('must provide a simple stopwatch', function () {

        watches.clear();
        var wrapTime = new Date().getTime();
        watches.startWatch('test1');
        do {} while (new Date().getTime() - wrapTime <4);
        watches.stopWatch('test1');
        wrapTime = new Date().getTime() - wrapTime;

        console.log(watches.getWatch('test1').watchToString());
        assert(wrapTime >= watches.getWatch('test1').duration);
        assert(watches.getWatch('test1').startCount === 1);

        wrapTime = new Date().getTime();
        watches.startWatch('test1');
        do {} while (new Date().getTime() - wrapTime <4);
        watches.stopWatch('test1');
        wrapTime = new Date().getTime() - wrapTime;

        console.log(watches.getWatch('test1').watchToString());
        assert(wrapTime < watches.getWatch('test1').duration);
        assert(watches.getWatch('test1').startCount === 2);
    });

    it('must provide multiple stopwatches with key-mapping', function () {

        watches.clear();
        var wrapTime = new Date().getTime();
        watches.startWatch('test1');
        do {} while (new Date().getTime()-wrapTime <4);
        watches.stopWatch('test1');
        wrapTime = new Date().getTime() - wrapTime;

        assert(wrapTime >= watches.getWatch('test1').duration);
        assert(watches.getWatch('test1').startCount === 1);

        wrapTime = new Date().getTime();
        watches.startWatch('test1');
        do {} while (new Date().getTime() - wrapTime <4);
        watches.stopWatch('test1');
        wrapTime = new Date().getTime() - wrapTime;

        assert(wrapTime < watches.getWatch('test1').duration);
        assert(watches.getWatch('test1').startCount === 2);

        wrapTime = new Date().getTime();
        watches.startWatch('test2');
        do {} while (new Date().getTime() - wrapTime <4);
        watches.stopWatch('test2');
        wrapTime = new Date().getTime() - wrapTime;

        assert(wrapTime >= watches.getWatch('test2').duration);
        assert(watches.getWatch('test2').startCount === 1);
        assert(wrapTime < watches.getWatch('test1').duration);
        assert(watches.getWatch('test1').startCount === 2);
    });

    it('must provide a way to resetAll all watches', function () {

        watches.clear();
        var wrapTime = new Date().getTime();
        watches.startWatch('test1');
        do {} while (new Date().getTime() - wrapTime <4);
        watches.stopWatch('test1');
        wrapTime = new Date().getTime() - wrapTime;

        assert(wrapTime >= watches.getWatch('test1').duration);
        assert(watches.getWatch('test1').startCount === 1);

        watches.reset();
        assert(watches.getWatch('test1').duration === 0);
        assert(watches.getWatch('test1').startCount === 0);
    });

    it('must provide a way to clearAll all the watches', function () {

        watches.clear();

        watches.startWatch('test1');
        watches.stopWatch('test1');
        watches.startWatch('test2');
        watches.startWatch('test3');
        watches.stopWatch('test2');

        assert(watches.getWatch('test1') !== undefined);
        assert(watches.getWatch('test2') !== undefined);
        assert(watches.getWatch('test3') !== undefined);

        watches.clear();
        assert(watches.getWatch('test1') === undefined);
        assert(watches.getWatch('test2') === undefined);
        assert(watches.getWatch('test3') === undefined);
    });
});