'use strict';
var assert = require('assert');
var StopWatch = require('../../src/monitoring/stopwatch').StopWatch;

describe('stopwatch', function () {

    describe('#constructor', function() {
        it('must have consistent constructors', function () {

            var watch1 = new StopWatch(0,0,0);
            assert(watch1.startAt === 0);
            assert(watch1.duration === 0);
            assert(watch1.startCount === 0);

            watch1 = new StopWatch(1,2,3);
            assert(watch1.startAt === 1);
            assert(watch1.duration === 2);
            assert(watch1.startCount === 3);

            watch1 = new StopWatch();
            assert(watch1.startAt === 0);
            assert(watch1.duration === 0);
            assert(watch1.startCount === 0);
        });
    });

    describe('#start/stop', function () {

        it('must provide start/stop', function () {

            var watch1 = new StopWatch(0,0,0);
            var before = new Date().getTime();
            watch1.start();
            while(new Date().getTime() - before < 5) {}
            watch1.stop();

            //Assert properties
            assert(watch1.startCount === 1);
            assert(watch1.startAt === before);

            before = new Date().getTime();
            watch1.start();
            while(new Date().getTime() - before < 5) {}
            watch1.stop();

            //Assert properties
            assert(watch1.startCount === 2);
            assert(watch1.startAt === before);

        });
    });

    describe('#reset', function() {
        it('must provide reset', function () {

            var watch1 = new StopWatch();
            watch1.start();
            var before = new Date().getTime();
            while(new Date().getTime() - before <= 5) {}
            watch1.stop();

            watch1.reset();

            assert(watch1.duration === 0);
            assert(watch1.startCount === 0);
            assert(watch1.startAt === 0);

            watch1 = new StopWatch(123456,10,10);
            watch1.reset();

            assert(watch1.duration === 0);
            assert(watch1.startCount === 0);
            assert(watch1.startAt === 0);
        });
    });
});