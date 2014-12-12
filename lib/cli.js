'use strict';

var fs = require('fs');
var program = require('commander');
var pkg = require('../package');
var SVGO = require('../');

program
    .version(pkg.version)
    .usage('-i <input> -o <output>')
    .option('-i, --input [file]', 'input file')
    .option('-o, --output [file]', 'output file')
    .parse(process.argv);

if (program.input) {
    fs.readFile(program.input, { encoding: 'utf-8' }, function(err, data) {
        if (err) {
            throw err;
        }

        optimizeString(data);
    });
}

// output help by default
// http://nodejs.org/api/tty.html#tty_tty
if (!program.input && process.stdin.isTTY && process.stdout.isTTY) {
    program.help();
}

// STDIN
if (!process.stdin.isTTY) {
    var data = '';

    process.stdin
    .on('data', function(chunk) {
        data += chunk;
    })
    .once('end', function() {
        optimizeString(data);
    });
}

function optimizeString(data) {
    data = SVGO().optimize(data);

    if (program.output) {
        fs.writeFile(program.output, data, function(err) {
            if (err) {
                throw err;
            }
        });
    } else {
        console.log(data);
    }
}