'use strict';

var cutoffs = [];
var consoleTree = [];
var nbNodeSearched = 0;
var nbCutoffs = 0;

var watches = require('./watches');
var enabled = true;

function setEnabled(enabledFlag) {
    enabled = enabledFlag;
}

/**
 * Add a cutoff node.
 *
 * @param path The node path
 * @param alpha The alpha
 * @param beta The beta
 * @param score The score
 */
function addCutoffNode(path, alpha, beta, depth, score) {
    cutoffs.push({
        path: path,
        alpha: depth%2 === 0 ? alpha : beta,
        beta: depth%2 === 0 ? beta : alpha,
        score: score,
    });
}


/**
 * Add a search node.
 *
 * @param path The node path
 * @param alpha The alpha
 * @param beta The beta
 * @param score The score
 */
function addSearchNode(path, alpha, beta, depth, score) {
    consoleTree.push(
        {
            path: path,
            alpha: alpha,
            beta: beta,
            depth: depth,
            score: score
        }
    );
}

/**
 * Start the watch. If the watch does not exist, iy is created.
 *
 * @param itemKey The watch key
 */
function startWatch(itemKey) {
    if(enabled) {
       watches.startWatch(itemKey)
    }
}

/**
 * Stop the watch.
 *
 * @param itemKey The watch key
 */
function stopWatch(itemKey) {
    if(enabled) {
        watches.stopWatch(itemKey)
    }
}

/**
 * Reset all monitoring variables.
 */
function reset() {

    if(enabled) {
        cutoffs.splice(0, cutoffs.length);
        consoleTree.splice(0, consoleTree.length);
        nbNodeSearched = 0;
        nbCutoffs = 0;

        watches.reset();
    }
}

/**
 * Clear all monitoring devices.
 */
function clear() {
    if (enabled) {

        cutoffs.splice(0, cutoffs.length);
        consoleTree.splice(0, consoleTree.length);
        nbNodeSearched = 0;
        nbCutoffs = 0;

        watches.clear();
    }
}

function dumpLogs(full) {
    if (enabled) {

        console.log(nbNodeSearched + ' node searched');
        console.log(nbCutoffs + ' cut-offs');

        //Log watches
        watches.dumpLogs();

        if(full) {
            var strings;
            if (cutoffs.length > 0) {
                strings = ['--CUTOFFS--'];
                cutoffs.forEach(function (cutoff) {
                    strings.push('\n');
                    strings.push('{'
                        + 'path: ' + cutoff.path
                        + ',alpha: ' + cutoff.alpha
                        + ',beta: ' + cutoff.beta
                        + ',score: ' + cutoff.score
                        + '}');
                });
                console.log(strings.join(''));
            }

            if (consoleTree.length > 0) {
                strings = ['--TREE--'];
                consoleTree.forEach(function (node) {
                    strings.push('\n');
                    strings.push('{'
                        + 'path: ' + node.path
                        + ',type: ' + (node.depth % 2 === 1 ? 'min' : 'max')
                        + ',alpha: ' + node.alpha
                        + ',beta: ' + node.beta
                        + ',score: ' + node.score
                        + '}');
                });
                console.log(strings.join(''));
            }
        }
    }
}

module.exports.addSearchNode = addSearchNode;
module.exports.addCutoffNode = addCutoffNode;
module.exports.setEnabled = setEnabled;
module.exports.startWatch = startWatch;
module.exports.stopWatch = stopWatch;
module.exports.dumpLogs = dumpLogs;
module.exports.clear = clear;
module.exports.reset = reset;